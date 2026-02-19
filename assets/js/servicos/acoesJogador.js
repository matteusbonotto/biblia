/**
 * Ações do jogador: orar, perdoar, confessar, interceder
 */
import { supabase } from '../config/supabase.js';

async function registrarAcao(usuarioId, acao, metadados = {}) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { error } = await supabase.from('acoes_jogador').insert({
    usuario_id: usuarioId,
    acao,
    metadados
  });
  if (error) return { sucesso: false };
  return { sucesso: true };
}

export { registrarAcao };
