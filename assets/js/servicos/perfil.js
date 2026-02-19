/**
 * Serviço de perfil - perfis, aceite termos, nível, moeda
 */
import { supabase } from '../config/supabase.js';
import { VERSAO_TERMOS } from '../dados/constantes.js';

async function obterPerfil(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data, error } = await supabase.from('perfis').select('*').eq('id', usuarioId).single();
  if (error) return null;
  return data;
}

async function atualizarPerfil(usuarioId, dados) {
  if (!supabase || !usuarioId) return { sucesso: false, erro: 'Não autenticado' };
  const { error } = await supabase.from('perfis').update(dados).eq('id', usuarioId);
  if (error) return { sucesso: false, erro: error.message };
  return { sucesso: true };
}

async function registrarAceiteTermos(usuarioId) {
  return atualizarPerfil(usuarioId, {
    aceite_termos_em: new Date().toISOString(),
    versao_termos_aceitos: VERSAO_TERMOS
  });
}

async function criarOuAtualizarPerfilCompleto(usuarioId, dadosCadastro) {
  if (!supabase || !usuarioId) return { sucesso: false };
  const {
    nome,
    sobrenome,
    dataNascimento,
    estadoCivil,
    configAvatar,
    aceiteTermosEm,
    versaoTermosAceitos
  } = dadosCadastro;
  const payload = {
    nome: nome || '',
    sobrenome: sobrenome || '',
    data_nascimento: dataNascimento || null,
    estado_civil: estadoCivil || null,
    config_avatar: configAvatar || {},
    atualizado_em: new Date().toISOString()
  };
  if (aceiteTermosEm) payload.aceite_termos_em = aceiteTermosEm;
  if (versaoTermosAceitos) payload.versao_termos_aceitos = versaoTermosAceitos;
  const { error } = await supabase.from('perfis').upsert({ id: usuarioId, ...payload }, { onConflict: 'id' });
  if (error) return { sucesso: false, erro: error.message };
  return { sucesso: true };
}

async function obterNivel(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data } = await supabase.from('niveis_usuario').select('*').eq('usuario_id', usuarioId).single();
  return data;
}

async function garantirNivelInicial(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data: existente } = await supabase.from('niveis_usuario').select('usuario_id').eq('usuario_id', usuarioId).single();
  if (existente) return existente;
  const { data: novo } = await supabase.from('niveis_usuario').insert({
    usuario_id: usuarioId,
    nivel: 1,
    xp_atual: 0,
    xp_total: 0,
    dias_sequencia: 0
  }).select().single();
  return novo;
}

async function obterMoeda(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data } = await supabase.from('moeda_usuario').select('*').eq('usuario_id', usuarioId).single();
  return data;
}

async function garantirMoedaInicial(usuarioId) {
  if (!supabase || !usuarioId) return null;
  const { data: existente } = await supabase.from('moeda_usuario').select('usuario_id').eq('usuario_id', usuarioId).single();
  if (existente) return existente;
  const { data: novo } = await supabase.from('moeda_usuario').insert({
    usuario_id: usuarioId,
    ouro: 0
  }).select().single();
  return novo;
}

export {
  obterPerfil,
  atualizarPerfil,
  registrarAceiteTermos,
  criarOuAtualizarPerfilCompleto,
  obterNivel,
  garantirNivelInicial,
  obterMoeda,
  garantirMoedaInicial
};
