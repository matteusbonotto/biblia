/**
 * API Bíblia — dois provedores gratuitos, sem cadastro:
 *   • bible-api.com  → ARIB (Almeida Imprensa Bíblica)
 *   • api.getbible.net → AA (Almeida Atualizada), Bíblia Livre
 *
 * Traduções disponíveis:
 *   'arib'  → Almeida Imprensa Bíblica  (bible-api.com / almeida)
 *   'aa'    → Almeida Atualizada         (getbible.net  / almeida)
 *   'livre' → Bíblia Livre               (getbible.net  / livre)
 */

const URL_BASE_BIBLIA  = 'https://bible-api.com';
const URL_GETBIBLE     = 'https://api.getbible.net/v2';

/** Mapeamento dos códigos 3-letras → número canônico (1-66) usado pelo getbible.net */
const BOOK_NUMS_GETBIBLE = {
  GEN:1,  EXO:2,  LEV:3,  NUM:4,  DEU:5,  JOS:6,  JDG:7,  RUT:8,
  '1SA':9,'2SA':10,'1KI':11,'2KI':12,'1CH':13,'2CH':14,
  EZR:15, NEH:16, EST:17, JOB:18, PSA:19, PRO:20, ECC:21, SNG:22,
  ISA:23, JER:24, LAM:25, EZK:26, DAN:27, HOS:28, JOL:29, AMO:30,
  OBA:31, JON:32, MIC:33, NAH:34, HAB:35, ZEP:36, HAG:37, ZEC:38, MAL:39,
  MAT:40, MRK:41, LUK:42, JHN:43, ACT:44, ROM:45,
  '1CO':46,'2CO':47, GAL:48, EPH:49, PHP:50, COL:51,
  '1TH':52,'2TH':53,'1TI':54,'2TI':55, TIT:56, PHM:57,
  HEB:58, JAS:59,'1PE':60,'2PE':61,'1JN':62,'2JN':63,'3JN':64,
  JUD:65, REV:66
};

/** getbible.net usa nomes de tradução diferentes dos nossos códigos internos */
const GETBIBLE_TRAD = {
  aa:    'almeida',
  livre: 'livre',
  livretr: 'livretr',
};

/**
 * Normaliza a resposta do getbible.net para o mesmo shape de bible-api.com:
 * { verses: [{ verse: <num>, text: <string> }, …] }
 */
function normalizarRespostaGetbible(dados) {
  if (!dados || !Array.isArray(dados.verses)) return null;
  return {
    verses: dados.verses.map((v) => ({ verse: v.verse, text: v.text }))
  };
}

// ── Funções internas ──────────────────────────────────────────────────────────

async function _obterCapituloGetbible(codigoLivro, capitulo, traducaoGetbible) {
  const bookNum = BOOK_NUMS_GETBIBLE[codigoLivro];
  if (!bookNum) throw new Error(`Código não mapeado para getbible.net: ${codigoLivro}`);
  const url = `${URL_GETBIBLE}/${traducaoGetbible}/${bookNum}/${capitulo}.json`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`getbible HTTP ${resposta.status}`);
  const dados = await resposta.json();
  return normalizarRespostaGetbible(dados);
}

async function _obterVersiuloGetbible(codigoLivro, capitulo, versiculo, traducaoGetbible) {
  // getbible.net não tem endpoint de versículo único; baixamos o capítulo e filtramos
  const cap = await _obterCapituloGetbible(codigoLivro, capitulo, traducaoGetbible);
  if (!cap) return null;
  const v = cap.verses.find((x) => x.verse === versiculo);
  return v ? { verses: [v] } : null;
}

// ── Funções públicas ──────────────────────────────────────────────────────────

async function obterVersiculo(codigoLivro, capitulo, versiculo, traducao = 'arib') {
  try {
    if (GETBIBLE_TRAD[traducao]) {
      return await _obterVersiuloGetbible(codigoLivro, capitulo, versiculo, GETBIBLE_TRAD[traducao]);
    }
    // Padrão: bible-api.com (ARIB)
    const livroCodificado = encodeURIComponent(`${codigoLivro}+${capitulo}:${versiculo}`);
    const url = `${URL_BASE_BIBLIA}/${livroCodificado}?translation=almeida`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error('Bíblia API (versículo):', erro);
    return null;
  }
}

async function obterCapitulo(codigoLivro, capitulo, traducao = 'arib') {
  try {
    if (GETBIBLE_TRAD[traducao]) {
      return await _obterCapituloGetbible(codigoLivro, capitulo, GETBIBLE_TRAD[traducao]);
    }
    // Padrão: bible-api.com (ARIB)
    const url = `${URL_BASE_BIBLIA}/data/almeida/${codigoLivro}/${capitulo}`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error('Bíblia API (capítulo):', erro);
    return null;
  }
}

export { obterVersiculo, obterCapitulo, URL_BASE_BIBLIA };
