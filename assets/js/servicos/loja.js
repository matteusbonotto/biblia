/**
 * Loja - listar itens à venda e comprar com ouro
 */
import { supabase } from '../config/supabase.js';

async function listarItensLoja() {
  if (!supabase) return [];
  const { data } = await supabase.from('itens').select('*').gt('preco_ouro', 0).order('nome');
  return data || [];
}

async function comprarItem(usuarioId, itemId, precoOuro) {
  if (!supabase || !usuarioId) return { sucesso: false, erro: 'Não autenticado' };
  const { data: moeda } = await supabase.from('moeda_usuario').select('ouro').eq('usuario_id', usuarioId).single();
  if (!moeda || (moeda.ouro || 0) < precoOuro) {
    return { sucesso: false, erro: 'Ouro insuficiente.' };
  }
  const { data: item } = await supabase.from('itens').select('id').eq('id', itemId).single();
  if (!item) return { sucesso: false, erro: 'Item não encontrado.' };

  await supabase.from('moeda_usuario').update({
    ouro: (moeda.ouro || 0) - precoOuro,
    atualizado_em: new Date().toISOString()
  }).eq('usuario_id', usuarioId);

  const { data: inv } = await supabase.from('inventario_usuario').select('id, quantidade').eq('usuario_id', usuarioId).eq('item_id', itemId).single();
  if (inv) {
    await supabase.from('inventario_usuario').update({
      quantidade: (inv.quantidade || 0) + 1,
      obtido_em: new Date().toISOString()
    }).eq('id', inv.id);
  } else {
    await supabase.from('inventario_usuario').insert({
      usuario_id: usuarioId,
      item_id: itemId,
      quantidade: 1,
      equipado: false
    });
  }

  await supabase.from('transacoes').insert({
    usuario_id: usuarioId,
    tipo: 'gasto',
    valor: precoOuro,
    motivo: 'Compra na loja'
  });
  return { sucesso: true };
}

export { listarItensLoja, comprarItem };
