-- =============================================================================
-- Efeitos ativos (consumíveis com duração) e recarga (permanentes com cooldown).
-- Regras detalhadas em REGRAS_ITENS_EFEITOS.md.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Novos campos no catálogo de itens
-- -----------------------------------------------------------------------------
ALTER TABLE itens
  ADD COLUMN IF NOT EXISTS duracao_minutos integer,
  ADD COLUMN IF NOT EXISTS recarga_minutos integer,
  ADD COLUMN IF NOT EXISTS max_usos_dia integer;

COMMENT ON COLUMN itens.duracao_minutos IS 'Consumíveis: duração do efeito em minutos. Permanentes/armadura: null.';
COMMENT ON COLUMN itens.recarga_minutos IS 'Permanentes com recarga: minutos entre um uso e o próximo. Null = sem cooldown.';
COMMENT ON COLUMN itens.max_usos_dia IS 'Opcional: máximo de usos do item por dia por usuário. Null = ilimitado.';

-- Consumíveis devem ter duracao_minutos preenchida (validar na aplicação ao cadastrar item)
-- Permanentes com recarga devem ter recarga_minutos preenchida

-- -----------------------------------------------------------------------------
-- 2. Tabela de efeitos ativos (consumíveis em uso)
-- Um efeito por slot; cada linha tem termina_em (não acumulamos duração).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS efeitos_ativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
  slot_numero smallint NOT NULL CHECK (slot_numero >= 1 AND slot_numero <= 10),
  comeca_em timestamptz NOT NULL DEFAULT now(),
  termina_em timestamptz NOT NULL,
  criado_em timestamptz DEFAULT now() NOT NULL,
  UNIQUE(usuario_id, slot_numero)
);

CREATE INDEX idx_efeitos_ativos_usuario ON efeitos_ativos(usuario_id);
CREATE INDEX idx_efeitos_ativos_termina_em ON efeitos_ativos(usuario_id, termina_em) WHERE termina_em > now();

COMMENT ON TABLE efeitos_ativos IS 'Efeitos de consumíveis ativos: 1 efeito por slot; termina_em define fim. Máximo de slots (ex.: 3) validado na RPC usar_item.';

-- -----------------------------------------------------------------------------
-- 3. Tabela de último uso para permanentes com recarga
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uso_recarga (
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
  ultimo_uso_em timestamptz NOT NULL,
  PRIMARY KEY (usuario_id, item_id)
);

CREATE INDEX idx_uso_recarga_usuario ON uso_recarga(usuario_id);

COMMENT ON TABLE uso_recarga IS 'Último uso de itens permanentes com recarga (cooldown). Validar ultimo_uso_em + recarga_minutos <= now() antes de permitir novo uso.';

-- Log de usos para contar max_usos_dia em permanentes com recarga
CREATE TABLE IF NOT EXISTS uso_recarga_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
  usado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_uso_recarga_log_usuario_item ON uso_recarga_log(usuario_id, item_id, usado_em DESC);

COMMENT ON TABLE uso_recarga_log IS 'Registro de cada uso de item permanente com recarga; usado para validar max_usos_dia.';

ALTER TABLE uso_recarga_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuário vê próprio uso recarga log" ON uso_recarga_log
  FOR ALL USING (auth.uid() = usuario_id);

-- -----------------------------------------------------------------------------
-- 4. Configuração global: número máximo de slots de efeitos ativos
-- (uso na RPC: só permitir usar consumível se count(efeitos_ativos onde termina_em > now()) < max_slots)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracao_app (
  chave text PRIMARY KEY,
  valor jsonb NOT NULL,
  atualizado_em timestamptz DEFAULT now() NOT NULL
);

INSERT INTO configuracao_app (chave, valor)
VALUES ('max_slots_efeitos', '3')
ON CONFLICT (chave) DO NOTHING;

COMMENT ON TABLE configuracao_app IS 'Configurações globais (ex.: max_slots_efeitos = 3). Usado pela RPC usar_item.';

-- -----------------------------------------------------------------------------
-- 5. RLS
-- -----------------------------------------------------------------------------
ALTER TABLE efeitos_ativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE uso_recarga ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracao_app ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuário vê próprios efeitos ativos" ON efeitos_ativos
  FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "usuário vê próprio uso recarga" ON uso_recarga
  FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "leitura config app" ON configuracao_app
  FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 6. Função RPC: usar_item (validação no servidor para evitar exploits)
-- Retorno: { sucesso: boolean, erro?: string, termina_em?: timestamptz }
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION usar_item(p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_item record;
  v_slots_ocupados int;
  v_max_slots int;
  v_usos_hoje int;
  v_slot_livre smallint;
  v_termina_em timestamptz;
  v_inventario record;
BEGIN
  IF v_usuario_id IS NULL THEN
    RETURN jsonb_build_object('sucesso', false, 'erro', 'Não autenticado.');
  END IF;

  SELECT id, tipo, duracao_minutos, recarga_minutos, max_usos_dia
  INTO v_item
  FROM itens
  WHERE id = p_item_id;

  IF v_item.id IS NULL THEN
    RETURN jsonb_build_object('sucesso', false, 'erro', 'Item não encontrado.');
  END IF;

  -- ---------- CONSUMÍVEL ----------
  IF v_item.tipo = 'consumivel' THEN
    IF v_item.duracao_minutos IS NULL OR v_item.duracao_minutos <= 0 THEN
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Item consumível sem duração configurada.');
    END IF;

    SELECT quantidade INTO v_inventario
    FROM inventario_usuario
    WHERE usuario_id = v_usuario_id AND item_id = p_item_id;

    IF v_inventario.quantidade IS NULL OR v_inventario.quantidade < 1 THEN
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Você não possui este item.');
    END IF;

    SELECT (valor::numeric)::int INTO v_max_slots
    FROM configuracao_app
    WHERE chave = 'max_slots_efeitos';
    v_max_slots := COALESCE(v_max_slots, 3);

    SELECT count(*) INTO v_slots_ocupados
    FROM efeitos_ativos
    WHERE usuario_id = v_usuario_id AND termina_em > now();

    IF v_slots_ocupados >= v_max_slots THEN
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Todos os slots de efeito estão ocupados. Aguarde um terminar.');
    END IF;

    IF v_item.max_usos_dia IS NOT NULL AND v_item.max_usos_dia > 0 THEN
      SELECT count(*) INTO v_usos_hoje
      FROM efeitos_ativos
      WHERE usuario_id = v_usuario_id AND item_id = p_item_id
        AND comeca_em >= date_trunc('day', now());
      IF v_usos_hoje >= v_item.max_usos_dia THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Limite diário deste item atingido.');
      END IF;
    END IF;

    -- Encontrar menor slot livre (1..v_max_slots)
    SELECT min(s) INTO v_slot_livre
    FROM generate_series(1, v_max_slots) s
    WHERE NOT EXISTS (
      SELECT 1 FROM efeitos_ativos e
      WHERE e.usuario_id = v_usuario_id AND e.slot_numero = s AND e.termina_em > now()
    );

    v_termina_em := now() + (v_item.duracao_minutos || ' minutes')::interval;

    INSERT INTO efeitos_ativos (usuario_id, item_id, slot_numero, comeca_em, termina_em)
    VALUES (v_usuario_id, p_item_id, v_slot_livre, now(), v_termina_em)
    ON CONFLICT (usuario_id, slot_numero) DO UPDATE
    SET item_id = EXCLUDED.item_id, comeca_em = EXCLUDED.comeca_em, termina_em = EXCLUDED.termina_em
    WHERE efeitos_ativos.termina_em <= now();

    UPDATE inventario_usuario
    SET quantidade = quantidade - 1
    WHERE usuario_id = v_usuario_id AND item_id = p_item_id AND quantidade >= 1;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Falha ao consumir item.');
    END IF;

    RETURN jsonb_build_object('sucesso', true, 'termina_em', v_termina_em);
  END IF;

  -- ---------- PERMANENTE COM RECARGA ----------
  IF v_item.tipo = 'permanente' AND v_item.recarga_minutos IS NOT NULL AND v_item.recarga_minutos > 0 THEN
    SELECT ultimo_uso_em INTO v_inventario
    FROM uso_recarga
    WHERE usuario_id = v_usuario_id AND item_id = p_item_id;

    IF v_inventario.ultimo_uso_em IS NOT NULL AND
       (v_inventario.ultimo_uso_em + (v_item.recarga_minutos || ' minutes')::interval) > now() THEN
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Item em recarga. Tente novamente mais tarde.');
    END IF;

    IF v_item.max_usos_dia IS NOT NULL AND v_item.max_usos_dia > 0 THEN
      SELECT count(*) INTO v_usos_hoje
      FROM uso_recarga_log
      WHERE usuario_id = v_usuario_id AND item_id = p_item_id
        AND usado_em >= date_trunc('day', now());
      IF v_usos_hoje >= v_item.max_usos_dia THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Limite diário deste item atingido.');
      END IF;
    END IF;

    INSERT INTO uso_recarga (usuario_id, item_id, ultimo_uso_em)
    VALUES (v_usuario_id, p_item_id, now())
    ON CONFLICT (usuario_id, item_id) DO UPDATE SET ultimo_uso_em = now();

    INSERT INTO uso_recarga_log (usuario_id, item_id, usado_em)
    VALUES (v_usuario_id, p_item_id, now());

    RETURN jsonb_build_object('sucesso', true);
  END IF;

  -- ---------- PERMANENTE SEM RECARGA / ARMADURA ----------
  -- "Usar" para armadura = equipar (já é feito no inventário). Para permanente sempre ativo, não há ação de "uso" aqui.
  RETURN jsonb_build_object('sucesso', false, 'erro', 'Este item não é usado assim. Equipe-o no inventário se for armadura.');
END;
$$;

COMMENT ON FUNCTION usar_item(uuid) IS 'Valida e aplica o uso de item (consumível ou permanente com recarga). Sempre chamar no servidor; não confiar no cliente.';
