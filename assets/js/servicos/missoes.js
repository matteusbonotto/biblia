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

async function listarTodasMissoes(usuarioId, filtroStatus = null, filtroTipo = null, limite = 10, offset = 0) {
  if (!supabase || !usuarioId) return { missoes: [], total: 0 };
  
  // Expirar missões automaticamente antes de listar
  await expirarMissoesAutomaticamente(usuarioId);
  
  const { data, error } = await supabase.rpc('listar_todas_missoes_usuario', {
    p_usuario_id: usuarioId,
    p_status: filtroStatus,
    p_tipo: filtroTipo,
    p_limit: limite,
    p_offset: offset
  });
  if (error) {
    console.error('Erro ao listar missões:', error);
    return { missoes: [], total: 0 };
  }
  // Contar total para paginação
  let query = supabase.from('missoes').select('*', { count: 'exact', head: true }).eq('usuario_id', usuarioId);
  if (filtroStatus) query = query.eq('status', filtroStatus);
  if (filtroTipo) {
    const { data: modelos } = await supabase.from('modelos_missao').select('id').eq('tipo', filtroTipo);
    if (modelos && modelos.length > 0) {
      query = query.in('modelo_id', modelos.map(m => m.id));
    } else {
      return { missoes: [], total: 0 };
    }
  }
  const { count } = await query;
  return { missoes: data || [], total: count || 0 };
}

async function expirarMissoesAutomaticamente(usuarioId) {
  if (!supabase || !usuarioId) return;
  // Chamar função RPC para expirar missões
  await supabase.rpc('expirar_missoes_automaticamente').catch(() => {});
  // Também atualizar localmente as missões do usuário
  const { error } = await supabase
    .from('missoes')
    .update({ status: 'expirada' })
    .eq('usuario_id', usuarioId)
    .eq('status', 'ativa')
    .lt('prazo_em', new Date().toISOString());
  if (error) console.error('Erro ao expirar missões:', error);
}

async function expirarMissao(usuarioId, missaoId) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { error } = await supabase
    .from('missoes')
    .update({ status: 'expirada' })
    .eq('id', missaoId)
    .eq('usuario_id', usuarioId)
    .eq('status', 'ativa');
  if (error) return { sucesso: false };
  return { sucesso: true };
}

async function obterMetricasMissoes(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data, error } = await supabase.rpc('obter_metricas_missoes_usuario', {
    p_usuario_id: usuarioId
  });
  if (error) {
    console.error('Erro ao obter métricas:', error);
    return null;
  }
  return data;
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

export { listarModelosMissoes, listarMissoesAtivas, listarTodasMissoes, obterMetricasMissoes, iniciarMissao, concluirMissao, desistirMissao, expirarMissao, expirarMissoesAutomaticamente };
