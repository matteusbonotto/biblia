/**
 * Mapeamento dos 66 livros da Bíblia - código 3 letras, nome e total de capítulos (CONVENCOES_E_APIS.md)
 */
const CAPITULOS_POR_LIVRO = {
  GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOS: 24, JDG: 21, RUT: 4, '1SA': 31, '2SA': 24, '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36, EZR: 10, NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31, ECC: 12, SNG: 8, ISA: 66, JER: 52, LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9, OBA: 1, JON: 4, MIC: 7, NAH: 3, HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4,
  MAT: 28, MRK: 16, LUK: 24, JHN: 21, ACT: 28, ROM: 16, '1CO': 16, '2CO': 13, GAL: 6, EPH: 6, PHP: 4, COL: 4, '1TH': 5, '2TH': 3, '1TI': 6, '2TI': 4, TIT: 3, PHM: 1, HEB: 13, JAS: 5, '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1, '3JN': 1, JUD: 1, REV: 22
};

/**
 * Categorias/grupos temáticos dos livros da Bíblia.
 * id: chave interna  |  label: exibido na UI  |  icone: Bootstrap Icon
 */
const GRUPOS_BIBLIA = [
  { id: 'canonico',        label: 'Início ao fim',      icone: 'bi-book',                testamento: null },
  { id: 'cronologico',     label: 'Cronológica',         icone: 'bi-clock-history',       testamento: null },
  { id: 'AT',              label: 'Antigo Testamento',   icone: 'bi-journal-text',        testamento: 'AT' },
  { id: 'NT',              label: 'Novo Testamento',     icone: 'bi-journal-text',        testamento: 'NT' },
  { id: 'lei',             label: 'Lei (Torá)',          icone: 'bi-tablet',              testamento: 'AT' },
  { id: 'historia',        label: 'Históricos',          icone: 'bi-hourglass-split',     testamento: 'AT' },
  { id: 'sabedoria',       label: 'Sabedoria',           icone: 'bi-lightbulb',           testamento: 'AT' },
  { id: 'profetas',        label: 'Profetas',            icone: 'bi-megaphone',           testamento: 'AT' },
  { id: 'evangelhos',      label: 'Evangelhos',          icone: 'bi-person-fill',         testamento: 'NT' },
  { id: 'cartas-paulo',    label: 'Cartas de Paulo',     icone: 'bi-envelope-fill',       testamento: 'NT' },
  { id: 'epistolas',       label: 'Epístolas Gerais',    icone: 'bi-envelope-open-fill',  testamento: 'NT' },
];

/**
 * Ordem cronológica aproximada dos 66 livros (sequência de eventos/escrita).
 */
/**
 * Ordem cronológica aproximada dos 66 livros.
 * Baseada na Bíblia Cronológica NVI (popular no Brasil):
 * Gênesis abre a narrativa; Jó é posicionado na era patriarcal (após Gênesis).
 */
const ORDEM_CRONOLOGICA = [
  'GEN','JOB','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA',
  'PSA','PRO','ECC','SNG','1KI','2KI','1CH','2CH','OBA','JOL','JON',
  'AMO','HOS','MIC','ISA','NAH','ZEP','HAB','JER','LAM','EZK','DAN',
  'EZR','HAG','ZEC','NEH','EST','MAL',
  'MAT','MRK','LUK','JHN','ACT','JAS','GAL','1TH','2TH','1CO','2CO',
  'ROM','PHP','COL','PHM','EPH','1PE','2PE','1TI','TIT','2TI','HEB',
  '1JN','2JN','3JN','JUD','REV'
];

const LIVROS_BIBLIA = [
  { codigo: 'GEN', nome: 'Gênesis',        testamento: 'AT', totalCapitulos: 50,  grupo: 'lei'      },
  { codigo: 'EXO', nome: 'Êxodo',          testamento: 'AT', totalCapitulos: 40,  grupo: 'lei'      },
  { codigo: 'LEV', nome: 'Levítico',       testamento: 'AT', totalCapitulos: 27,  grupo: 'lei'      },
  { codigo: 'NUM', nome: 'Números',        testamento: 'AT', totalCapitulos: 36,  grupo: 'lei'      },
  { codigo: 'DEU', nome: 'Deuteronômio',   testamento: 'AT', totalCapitulos: 34,  grupo: 'lei'      },
  { codigo: 'JOS', nome: 'Josué',          testamento: 'AT', totalCapitulos: 24,  grupo: 'historia' },
  { codigo: 'JDG', nome: 'Juízes',         testamento: 'AT', totalCapitulos: 21,  grupo: 'historia' },
  { codigo: 'RUT', nome: 'Rute',           testamento: 'AT', totalCapitulos: 4,   grupo: 'historia' },
  { codigo: '1SA', nome: '1 Samuel',       testamento: 'AT', totalCapitulos: 31,  grupo: 'historia' },
  { codigo: '2SA', nome: '2 Samuel',       testamento: 'AT', totalCapitulos: 24,  grupo: 'historia' },
  { codigo: '1KI', nome: '1 Reis',         testamento: 'AT', totalCapitulos: 22,  grupo: 'historia' },
  { codigo: '2KI', nome: '2 Reis',         testamento: 'AT', totalCapitulos: 25,  grupo: 'historia' },
  { codigo: '1CH', nome: '1 Crônicas',     testamento: 'AT', totalCapitulos: 29,  grupo: 'historia' },
  { codigo: '2CH', nome: '2 Crônicas',     testamento: 'AT', totalCapitulos: 36,  grupo: 'historia' },
  { codigo: 'EZR', nome: 'Esdras',         testamento: 'AT', totalCapitulos: 10,  grupo: 'historia' },
  { codigo: 'NEH', nome: 'Neemias',        testamento: 'AT', totalCapitulos: 13,  grupo: 'historia' },
  { codigo: 'EST', nome: 'Ester',          testamento: 'AT', totalCapitulos: 10,  grupo: 'historia' },
  { codigo: 'JOB', nome: 'Jó',             testamento: 'AT', totalCapitulos: 42,  grupo: 'sabedoria'},
  { codigo: 'PSA', nome: 'Salmos',         testamento: 'AT', totalCapitulos: 150, grupo: 'sabedoria'},
  { codigo: 'PRO', nome: 'Provérbios',     testamento: 'AT', totalCapitulos: 31,  grupo: 'sabedoria'},
  { codigo: 'ECC', nome: 'Eclesiastes',    testamento: 'AT', totalCapitulos: 12,  grupo: 'sabedoria'},
  { codigo: 'SNG', nome: 'Cânticos',       testamento: 'AT', totalCapitulos: 8,   grupo: 'sabedoria'},
  { codigo: 'ISA', nome: 'Isaías',         testamento: 'AT', totalCapitulos: 66,  grupo: 'profetas' },
  { codigo: 'JER', nome: 'Jeremias',       testamento: 'AT', totalCapitulos: 52,  grupo: 'profetas' },
  { codigo: 'LAM', nome: 'Lamentações',    testamento: 'AT', totalCapitulos: 5,   grupo: 'profetas' },
  { codigo: 'EZK', nome: 'Ezequiel',       testamento: 'AT', totalCapitulos: 48,  grupo: 'profetas' },
  { codigo: 'DAN', nome: 'Daniel',         testamento: 'AT', totalCapitulos: 12,  grupo: 'profetas' },
  { codigo: 'HOS', nome: 'Oseias',         testamento: 'AT', totalCapitulos: 14,  grupo: 'profetas' },
  { codigo: 'JOL', nome: 'Joel',           testamento: 'AT', totalCapitulos: 3,   grupo: 'profetas' },
  { codigo: 'AMO', nome: 'Amós',           testamento: 'AT', totalCapitulos: 9,   grupo: 'profetas' },
  { codigo: 'OBA', nome: 'Obadias',        testamento: 'AT', totalCapitulos: 1,   grupo: 'profetas' },
  { codigo: 'JON', nome: 'Jonas',          testamento: 'AT', totalCapitulos: 4,   grupo: 'profetas' },
  { codigo: 'MIC', nome: 'Miqueias',       testamento: 'AT', totalCapitulos: 7,   grupo: 'profetas' },
  { codigo: 'NAH', nome: 'Naum',           testamento: 'AT', totalCapitulos: 3,   grupo: 'profetas' },
  { codigo: 'HAB', nome: 'Habacuque',      testamento: 'AT', totalCapitulos: 3,   grupo: 'profetas' },
  { codigo: 'ZEP', nome: 'Sofonias',       testamento: 'AT', totalCapitulos: 3,   grupo: 'profetas' },
  { codigo: 'HAG', nome: 'Ageu',           testamento: 'AT', totalCapitulos: 2,   grupo: 'profetas' },
  { codigo: 'ZEC', nome: 'Zacarias',       testamento: 'AT', totalCapitulos: 14,  grupo: 'profetas' },
  { codigo: 'MAL', nome: 'Malaquias',      testamento: 'AT', totalCapitulos: 4,   grupo: 'profetas' },
  { codigo: 'MAT', nome: 'Mateus',         testamento: 'NT', totalCapitulos: 28,  grupo: 'evangelhos'   },
  { codigo: 'MRK', nome: 'Marcos',         testamento: 'NT', totalCapitulos: 16,  grupo: 'evangelhos'   },
  { codigo: 'LUK', nome: 'Lucas',          testamento: 'NT', totalCapitulos: 24,  grupo: 'evangelhos'   },
  { codigo: 'JHN', nome: 'João',           testamento: 'NT', totalCapitulos: 21,  grupo: 'evangelhos'   },
  { codigo: 'ACT', nome: 'Atos',           testamento: 'NT', totalCapitulos: 28,  grupo: 'evangelhos'   },
  { codigo: 'ROM', nome: 'Romanos',        testamento: 'NT', totalCapitulos: 16,  grupo: 'cartas-paulo' },
  { codigo: '1CO', nome: '1 Coríntios',    testamento: 'NT', totalCapitulos: 16,  grupo: 'cartas-paulo' },
  { codigo: '2CO', nome: '2 Coríntios',    testamento: 'NT', totalCapitulos: 13,  grupo: 'cartas-paulo' },
  { codigo: 'GAL', nome: 'Gálatas',        testamento: 'NT', totalCapitulos: 6,   grupo: 'cartas-paulo' },
  { codigo: 'EPH', nome: 'Efésios',        testamento: 'NT', totalCapitulos: 6,   grupo: 'cartas-paulo' },
  { codigo: 'PHP', nome: 'Filipenses',     testamento: 'NT', totalCapitulos: 4,   grupo: 'cartas-paulo' },
  { codigo: 'COL', nome: 'Colossenses',    testamento: 'NT', totalCapitulos: 4,   grupo: 'cartas-paulo' },
  { codigo: '1TH', nome: '1 Tessalonicenses', testamento: 'NT', totalCapitulos: 5, grupo: 'cartas-paulo' },
  { codigo: '2TH', nome: '2 Tessalonicenses', testamento: 'NT', totalCapitulos: 3, grupo: 'cartas-paulo' },
  { codigo: '1TI', nome: '1 Timóteo',      testamento: 'NT', totalCapitulos: 6,   grupo: 'cartas-paulo' },
  { codigo: '2TI', nome: '2 Timóteo',      testamento: 'NT', totalCapitulos: 4,   grupo: 'cartas-paulo' },
  { codigo: 'TIT', nome: 'Tito',           testamento: 'NT', totalCapitulos: 3,   grupo: 'cartas-paulo' },
  { codigo: 'PHM', nome: 'Filemon',        testamento: 'NT', totalCapitulos: 1,   grupo: 'cartas-paulo' },
  { codigo: 'HEB', nome: 'Hebreus',        testamento: 'NT', totalCapitulos: 13,  grupo: 'epistolas'    },
  { codigo: 'JAS', nome: 'Tiago',          testamento: 'NT', totalCapitulos: 5,   grupo: 'epistolas'    },
  { codigo: '1PE', nome: '1 Pedro',        testamento: 'NT', totalCapitulos: 5,   grupo: 'epistolas'    },
  { codigo: '2PE', nome: '2 Pedro',        testamento: 'NT', totalCapitulos: 3,   grupo: 'epistolas'    },
  { codigo: '1JN', nome: '1 João',         testamento: 'NT', totalCapitulos: 5,   grupo: 'epistolas'    },
  { codigo: '2JN', nome: '2 João',         testamento: 'NT', totalCapitulos: 1,   grupo: 'epistolas'    },
  { codigo: '3JN', nome: '3 João',         testamento: 'NT', totalCapitulos: 1,   grupo: 'epistolas'    },
  { codigo: 'JUD', nome: 'Judas',          testamento: 'NT', totalCapitulos: 1,   grupo: 'epistolas'    },
  { codigo: 'REV', nome: 'Apocalipse',     testamento: 'NT', totalCapitulos: 22,  grupo: 'epistolas'    },
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

export { LIVROS_BIBLIA, CAPITULOS_POR_LIVRO, GRUPOS_BIBLIA, ORDEM_CRONOLOGICA, obterLivroPorCodigo, obterTotalCapitulos, obterLivrosAntigoTestamento, obterLivrosNovoTestamento };
