/**
 * Mapeamento dos 66 livros da Bíblia - código 3 letras, nome e total de capítulos (CONVENCOES_E_APIS.md)
 */
const CAPITULOS_POR_LIVRO = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOS: 24, JDG: 21, RUT: 4, '1SA': 31, '2SA': 24, '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36, EZR: 10, NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31, ECC: 12, SNG: 8, ISA: 66, JER: 52, LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9, OBA: 1, JON: 4, MIC: 7, NAH: 3, HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4,
  MAT: 28, MRK: 16, LUK: 24, JHN: 21, ACT: 28, ROM: 16, '1CO': 16, '2CO': 13, GAL: 6, EPH: 6, PHP: 4, COL: 4, '1TH': 5, '2TH': 3, '1TI': 6, '2TI': 4, TIT: 3, PHM: 1, HEB: 13, JAS: 5, '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1, '3JN': 1, JUD: 1, REV: 22
};

const LIVROS_BIBLIA = [
  { codigo: 'GEN', nome: 'Gênesis', testamento: 'AT', totalCapitulos: 50 },
  { codigo: 'EXO', nome: 'Êxodo', testamento: 'AT', totalCapitulos: 40 },
  { codigo: 'LEV', nome: 'Levítico', testamento: 'AT', totalCapitulos: 27 },
  { codigo: 'NUM', nome: 'Números', testamento: 'AT', totalCapitulos: 36 },
  { codigo: 'DEU', nome: 'Deuteronômio', testamento: 'AT', totalCapitulos: 34 },
  { codigo: 'JOS', nome: 'Josué', testamento: 'AT', totalCapitulos: 24 },
  { codigo: 'JDG', nome: 'Juízes', testamento: 'AT', totalCapitulos: 21 },
  { codigo: 'RUT', nome: 'Rute', testamento: 'AT', totalCapitulos: 4 },
  { codigo: '1SA', nome: '1 Samuel', testamento: 'AT', totalCapitulos: 31 },
  { codigo: '2SA', nome: '2 Samuel', testamento: 'AT', totalCapitulos: 24 },
  { codigo: '1KI', nome: '1 Reis', testamento: 'AT', totalCapitulos: 22 },
  { codigo: '2KI', nome: '2 Reis', testamento: 'AT', totalCapitulos: 25 },
  { codigo: '1CH', nome: '1 Crônicas', testamento: 'AT', totalCapitulos: 29 },
  { codigo: '2CH', nome: '2 Crônicas', testamento: 'AT', totalCapitulos: 36 },
  { codigo: 'EZR', nome: 'Esdras', testamento: 'AT', totalCapitulos: 10 },
  { codigo: 'NEH', nome: 'Neemias', testamento: 'AT', totalCapitulos: 13 },
  { codigo: 'EST', nome: 'Ester', testamento: 'AT', totalCapitulos: 10 },
  { codigo: 'JOB', nome: 'Jó', testamento: 'AT', totalCapitulos: 42 },
  { codigo: 'PSA', nome: 'Salmos', testamento: 'AT', totalCapitulos: 150 },
  { codigo: 'PRO', nome: 'Provérbios', testamento: 'AT', totalCapitulos: 31 },
  { codigo: 'ECC', nome: 'Eclesiastes', testamento: 'AT', totalCapitulos: 12 },
  { codigo: 'SNG', nome: 'Cânticos', testamento: 'AT', totalCapitulos: 8 },
  { codigo: 'ISA', nome: 'Isaías', testamento: 'AT', totalCapitulos: 66 },
  { codigo: 'JER', nome: 'Jeremias', testamento: 'AT', totalCapitulos: 52 },
  { codigo: 'LAM', nome: 'Lamentações', testamento: 'AT', totalCapitulos: 5 },
  { codigo: 'EZK', nome: 'Ezequiel', testamento: 'AT', totalCapitulos: 48 },
  { codigo: 'DAN', nome: 'Daniel', testamento: 'AT', totalCapitulos: 12 },
  { codigo: 'HOS', nome: 'Oseias', testamento: 'AT', totalCapitulos: 14 },
  { codigo: 'JOL', nome: 'Joel', testamento: 'AT', totalCapitulos: 3 },
  { codigo: 'AMO', nome: 'Amós', testamento: 'AT', totalCapitulos: 9 },
  { codigo: 'OBA', nome: 'Obadias', testamento: 'AT', totalCapitulos: 1 },
  { codigo: 'JON', nome: 'Jonas', testamento: 'AT', totalCapitulos: 4 },
  { codigo: 'MIC', nome: 'Miqueias', testamento: 'AT', totalCapitulos: 7 },
  { codigo: 'NAH', nome: 'Naum', testamento: 'AT', totalCapitulos: 3 },
  { codigo: 'HAB', nome: 'Habacuque', testamento: 'AT', totalCapitulos: 3 },
  { codigo: 'ZEP', nome: 'Sofonias', testamento: 'AT', totalCapitulos: 3 },
  { codigo: 'HAG', nome: 'Ageu', testamento: 'AT', totalCapitulos: 2 },
  { codigo: 'ZEC', nome: 'Zacarias', testamento: 'AT', totalCapitulos: 14 },
  { codigo: 'MAL', nome: 'Malaquias', testamento: 'AT', totalCapitulos: 4 },
  { codigo: 'MAT', nome: 'Mateus', testamento: 'NT', totalCapitulos: 28 },
  { codigo: 'MRK', nome: 'Marcos', testamento: 'NT', totalCapitulos: 16 },
  { codigo: 'LUK', nome: 'Lucas', testamento: 'NT', totalCapitulos: 24 },
  { codigo: 'JHN', nome: 'João', testamento: 'NT', totalCapitulos: 21 },
  { codigo: 'ACT', nome: 'Atos', testamento: 'NT', totalCapitulos: 28 },
  { codigo: 'ROM', nome: 'Romanos', testamento: 'NT', totalCapitulos: 16 },
  { codigo: '1CO', nome: '1 Coríntios', testamento: 'NT', totalCapitulos: 16 },
  { codigo: '2CO', nome: '2 Coríntios', testamento: 'NT', totalCapitulos: 13 },
  { codigo: 'GAL', nome: 'Gálatas', testamento: 'NT', totalCapitulos: 6 },
  { codigo: 'EPH', nome: 'Efésios', testamento: 'NT', totalCapitulos: 6 },
  { codigo: 'PHP', nome: 'Filipenses', testamento: 'NT', totalCapitulos: 4 },
  { codigo: 'COL', nome: 'Colossenses', testamento: 'NT', totalCapitulos: 4 },
  { codigo: '1TH', nome: '1 Tessalonicenses', testamento: 'NT', totalCapitulos: 5 },
  { codigo: '2TH', nome: '2 Tessalonicenses', testamento: 'NT', totalCapitulos: 3 },
  { codigo: '1TI', nome: '1 Timóteo', testamento: 'NT', totalCapitulos: 6 },
  { codigo: '2TI', nome: '2 Timóteo', testamento: 'NT', totalCapitulos: 4 },
  { codigo: 'TIT', nome: 'Tito', testamento: 'NT', totalCapitulos: 3 },
  { codigo: 'PHM', nome: 'Filemon', testamento: 'NT', totalCapitulos: 1 },
  { codigo: 'HEB', nome: 'Hebreus', testamento: 'NT', totalCapitulos: 13 },
  { codigo: 'JAS', nome: 'Tiago', testamento: 'NT', totalCapitulos: 5 },
  { codigo: '1PE', nome: '1 Pedro', testamento: 'NT', totalCapitulos: 5 },
  { codigo: '2PE', nome: '2 Pedro', testamento: 'NT', totalCapitulos: 3 },
  { codigo: '1JN', nome: '1 João', testamento: 'NT', totalCapitulos: 5 },
  { codigo: '2JN', nome: '2 João', testamento: 'NT', totalCapitulos: 1 },
  { codigo: '3JN', nome: '3 João', testamento: 'NT', totalCapitulos: 1 },
  { codigo: 'JUD', nome: 'Judas', testamento: 'NT', totalCapitulos: 1 },
  { codigo: 'REV', nome: 'Apocalipse', testamento: 'NT', totalCapitulos: 22 }
];

function obterLivroPorCodigo(codigo) {
  return LIVROS_BIBLIA.find((l) => l.codigo === codigo) || null;
}

function obterLivrosAntigoTestamento() {
  return LIVROS_BIBLIA.filter((l) => l.testamento === 'AT');
}

function obterLivrosNovoTestamento() {
  return LIVROS_BIBLIA.filter((l) => l.testamento === 'NT');
}

function obterTotalCapitulos(codigoLivro) {
  return CAPITULOS_POR_LIVRO[codigoLivro] ?? 0;
}

export { LIVROS_BIBLIA, CAPITULOS_POR_LIVRO, obterLivroPorCodigo, obterTotalCapitulos, obterLivrosAntigoTestamento, obterLivrosNovoTestamento };
