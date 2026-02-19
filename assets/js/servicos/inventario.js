/**
 * Serviço de inventário e efeitos ativos (REGRAS_ITENS_EFEITOS)
 */
import { supabase } from '../config/supabase.js';

async function listarInventario(usuarioId) {
  if (!supabase || !usuarioId) return [];
  const { data } = await supabase
    .from('inventario_usuario')
    .select('*, itens(*)')
    .eq('usuario_id', usuarioId)
    .gt('quantidade', 0);
  const armadura = await supabase
    .from('inventario_usuario')
    .select('*, itens(*)')
    .eq('usuario_id', usuarioId)
    .eq('equipado', true);
  const lista = [...(data || []), ...(armadura.data || []).filter((a) => !(data || []).find((d) => d.id === a.id))];
  return lista;
}

async function listarEfeitosAtivos(usuarioId) {
  if (!supabase || !usuarioId) return [];
  const { data } = await supabase
    .from('efeitos_ativos')
    .select('*, itens(nome, duracao_minutos)')
    .eq('usuario_id', usuarioId)
    .gt('termina_em', new Date().toISOString())
    .order('termina_em');
  return data || [];
}

async function usarItem(usuarioId, itemId) {
  if (!supabase || !usuarioId) return { sucesso: false, erro: 'Não autenticado' };
  const { data, error } = await supabase.rpc('usar_item', { p_item_id: itemId });
  if (error) return { sucesso: false, erro: error.message };
  if (data && typeof data === 'object' && data.sucesso === false) return { sucesso: false, erro: data.erro || 'Erro ao usar item' };
  return data || { sucesso: true };
}

async function equiparItem(usuarioId, inventarioId, equipado) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { error } = await supabase
    .from('inventario_usuario')
    .update({ equipado })
    .eq('id', inventarioId)
    .eq('usuario_id', usuarioId);
  if (error) return { sucesso: false, erro: error.message };
  return { sucesso: true };
}

export { listarInventario, listarEfeitosAtivos, usarItem, equiparItem };
