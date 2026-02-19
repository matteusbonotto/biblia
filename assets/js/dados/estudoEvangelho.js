/**
 * Estudo do evangelho — conteúdo reformado/calvinista presbiteriano, 100% focado na Bíblia.
 * Trilhas e aulas para uso no app.
 * Cada aula pode ter quiz: { perguntas: [ { pergunta, alternativas: string[], correta: 0 } ] }
 */

/** Referências para tooltips (passagem completa) */
export const REFS_BIBLICAS = {
  ARMADURA_DEUS: 'Efésios 6.10-18',
  FRUTO_ESPIRITO: 'Gálatas 5.22-23',
  OBRAS_CARNE: 'Gálatas 5.19-21'
};

/** Slots da Armadura de Deus (Ef 6.10-18) — cada peça com nome e ref para tooltip */
export const ARMADURA_DEUS_SLOTS = [
  { id: 'cinto', nome: 'Cinto da verdade', ref: 'Efésios 6.14a' },
  { id: 'couraca', nome: 'Couraça da justiça', ref: 'Efésios 6.14b' },
  { id: 'calcados', nome: 'Calçados do evangelho', ref: 'Efésios 6.15' },
  { id: 'escudo', nome: 'Escudo da fé', ref: 'Efésios 6.16' },
  { id: 'capacete', nome: 'Capacete da salvação', ref: 'Efésios 6.17a' },
  { id: 'espada', nome: 'Espada do Espírito', ref: 'Efésios 6.17b' }
];

/** Obras da carne (atributos negativos) — Gálatas 5.19-21 */
export const OBRAS_DA_CARNE = [
  'Prostituição', 'Impureza', 'Lascívia', 'Idolatria', 'Feitiçaria', 'Inimizades', 'Contendas', 'Ciúmes', 'Iras', 'Discórdias', 'Dissensões', 'Facções', 'Invejas', 'Bebedices', 'Gluttonias'
];

/** Fruto do Espírito (atributos positivos) — Gálatas 5.22-23 */
export const FRUTO_DO_ESPIRITO = [
  'Amor', 'Alegria', 'Paz', 'Longanimidade', 'Benignidade', 'Bondade', 'Fidelidade', 'Mansidão', 'Domínio próprio'
];

export const TRILHAS_ESTUDO = [
  {
    id: 'solas',
    titulo: 'As Solas da Reforma',
    descricao: 'Os cinco pilares bíblicos que marcaram a Reforma Protestante.',
    icone: 'bi-journal-bookmark',
    aulas: [
      {
        id: 'sola-scriptura',
        titulo: 'Sola Scriptura — Só a Escritura',
        refsBiblicas: ['2 Timóteo 3.16-17', 'Isaías 8.20', 'João 17.17'],
        conteudo: [
          'A Bíblia é a única regra infalível de fé e prática. Toda doutrina e toda prática da igreja devem ser provadas e medidas pela Escritura. "Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção, para a educação na justiça" (2 Tm 3.16). O Senhor Jesus orou: "Santifica-os na verdade; a tua palavra é a verdade" (Jo 17.17). A tradição e os concílios têm valor apenas quando estão em conformidade com a Palavra.',
          'A igreja reformada submete toda pregação, ensino e disciplina ao crivo das Escrituras. Nada que contradiga a Bíblia pode ser aceito como doutrina.'
        ],
        quiz: [
          { pergunta: 'O que é a única regra infalível de fé e prática?', alternativas: ['A tradição da igreja', 'A Bíblia (Escritura)', 'Os concílios', 'A razão humana'], correta: 1 },
          { pergunta: 'Em 2 Timóteo 3.16, a Escritura é útil para:', alternativas: ['Apenas ensino', 'Ensinar, repreender, corrigir e educar na justiça', 'Apenas correção', 'Apenas repreensão'], correta: 1 }
        ]
      },
      {
        id: 'sola-fide',
        titulo: 'Sola Fide — Somente a fé',
        refsBiblicas: ['Romanos 3.28', 'Gálatas 2.16', 'Efésios 2.8-9', 'Habacuque 2.4'],
        conteudo: [
          'O pecador é justificado diante de Deus somente pela fé em Cristo, e não por obras da lei. "Concluímos que o homem é justificado pela fé, independentemente das obras da lei" (Rm 3.28). "Pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus; não de obras, para que ninguém se glorie" (Ef 2.8-9). A fé é o instrumento pelo qual recebemos a justiça de Cristo; as obras são o fruto da salvação, não a causa.',
          'A Escritura diz: "O justo viverá por fé" (Hc 2.4; Rm 1.17). Essa fé é confiança em Cristo como Salvador e Senhor, e é ela mesma um dom de Deus.'
        ]
      },
      {
        id: 'sola-gratia',
        titulo: 'Sola Gratia — Somente a graça',
        refsBiblicas: ['Efésios 2.1-5', 'Tito 3.5', 'Romanos 9.16'],
        conteudo: [
          'A salvação é inteiramente pela graça de Deus. O homem, morto em pecados (Ef 2.1), não contribui com mérito algum; Deus é quem nos vivifica e nos salva "por graça" (Ef 2.5). "Não por obras de justiça que nós tivéssemos feito, mas segundo a sua misericórdia, ele nos salvou" (Tt 3.5). "Não depende de quem quer ou de quem corre, mas de Deus que usa de misericórdia" (Rm 9.16).',
          'A doutrina reformada enfatiza que a iniciativa da salvação é sempre de Deus; a graça é soberana e não merecida.'
        ]
      },
      {
        id: 'solus-christus',
        titulo: 'Solus Christus — Somente Cristo',
        refsBiblicas: ['João 14.6', 'Atos 4.12', '1 Timóteo 2.5', 'Hebreus 7.25'],
        conteudo: [
          'Não há outro nome pelo qual devamos ser salvos (At 4.12). Jesus é o único Mediador entre Deus e os homens (1 Tm 2.5). "Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim" (Jo 14.6). Ele é o único Salvador e o único Sumo Sacerdote que intercede por nós (Hb 7.25).',
          'A pregação reformada centraliza toda a esperança e todo o culto em Cristo; a salvação está somente nele.'
        ]
      },
      {
        id: 'soli-deo-gloria',
        titulo: 'Soli Deo Gloria — Glória somente a Deus',
        refsBiblicas: ['Romanos 11.36', '1 Coríntios 10.31', 'Apocalipse 4.11'],
        conteudo: [
          '"Porque dele, e por meio dele, e para ele são todas as coisas. A ele, pois, a glória para sempre" (Rm 11.36). "Façam tudo para a glória de Deus" (1 Co 10.31). A criação e a redenção existem para o louvor da glória de Deus (Ap 4.11). A vida do crente deve refletir esse fim: glorificar a Deus em tudo.',
          'A teologia reformada coloca a glória de Deus no centro; a salvação é para que o seu nome seja conhecido e adorado.'
        ]
      }
    ],
    quizModulo: [
      { pergunta: 'Qual das Solas afirma que a Bíblia é a única regra infalível?', alternativas: ['Sola Fide', 'Sola Scriptura', 'Sola Gratia', 'Solus Christus'], correta: 1 },
      { pergunta: 'Pela graça sois salvos, por meio da...', alternativas: ['obras', 'fé', 'tradição', 'razão'], correta: 1 },
      { pergunta: 'Quem é o único Mediador entre Deus e os homens?', alternativas: ['Maria', 'O papa', 'Cristo', 'Os santos'], correta: 2 },
      { pergunta: '"A ele, pois, a glória para sempre" refere-se a qual Sola?', alternativas: ['Sola Scriptura', 'Soli Deo Gloria', 'Sola Gratia', 'Sola Fide'], correta: 1 },
      { pergunta: 'A salvação é iniciativa de quem?', alternativas: ['Do homem', 'De Deus (graça)', 'Da igreja', 'Das obras'], correta: 1 }
    ]
  },
  {
    id: 'doutrinas-graca',
    titulo: 'Doutrinas da graça (TULIP)',
    descricao: 'Resumo bíblico da soberania de Deus na salvação.',
    icone: 'bi-flower1',
    aulas: [
      {
        id: 'depravacao-total',
        titulo: 'Depravação total',
        refsBiblicas: ['Romanos 3.10-18', 'Efésios 2.1-3', 'Jeremias 17.9'],
        conteudo: [
          'Por causa da queda, o ser humano está espiritualmente morto e incapaz de se voltar para Deus por si mesmo. "Não há justo, nem um sequer" (Rm 3.10). "O coração é mais enganoso que todas as coisas e desesperadamente corrupto" (Jr 17.9). Estávamos "mortos em delitos e pecados" (Ef 2.1), "por natureza filhos da ira" (Ef 2.3).',
          'Isso não significa que o incrédulo não pratique atos externamente bons; significa que, sem a graça, nenhum ato é motivado por amor a Deus e não há capacidade de se arrepender e crer por conta própria.'
        ]
      },
      {
        id: 'eleicao-incondicional',
        titulo: 'Eleição incondicional',
        refsBiblicas: ['Efésios 1.4-5', 'Romanos 9.11-13', 'João 15.16'],
        conteudo: [
          'Antes da fundação do mundo, Deus escolheu um povo para si, não com base em mérito ou fé prevista no homem, mas segundo o beneplácito da sua vontade. "Assim como nos escolheu nele antes da fundação do mundo... e nos predestinou para filhos de adoção por meio de Jesus Cristo" (Ef 1.4-5). "Não por obras, mas por aquele que chama... Jacó amei, Esaú odiei" (Rm 9.11-13). "Não fostes vós que me escolhestes a mim; eu vos escolhi" (Jo 15.16).',
          'A eleição é graciosa e soberana; o homem não é salvo porque escolheu a Deus, mas porque Deus o escolheu.'
        ]
      },
      {
        id: 'expiacao-definida',
        titulo: 'Expiação definida (ou limitada)',
        refsBiblicas: ['João 10.11, 15', 'Efésios 5.25', 'Mateus 1.21', 'Isaías 53.11'],
        conteudo: [
          'Cristo morreu para salvar efetivamente os seus — os eleitos — e não apenas para tornar a salvação possível para todos. "O bom pastor dá a vida pelas ovelhas" (Jo 10.11). "Assim como o Pai me conhece a mim, também eu conheço as minhas ovelhas" (Jo 10.14-15). "Cristo amou a igreja e a si mesmo se entregou por ela" (Ef 5.25). "Ele salvará o seu povo dos pecados deles" (Mt 1.21).',
          'O valor da expiação é infinito; a intenção divina foi aplicar esse valor aos que o Pai deu ao Filho.'
        ]
      },
      {
        id: 'graca-irresistivel',
        titulo: 'Graça irresistível',
        refsBiblicas: ['João 6.37, 44', 'Atos 16.14', 'Ezequiel 36.26-27'],
        conteudo: [
          'Quando Deus chama internamente o pecador pela Palavra e pelo Espírito, esse chamado é eficaz: o eleito vem a Cristo. "Todo aquele que o Pai me dá, esse virá a mim" (Jo 6.37). "Ninguém pode vir a mim se o Pai... não o trouxer" (Jo 6.44). O Senhor abriu o coração de Lídia (At 16.14). Deus promete dar "coração de carne" e colocar o seu Espírito (Ez 36.26-27).',
          'A graça não anula a vontade humana; ela a renova e a atrai de modo que o pecador responde em fé e arrependimento.'
        ]
      },
      {
        id: 'perseveranca-santos',
        titulo: 'Perseverança dos santos',
        refsBiblicas: ['Filipenses 1.6', 'João 10.28-29', 'Romanos 8.38-39'],
        conteudo: [
          'Os que Deus escolheu e regenerou não se perdem; eles perseveram na fé até o fim. "Aquele que começou boa obra em vós há de completá-la até o dia de Cristo Jesus" (Fp 1.6). "Ninguém as arrebatará da minha mão... e da mão de meu Pai" (Jo 10.28-29). "Nem morte, nem vida... nos poderá separar do amor de Deus" (Rm 8.38-39).',
          'A perseverança é obra de Deus; o crente é exortado a permanecer em Cristo, e o próprio Deus garante que os seus permaneçam.'
        ]
      }
    ],
    quizModulo: [
      { pergunta: 'O que a letra T de TULIP significa?', alternativas: ['Total depravação', 'Eleição incondicional', 'Expiação limitada', 'Graça irresistível'], correta: 0 },
      { pergunta: 'A eleição é baseada em mérito humano?', alternativas: ['Sim', 'Não, é incondicional', 'Às vezes', 'Só para alguns'], correta: 1 },
      { pergunta: 'Por quem Cristo deu a vida (Jo 10.11)?', alternativas: ['Por todos indistintamente', 'Pelas ovelhas (seus)', 'Por quem quiser', 'Por ninguém'], correta: 1 },
      { pergunta: 'Quem garante a perseverança dos santos?', alternativas: ['O crente sozinho', 'Deus', 'A igreja', 'As obras'], correta: 1 },
      { pergunta: 'O chamado eficaz de Deus é...', alternativas: ['Sempre rejeitado', 'Irresistível para os eleitos', 'Apenas externo', 'Raro'], correta: 1 }
    ]
  },
  {
    id: 'soberania-deus',
    titulo: 'Soberania de Deus',
    descricao: 'O Deus da Bíblia reina sobre toda a criação e sobre a salvação.',
    icone: 'bi-globe2',
    aulas: [
      {
        id: 'reino-universal',
        titulo: 'O reino universal de Deus',
        refsBiblicas: ['Salmos 115.3', 'Salmos 103.19', 'Daniel 4.34-35'],
        conteudo: [
          'O Senhor está nos céus e faz tudo o que lhe apraz (Sl 115.3). "O Senhor estabeleceu o seu trono nos céus, e o seu reino domina sobre tudo" (Sl 103.19). "Ele age como quer com o exército do céu e com os moradores da terra" (Dn 4.35). Nada escapa ao seu governo.',
          'A visão reformada insiste em que Deus não é um espectador; ele reina sobre a história, a natureza e os corações, sempre em conformidade com a sua santidade e justiça.'
        ]
      },
      {
        id: 'providencia',
        titulo: 'Providência e soberania na salvação',
        refsBiblicas: ['Efésios 1.11', 'Romanos 9.15-18', 'Provérbios 21.1'],
        conteudo: [
          '"Nele... fomos também feitos herança, predestinados segundo o propósito daquele que faz todas as coisas conforme o conselho da sua vontade" (Ef 1.11). "Terei misericórdia de quem me aprouver... assim pois não depende de quem quer... mas de Deus" (Rm 9.15-18). "O coração do rei está na mão do Senhor" (Pv 21.1).',
          'Deus não apenas oferece a salvação; ele efetua a salvação na vida dos que ele chama, garantindo que o propósito eterno se cumpra.'
        ]
      }
    ],
    quizModulo: [
      { pergunta: 'Quem estabeleceu o trono nos céus e domina sobre tudo (Sl 103.19)?', alternativas: ['O homem', 'O Senhor', 'Os anjos', 'A natureza'], correta: 1 },
      { pergunta: 'A salvação depende de quem quer ou de quem corre?', alternativas: ['Sim', 'Não, de Deus que usa de misericórdia', 'De ambos', 'Do sacerdote'], correta: 1 },
      { pergunta: 'Deus faz tudo o que lhe...', alternativas: ['pedem', 'apraz', 'obrigam', 'sugerem'], correta: 1 }
    ]
  },
  {
    id: 'pactos',
    titulo: 'Os pactos na Bíblia',
    descricao: 'Introdução à teologia bíblica dos pactos (alianças).',
    icone: 'bi-bookmark-heart',
    aulas: [
      {
        id: 'pacto-adamico',
        titulo: 'Pacto das obras (Adão)',
        refsBiblicas: ['Gênesis 2.16-17', 'Romanos 5.12-19', 'Oseias 6.7'],
        conteudo: [
          'Deus estabeleceu com Adão uma aliança de vida: obediência à ordem de não comer da árvore traria vida; a desobediência traria morte (Gn 2.16-17). Adão representava a humanidade; pela sua queda, o pecado e a morte passaram a todos (Rm 5.12). "Como por uma só ofensa veio o juízo sobre todos os homens para condenação, assim também por um só ato de justiça veio a graça sobre todos os homens para justificação de vida" (Rm 5.18).',
          'A teologia do pacto reformada vê aqui o primeiro pacto: as condições eram claras, e o fracasso de Adão exige um Redentor que cumpra a justiça em nosso lugar.'
        ]
      },
      {
        id: 'pacto-graca',
        titulo: 'Pacto da graça (Cristo)',
        refsBiblicas: ['Gênesis 3.15', 'Gálatas 3.16', 'Hebreus 8.6-13'],
        conteudo: [
          'Logo após a queda, Deus prometeu a semente da mulher que esmagaria a serpente (Gn 3.15) — o evangelho em embrião. Esse pacto da graça se revela progressivamente: Abraão, a Lei no Sinai, os profetas, e cumpre-se em Cristo. "As promessas foram feitas a Abraão e à sua descendência... que é Cristo" (Gl 3.16). Cristo é o Mediador de um novo pacto (Hb 8.6); a lei foi escrita no coração e os pecados são perdoados (Hb 8.10-12).',
          'O pacto da graça é o fio que une Antigo e Novo Testamento: a salvação é sempre pela graça, mediante a fé no Redentor prometido e cumprido em Jesus.'
        ]
      }
    ],
    quizModulo: [
      { pergunta: 'Com quem Deus fez o pacto das obras (vida por obediência)?', alternativas: ['Abraão', 'Adão', 'Moisés', 'Noé'], correta: 1 },
      { pergunta: 'O que a queda de Adão trouxe a todos (Rm 5.12)?', alternativas: ['Bênção', 'Pecado e morte', 'Sabedoria', 'Riqueza'], correta: 1 },
      { pergunta: 'Quem é a "descendência" de Abraão em quem as promessas se cumprem (Gl 3.16)?', alternativas: ['Israel', 'Cristo', 'A igreja', 'Os apóstolos'], correta: 1 },
      { pergunta: 'O pacto da graça foi prometido logo após a queda em qual texto?', alternativas: ['Êxodo', 'Gênesis 3.15', 'Romanos', 'Hebreus'], correta: 1 }
    ]
  },
  {
    id: 'obras-carne-fruto-espirito',
    titulo: 'Obras da carne e Fruto do Espírito',
    descricao: 'Atributos negativos e positivos segundo Gálatas 5.19-23.',
    icone: 'bi-heart-half',
    aulas: [
      {
        id: 'obras-da-carne',
        titulo: 'Obras da carne (atributos negativos)',
        refsBiblicas: ['Gálatas 5.19-21'],
        conteudo: [
          'A Bíblia chama de "obras da carne" as práticas que caracterizam quem vive segundo a natureza pecaminosa, sem o domínio do Espírito. "As obras da carne são manifestas: prostituição, impureza, lascívia, idolatria, feitiçaria, inimizades, contendas, ciúmes, iras, discórdias, dissensões, facções, invejas, bebedices, glutonarias e coisas semelhantes a estas" (Gl 5.19-21). Quem pratica tais coisas não herdará o reino de Deus.',
          'Esses atributos negativos mostram a necessidade de arrependimento e da obra do Espírito na vida do crente. A luta contra a carne é diária (Gl 5.17).'
        ],
        quiz: [
          { pergunta: 'Onde na Bíblia encontramos a lista das obras da carne?', alternativas: ['Romanos 8', 'Gálatas 5.19-21', 'Efésios 6', 'João 3'], correta: 1 },
          { pergunta: 'Quem não herdará o reino de Deus segundo o texto?', alternativas: ['Quem não ora', 'Quem pratica as obras da carne', 'Quem não jejua', 'Quem não lê a Bíblia'], correta: 1 }
        ]
      },
      {
        id: 'fruto-do-espirito',
        titulo: 'Fruto do Espírito (atributos positivos)',
        refsBiblicas: ['Gálatas 5.22-23'],
        conteudo: [
          'Em contraste com as obras da carne, o "fruto do Espírito" são as virtudes que o Espírito Santo produz na vida de quem anda nele. "O fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio. Contra essas coisas não há lei" (Gl 5.22-23). Não são esforços humanos, mas resultado da habitação do Espírito.',
          'O crente é exortado a andar no Espírito (Gl 5.16, 25) e a ser cheio do Espírito (Ef 5.18); assim o fruto aparece como marca da nova vida em Cristo.'
        ],
        quiz: [
          { pergunta: 'Onde na Bíblia encontramos o fruto do Espírito?', alternativas: ['Efésios 6', 'Gálatas 5.22-23', 'Romanos 12', '1 Coríntios 13'], correta: 1 },
          { pergunta: 'O fruto do Espírito é produzido por:', alternativas: ['Esforço humano', 'O Espírito Santo na vida do crente', 'A lei', 'As obras'], correta: 1 }
        ]
      }
    ],
    quizModulo: [
      { pergunta: 'Onde na Bíblia estão as obras da carne e o fruto do Espírito?', alternativas: ['Romanos 8', 'Gálatas 5.19-23', 'Efésios 6', 'João 15'], correta: 1 },
      { pergunta: 'Quem não herdará o reino de Deus segundo Gálatas 5.21?', alternativas: ['Quem não ora', 'Quem pratica as obras da carne', 'Quem não jejua', 'Quem não lê a Bíblia'], correta: 1 },
      { pergunta: 'O fruto do Espírito inclui:', alternativas: ['Inveja', 'Amor, alegria, paz', 'Contendas', 'Idolatria'], correta: 1 },
      { pergunta: 'O crente deve andar no...', alternativas: ['carnal', 'Espírito', 'pecado', 'mundo'], correta: 1 }
    ]
  }
];
