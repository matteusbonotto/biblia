/**
 * Serviço de autenticação - Supabase Auth
 */
import { supabase } from '../config/supabase.js';

async function obterUsuarioAtual() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function entrar(email, senha) {
  if (!supabase) return { sucesso: false, erro: 'Supabase não configurado' };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return { sucesso: false, erro: error.message };
    return { sucesso: true, usuario: data.user };
  } catch (e) {
    return { sucesso: false, erro: e.message };
  }
}

async function sair() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

async function cadastrar(email, senha, metadados = {}) {
  if (!supabase) return { sucesso: false, erro: 'Supabase não configurado' };
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: metadados }
    });
    if (error) return { sucesso: false, erro: error.message };
    return { sucesso: true, usuario: data.user };
  } catch (e) {
    return { sucesso: false, erro: e.message };
  }
}

function onMudancaAuth(callback) {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

export { obterUsuarioAtual, entrar, sair, cadastrar, onMudancaAuth };
