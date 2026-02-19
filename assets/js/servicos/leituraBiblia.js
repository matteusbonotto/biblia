/**
 * Serviço de progresso de leitura da Bíblia e quiz por livro
 */
import { supabase } from '../config/supabase.js';

async function salvarProgresso(usuarioId, versao, codigoLivro, capitulo, ultimoVersiculo, percentual) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const { error } = await supabase.from('progresso_leitura_biblia').upsert(
    {
      usuario_id: usuarioId,
      versao,
      codigo_livro: codigoLivro,
      capitulo,
      ultimo_versiculo: ultimoVersiculo,
      percentual: percentual || 0,
      atualizado_em: new Date().toISOString()
    },
    { onConflict: 'usuario_id,codigo_livro,capitulo' }
  );
  if (error) return { sucesso: false };
  return { sucesso: true };
}

async function obterProgressoUsuario(usuarioId) {
  if (!supabase || !usuarioId) return [];
  const { data } = await supabase
    .from('progresso_leitura_biblia')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('codigo_livro');
  return data || [];
}

/** Remove todo o progresso de leitura de um livro (ex.: ao reprovar no quiz). */
async function resetarProgressoLivro(usuarioId, codigoLivro) {
  if (!supabase || !usuarioId || !codigoLivro) return { sucesso: false };
  const { error } = await supabase
    .from('progresso_leitura_biblia')
    .delete()
    .eq('usuario_id', usuarioId)
    .eq('codigo_livro', codigoLivro);
  if (error) return { sucesso: false };
  return { sucesso: true };
}

/** Lista códigos dos livros cujo quiz o usuário já aprovou (>= 70%). */
async function obterLivrosAprovadosQuiz(usuarioId) {
  if (!supabase || !usuarioId) return [];
  const { data } = await supabase
    .from('quiz_livro_aprovado')
    .select('codigo_livro')
    .eq('usuario_id', usuarioId);
  return (data || []).map((r) => r.codigo_livro);
}

/** Registra que o usuário aprovou o quiz do livro (nota >= 70%). */
async function registrarAprovacaoQuizLivro(usuarioId, codigoLivro) {
  if (!supabase || !usuarioId || !codigoLivro) return { sucesso: false };
  const { error } = await supabase.from('quiz_livro_aprovado').upsert(
    { usuario_id: usuarioId, codigo_livro: codigoLivro },
    { onConflict: 'usuario_id,codigo_livro' }
  );
  if (error) return { sucesso: false };
  return { sucesso: true };
}

export {
  salvarProgresso,
  obterProgressoUsuario,
  resetarProgressoLivro,
  obterLivrosAprovadosQuiz,
  registrarAprovacaoQuizLivro
};
