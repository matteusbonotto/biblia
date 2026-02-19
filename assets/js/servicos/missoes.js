/**
 * Serviço de missões
 */
import { supabase } from '../config/supabase.js';

async function listarModelosMissoes() {
  if (!supabase) return [];
  const { data } = await supabase.from('modelos_missao').select('*').eq('ativo', true).order('titulo');
  return data || [];
}

async function listarMissoesAtivas(usuarioId) {
  if (!supabase || !usuarioId) return [];
  const { data } = await supabase
    .from('missoes')
    .select('*, modelos_missao(*)')
    .eq('usuario_id', usuarioId)
    .eq('status', 'ativa')
    .order('prazo_em', { nullsFirst: false });
  return data || [];
}

async function iniciarMissao(usuarioId, modeloId) {
  if (!supabase || !usuarioId) return { sucesso: false, erro: 'Não autenticado' };
  const { data: modelo } = await supabase.from('modelos_missao').select('horas_prazo_maximo').eq('id', modeloId).single();
  const prazoEm = modelo?.horas_prazo_maximo
    ? new Date(Date.now() + modelo.horas_prazo_maximo * 60 * 60 * 1000).toISOString()
    : null;
  const { error } = await supabase.from('missoes').insert({
    usuario_id: usuarioId,
    modelo_id: modeloId,
    status: 'ativa',
    prazo_em: prazoEm
  });
  if (error) return { sucesso: false, erro: error.message };
  return { sucesso: true };
}

async function concluirMissao(usuarioId, missaoId) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { data: m } = await supabase.from('missoes').select('*, modelos_missao(recompensa_xp, recompensa_ouro)').eq('id', missaoId).eq('usuario_id', usuarioId).single();
  if (!m || m.status !== 'ativa') return { sucesso: false };
  await supabase.from('missoes').update({ status: 'concluida', concluida_em: new Date().toISOString() }).eq('id', missaoId);
  const xp = m.modelos_missao?.recompensa_xp || 0;
  const ouro = m.modelos_missao?.recompensa_ouro || 0;
  if (xp || ouro) {
    await supabase.rpc('conceder_recompensa_missao', { p_usuario_id: usuarioId, p_xp: xp, p_ouro: ouro }).catch(() => {});
    const { data: niv } = await supabase.from('niveis_usuario').select('xp_total').eq('usuario_id', usuarioId).single();
    if (niv) {
      await supabase.from('niveis_usuario').update({
        xp_total: (niv.xp_total || 0) + xp,
        ultima_atividade_em: new Date().toISOString().slice(0, 10),
        atualizado_em: new Date().toISOString()
      }).eq('usuario_id', usuarioId);
    }
    const { data: moeda } = await supabase.from('moeda_usuario').select('ouro').eq('usuario_id', usuarioId).single();
    if (moeda != null) {
      await supabase.from('moeda_usuario').update({
        ouro: (moeda.ouro || 0) + ouro,
        atualizado_em: new Date().toISOString()
      }).eq('usuario_id', usuarioId);
    }
  }
  return { sucesso: true };
}

async function desistirMissao(usuarioId, missaoId) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { error } = await supabase.from('missoes').update({ status: 'abandonada' }).eq('id', missaoId).eq('usuario_id', usuarioId);
  if (error) return { sucesso: false };
  return { sucesso: true };
}

export { listarModelosMissoes, listarMissoesAtivas, iniciarMissao, concluirMissao, desistirMissao };
