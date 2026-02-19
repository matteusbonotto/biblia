/**
 * API Bíblia - bible-api.com
 * Try/catch, retorno null em erro, log no console (CONVENCOES_E_APIS.md)
 */
const URL_BASE_BIBLIA = 'https://bible-api.com';

async function obterVersiculo(codigoLivro, capitulo, versiculo, traducao = 'almeida') {
  try {
    const livroCodificado = encodeURIComponent(`${codigoLivro}+${capitulo}:${versiculo}`);
    const url = `${URL_BASE_BIBLIA}/${livroCodificado}?translation=${traducao}`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error('Bíblia API (versículo):', erro);
    return null;
  }
}

async function obterCapitulo(codigoLivro, capitulo, traducao = 'almeida') {
  try {
    const url = `${URL_BASE_BIBLIA}/data/${traducao}/${codigoLivro}/${capitulo}`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error('Bíblia API (capítulo):', erro);
    return null;
  }
}

export { obterVersiculo, obterCapitulo, URL_BASE_BIBLIA };
