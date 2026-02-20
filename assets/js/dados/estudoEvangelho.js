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

/**
 * Obras da carne — 9 termos agrupados (Gálatas 5.19-21).
 * Agrupamentos: Imoralidade (Prostituição+Impureza+Lascívia),
 * Idolatria, Feitiçaria, Ódio (Inimizades+Contendas),
 * Inveja (Ciúmes+Invejas), Ira, Discórdia (Discórdias+Dissensões),
 * Sectarismo (Facções), Excessos (Bebedices+Gluttonias).
 */
export const OBRAS_DA_CARNE = [
  'Imoralidade', 'Idolatria', 'Feitiçaria',
  'Ódio',        'Inveja',    'Ira',
  'Discórdia',   'Sectarismo','Excessos'
];

/** Tooltips detalhados — Fruto do Espírito (Gl 5.22-23) */
export const TOOLTIPS_FRUTO = [
  {
    titulo: 'Amor',
    icone: 'bi-heart-fill',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Romanos 5.5 · 1 Coríntios 13.4-7',
    descricao: 'O "amor" aqui é o grego ágape — não o amor romântico ou afeto natural, mas o amor incondicional e sacrificial de Deus derramado no coração do crente pelo Espírito Santo (Rm 5.5). É um amor que age pelo bem do outro mesmo sem reciprocidade, mesmo diante de inimigos. Não é sentimento, é decisão.',
    aplicacao: 'Servir sem esperar reconhecimento, perdoar quem nos feriu profundamente, amar quem é difícil de amar. É ação, não apenas emoção. "O amor é paciente, é benigno; o amor não inveja..." (1 Co 13.4).'
  },
  {
    titulo: 'Alegria',
    icone: 'bi-emoji-smile-fill',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Filipenses 4.4 · João 15.11',
    descricao: 'Não é felicidade dependente de circunstâncias externas. É um gozo profundo que brota do relacionamento com Deus, mesmo no sofrimento. Paulo escreveu "alegrai-vos sempre no Senhor" (Fp 4.4) de dentro de uma prisão. Jesus quis que "a minha alegria permaneça em vós" (Jo 15.11) — uma alegria que nem a morte pode tirar.',
    aplicacao: 'Cultivar gratidão diária, louvar a Deus na tribulação, não deixar que tristezas temporárias roubem a esperança eterna. A alegria cristã é uma escolha sustentada pelo Espírito — não depende das circunstâncias, mas de Cristo.'
  },
  {
    titulo: 'Paz',
    icone: 'bi-wind',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Filipenses 4.7 · Romanos 5.1 · João 14.27',
    descricao: 'Três dimensões: (1) Paz com Deus — reconciliação pela justificação pela fé (Rm 5.1). (2) A paz de Deus — equilíbrio interior que "excede todo entendimento" (Fp 4.7). (3) Paz com os homens — ser pacificador (Mt 5.9). "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá" (Jo 14.27). Não é ausência de conflito, mas estabilidade no meio dele.',
    aplicacao: 'Não se agitar com notícias ruins, não alimentar ansiedade sobre o futuro, buscar reconciliação nos relacionamentos quebrados. Quando a paz interna desaparece, pergunte: o que estou colocando no lugar de Deus?'
  },
  {
    titulo: 'Longanimidade',
    icone: 'bi-hourglass-split',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Tiago 1.3-4 · 2 Pedro 3.9',
    descricao: 'Do grego makrothumia — literalmente "alma longa". É a paciência de longo prazo: suportar injustiças e pessoas difíceis sem se vingar, esperar as promessas de Deus sem desesperar. Diferente da paciência com circunstâncias — é paciência com pessoas que nos machucam repetidamente. Deus mesmo é makrothumos: "tardio em irar-se" (Sl 103.8).',
    aplicacao: 'Não reagir impulsivamente a provocações, esperar a justiça de Deus ao invés de buscar vingança própria, persistir na fé mesmo quando Deus parece silencioso. A maturidade espiritual se mede muito pela longanimidade.'
  },
  {
    titulo: 'Benignidade',
    icone: 'bi-hand-heart-fill',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Efésios 4.32 · Tito 3.4',
    descricao: 'Do grego chrestotes — bondade prática em ação; uma disposição de coração que trata o próximo com cuidado, ternura e gentileza ativa. É a bondade que vai até o outro, que se incomoda com a necessidade alheia e age. "Sede bondosos uns para com os outros, compassivos, perdoando-vos mutuamente" (Ef 4.32). Deus mesmo exerce chrestotes ao nos salvar (Tt 3.4).',
    aplicacao: 'Ser gentil no tom de voz, nos gestos do dia a dia, ajudar quem está ao redor mesmo quando não é conveniente, tratar todas as pessoas — inclusive as difíceis — com cortesia e cuidado. Pequenas bondades importam muito.'
  },
  {
    titulo: 'Bondade',
    icone: 'bi-stars',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Salmo 34.8 · Mateus 21.12',
    descricao: 'Do grego agathosune — caráter moralmente bom, integridade interior que se expressa em generosidade. Vai além da benignidade (gentileza) por incluir a disposição de confrontar o erro quando necessário, por amor ao bem. Jesus expulsou os vendilhões do templo por bondade (agathosune) — foi severo por amor à santidade. A bondade cristã não é passividade; inclui coragem moral.',
    aplicacao: 'Agir com integridade mesmo quando não há testemunhas, ser generoso com o próximo, ter coragem de dizer a verdade com amor. Não confundir bondade com omissão: às vezes a ação mais bondosa é a mais difícil.'
  },
  {
    titulo: 'Fidelidade',
    icone: 'bi-shield-fill-check',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.22 · Mateus 25.21 · Lamentações 3.23',
    descricao: 'Do grego pistis — confiabilidade, lealdade, consistência. É ser digno de confiança: cumprir o que prometeu, ser o mesmo em público e em privado, permanecer fiel a Deus e às responsabilidades mesmo sob pressão. "Bem está, servo bom e fiel; foste fiel no pouco, sobre o muito te colocarei" (Mt 25.21). As misericórdias de Deus são "novas cada manhã; grande é a tua fidelidade" (Lm 3.23).',
    aplicacao: 'Chegar no horário combinado, cumprir promessas mesmo quando custa, ser consistente na leitura bíblica e na oração, não abandonar compromissos quando surgem dificuldades. A fidelidade no pequeno abre portas para o grande.'
  },
  {
    titulo: 'Mansidão',
    icone: 'bi-feather',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.23 · Mateus 5.5 · 11.29 · Números 12.3',
    descricao: 'Do grego prautes — humildade e suavidade, mas jamais fraqueza. É força controlada, poder submetido. Moisés era "o mais manso de todos os homens" (Nm 12.3), mas confrontou Faraó corajosamente. Jesus era "manso e humilde de coração" (Mt 11.29), mas expulsou mercadores do templo. Mansidão é a ausência de arrogância e a disposição genuína de servir e aprender.',
    aplicacao: 'Não insistir em ter razão, aceitar correção sem contra-atacar, não reagir com agressividade a críticas, servir sem exigir reconhecimento, tratar os outros como mais importantes do que si mesmo (Fp 2.3). Os mansos herdarão a terra (Mt 5.5).'
  },
  {
    titulo: 'Domínio Próprio',
    icone: 'bi-lightning-charge-fill',
    cor: '#16a34a',
    versiculo: 'Gálatas 5.23 · 1 Coríntios 9.27 · 2 Pedro 1.6',
    descricao: 'Do grego egkrateia — autocontrole, temperança, disciplina. É o governo do espírito sobre os apetites da carne: desejos, vícios, raiva, impulsos de consumo, uso do tempo. Paulo "domina o corpo e o escraviza" (1 Co 9.27). Não é repressão malsã nem legalismo — é a liberdade de quem não é escravo dos seus instintos. O Espírito nos dá "poder, amor e domínio próprio" (2 Tm 1.7).',
    aplicacao: 'Resistir ao impulso de comer em excesso, controlar o que assiste e o tempo no celular, não deixar a raiva determinar as palavras, resistir a compras por impulso. Pequenas disciplinas diárias formam o caráter ao longo do tempo.'
  },
];

/** Tooltips detalhados — Obras da Carne agrupadas (Gl 5.19-21) */
export const TOOLTIPS_OBRA = [
  {
    titulo: 'Imoralidade',
    icone: 'bi-fire',
    cor: '#dc2626',
    termos: 'Prostituição · Impureza · Lascívia',
    versiculo: 'Gálatas 5.19 · 1 Coríntios 6.18-20 · Mateus 5.28',
    descricao: 'Do grego porneia (prostituição), akatharsia (impureza) e aselgeia (lascívia/devassidão). Engloba toda forma de pecado sexual: adultério, fornicação, pornografia, luxúria no pensamento (Mt 5.28 — "quem olha para uma mulher com desejo já adulterou no coração"), relações fora do casamento, qualquer uso do corpo contrário ao plano de Deus. Não é apenas o ato físico — inclui o olhar, o pensamento cultivado, o entretenimento que alimenta a lascívia. "O corpo não é para a imoralidade, mas para o Senhor" (1 Co 6.13).',
    aplicacao: '⚠️ Atenção: pornografia, conversas sensuais, séries com conteúdo explícito, "ficar" sem compromisso, adultério emocional — tudo entra nessa categoria. O remédio bíblico é radical: "Fugi da imoralidade sexual" (1 Co 6.18) — não negociar, mas fugir.'
  },
  {
    titulo: 'Idolatria',
    icone: 'bi-diamond-half',
    cor: '#dc2626',
    termos: 'Idolatria',
    versiculo: 'Gálatas 5.20 · Colossenses 3.5 · Mateus 6.24 · Ezequiel 14.3',
    descricao: 'Não precisa ser uma estátua de pedra. Ídolo é qualquer coisa que ocupa o lugar de Deus no coração: dinheiro, sucesso profissional, a opinião dos outros, a família, um relacionamento, o celular, o esporte favorito. Colossenses 3.5 chama a cobiça de "idolatria". Ezequiel fala de "ídolos no coração" (Ez 14.3). "Ninguém pode servir a dois senhores" (Mt 6.24) — sempre haverá uma lealdade dominante.',
    aplicacao: '⚠️ Atenção: se você não consegue viver sem algo além de Deus — seja aprovação nas redes sociais, um relacionamento, dinheiro ou entretenimento — aquilo provavelmente é um ídolo. Pergunte: "O que ocupa mais meus pensamentos? O que me gera mais ansiedade perder?"'
  },
  {
    titulo: 'Feitiçaria',
    icone: 'bi-eye-fill',
    cor: '#dc2626',
    termos: 'Feitiçaria · Magia',
    versiculo: 'Gálatas 5.20 · Deuteronômio 18.10-12 · Isaías 8.19',
    descricao: 'Do grego pharmakeia (origem da palavra "farmácia" — uso de substâncias em rituais ocultistas). Não inclui apenas bruxaria declarada, mas qualquer busca de poder, orientação espiritual ou "proteção" fora de Deus: horóscopo, tarô, búzios, simpatias, uso de cristais com intenção espiritual, numerologia, jogos de azar como esperança de vida, superstições ("bater na madeira", "sal grosso", "amuletos"). "Por que irieis consultar os mortos em favor dos vivos?" (Is 8.19). Deus condena todas essas práticas em Deuteronômio 18.10-12.',
    aplicacao: '⚠️ Atenção: consultar o horóscopo "só por curiosidade", usar simpatias "inofensivas", confiar na sorte ou no destino, ver tarô online, usar pulseirinhas com "proteção" — são práticas que substituem a dependência de Deus por fontes que Ele condena. A alternativa: buscar orientação somente na Palavra e na oração (Tg 1.5).'
  },
  {
    titulo: 'Ódio',
    icone: 'bi-x-octagon-fill',
    cor: '#dc2626',
    termos: 'Inimizades · Contendas',
    versiculo: 'Gálatas 5.20 · Mateus 5.21-22 · 1 João 3.15 · Hebreus 12.15',
    descricao: 'Do grego echtrai (inimizades) e ereis (contendas e brigas). Não é só sentimento extremo de ódio declarado — é nutrir hostilidade, guardar rancor, recusar reconciliação, criar brigas, buscar destruir a reputação do outro. Jesus foi radical: equiparou a raiva injusta ao assassinato (Mt 5.21-22). "Quem odeia ao seu irmão é homicida" (1 Jo 3.15). A raiz amarga contamina a muitos (Hb 12.15).',
    aplicacao: '⚠️ Atenção: falar mal de alguém repetidamente, alimentar mágoa antiga, evitar um irmão na fé sem buscar reconciliação, criar "lados" em conflitos relacionais. Não há adoração aceitável enquanto há ódio não resolvido: "Reconciliai-vos primeiro com teu irmão, e então vem oferecer tua dádiva" (Mt 5.24).'
  },
  {
    titulo: 'Inveja',
    icone: 'bi-arrow-repeat',
    cor: '#dc2626',
    termos: 'Ciúmes · Invejas',
    versiculo: 'Gálatas 5.21 · Provérbios 14.30 · Tiago 3.14-16 · Romanos 12.15',
    descricao: 'Do grego zelos (ciúmes, rivalidade) e phthonoi (invejas). É o ressentimento pelo bem alheio: sentir amargura pelo sucesso, beleza, relacionamento ou bênção do próximo, querer o que o outro tem acompanhado de amargor. "A inveja é podridão dos ossos" (Pv 14.30) — literalmente corrói o ser. Tiago liga diretamente a inveja a "toda perturbação e toda obra maligna" (Tg 3.16). Foi a inveja que levou Caim a matar Abel, e os irmãos de José a vendê-lo.',
    aplicacao: '⚠️ Atenção: comparar-se nas redes sociais e sentir amargura, torcer silenciosamente contra alguém que prosperou, sentir-se ameaçado pelo sucesso de um colega ou irmão de fé, celebrar as quedas alheias. O remédio: "Alegrai-vos com os que se alegram" (Rm 12.15) e cultivar gratidão pelo que Deus deu a você.'
  },
  {
    titulo: 'Ira',
    icone: 'bi-lightning-fill',
    cor: '#dc2626',
    termos: 'Iras · Raiva descontrolada',
    versiculo: 'Gálatas 5.20 · Efésios 4.26-27 · Tiago 1.20 · Provérbios 14.17',
    descricao: 'Do grego thumoi — explosões de raiva descontrolada, acessos de fúria, violência verbal ou física. É diferente da "ira justa" (que reage ao pecado por amor à justiça — Jesus e Deus a possuem). A ira da carne é egoísta: nasce de orgulho ferido, de não conseguir o que se quer, de frustração acumulada. "A ira do homem não produz a justiça de Deus" (Tg 1.20). "Irai-vos, mas não pequeis; não deixeis que o sol se ponha sobre a vossa ira" (Ef 4.26).',
    aplicacao: '⚠️ Atenção: gritar em discussões, bater objetos, xingar, dizer coisas cruéis para ferir, guardar raiva por dias. A raiva em si não é pecado — o pecado está em perder o controle. Estratégia bíblica: "Todo homem seja pronto para ouvir, tardio para falar e tardio para irar-se" (Tg 1.19). Pausar antes de reagir salva relacionamentos.'
  },
  {
    titulo: 'Discórdia',
    icone: 'bi-exclamation-triangle-fill',
    cor: '#dc2626',
    termos: 'Discórdias · Dissensões · Intrigas',
    versiculo: 'Gálatas 5.20 · Provérbios 6.16-19 · Romanos 16.17',
    descricao: 'Do grego eritheiai (ambição egoísta, intriga) e dichostasiai (divisões). É criar conflito por interesse próprio, usar a discordância para se promover, semear desentendimentos entre pessoas, fazer fofoca que divide. Deus "odeia" quem "semeia discórdias entre irmãos" — aparece na lista das 7 coisas que Deus odeia (Pv 6.16-19). Paulo instrui: "notai os que causam divisões... e desviai-vos deles" (Rm 16.17).',
    aplicacao: '⚠️ Atenção: fofoca que divide a família ou a Igreja, "jogar" uma pessoa contra outra, criar polêmica desnecessária em grupos de WhatsApp para chamar atenção, usar informações de outros para se destacar. O remédio: ir diretamente à pessoa com quem há conflito (Mt 18.15), não espalhar para terceiros.'
  },
  {
    titulo: 'Sectarismo',
    icone: 'bi-people-fill',
    cor: '#dc2626',
    termos: 'Facções · Cismas · Partidarismos',
    versiculo: 'Gálatas 5.20 · 1 Coríntios 1.10-13 · 3.3-4 · João 17.21',
    descricao: 'Do grego haireseis — facções, partidos, cismas dentro do Corpo de Cristo. É dividir a Igreja por lealdades humanas, denominações, estilos de louvor, preferências de pregadores ou doutrinas secundárias, quebrando a unidade que pertence somente a Cristo. Corinto se dividiu: "eu sou de Paulo", "eu sou de Apolo", "eu sou de Cristo" (1 Co 1.12). Jesus orou para que todos sejam um (Jo 17.21) — o sectarismo crucifica essa oração.',
    aplicacao: '⚠️ Atenção: "minha denominação é a única certa", rejeitar irmãos em Cristo por não serem do mesmo estilo de culto, brigar por instrumentos musicais, dias de culto ou metodologias de evangelismo a ponto de dividir o corpo. Questões secundárias não devem romper a unidade primária em Cristo.'
  },
  {
    titulo: 'Excessos',
    icone: 'bi-cup-fill',
    cor: '#dc2626',
    termos: 'Bebedices · Glutonarias · Orgias',
    versiculo: 'Gálatas 5.21 · Efésios 5.18 · 1 Coríntios 6.12 · Romanos 13.13',
    descricao: 'Do grego methai (embriaguez) e komoi (glutonarias, festas desregradas). Não é proibição de prazer, mas condenação da perda de controle: embriaguez que altera o juízo, uso de drogas, compulsão alimentar, festas que levam ao pecado. "Não vos embriagueis com vinho... mas enchei-vos do Espírito" (Ef 5.18). O princípio geral é: "Tudo me é lícito, mas nem tudo convém; tudo me é lícito, mas eu não me deixarei dominar por coisa alguma" (1 Co 6.12).',
    aplicacao: '⚠️ Atenção: o vício não é só álcool — vício em séries, jogos, celular, comida, compras, pornografia ou qualquer coisa que te "domina" (1 Co 6.12) entra nessa categoria. O crente não deve ser escravo de nada além de Cristo. Quando algo começa a controlar você, é sinal de alarme espiritual.'
  },
];

/** Fruto do Espírito (atributos positivos) — Gálatas 5.22-23 */
export const FRUTO_DO_ESPIRITO = [
  'Amor', 'Alegria', 'Paz', 'Longanimidade', 'Benignidade', 'Bondade', 'Fidelidade', 'Mansidão', 'Domínio próprio'
];

/**
 * Batalha Espiritual — 9 confrontos equilibrados (Fruto do Espírito × Obras da Carne).
 * Cada par é uma luta espiritual: a virtude que vence o vício oposto.
 */
export const BATALHA_ESPIRITUAL = [
  {
    fruto: 'Amor',           obra: 'Ódio',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.20',
    descFruto: 'Amar a Deus e ao próximo com sinceridade.',
    descObra:  'Inimizades e contendas que destroem relacionamentos.',
    icone: 'bi-heart-fill'
  },
  {
    fruto: 'Alegria',        obra: 'Inveja',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.21',
    descFruto: 'Alegria plena no Espírito, independente das circunstâncias.',
    descObra:  'Ciúmes e invejas que consomem e roubam a paz interior.',
    icone: 'bi-emoji-smile-fill'
  },
  {
    fruto: 'Paz',            obra: 'Discórdia',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.20',
    descFruto: 'Paz que excede todo entendimento e reconcilia.',
    descObra:  'Discórdias e dissensões que fragmentam a unidade.',
    icone: 'bi-wind'
  },
  {
    fruto: 'Longanimidade',  obra: 'Ira',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.20',
    descFruto: 'Paciência e perseverança mesmo sob pressão.',
    descObra:  'Explosões de ira e violência que afastam o próximo.',
    icone: 'bi-hourglass-split'
  },
  {
    fruto: 'Benignidade',    obra: 'Imoralidade',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.19',
    descFruto: 'Bondade e compaixão que servem ao próximo com pureza.',
    descObra:  'Prostituição, impureza e lascívia que corrompem o corpo.',
    icone: 'bi-hand-heart-fill'
  },
  {
    fruto: 'Bondade',        obra: 'Feitiçaria',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.20',
    descFruto: 'Bondade genuína que vem de Deus e age com integridade.',
    descObra:  'Práticas ocultas e manipulação espiritual contra Deus.',
    icone: 'bi-stars'
  },
  {
    fruto: 'Fidelidade',     obra: 'Idolatria',
    versiculoFruto: 'Gl 5.22', versiculoObra: 'Gl 5.20',
    descFruto: 'Fidelidade a Deus e às suas promessas acima de tudo.',
    descObra:  'Servir a outros deuses e colocar coisas antes de Deus.',
    icone: 'bi-shield-fill-check'
  },
  {
    fruto: 'Mansidão',       obra: 'Sectarismo',
    versiculoFruto: 'Gl 5.23', versiculoObra: 'Gl 5.20',
    descFruto: 'Espírito manso e humilde que promove a unidade no corpo.',
    descObra:  'Facções e divisões que destroem a comunhão entre irmãos.',
    icone: 'bi-feather'
  },
  {
    fruto: 'Domínio próprio',obra: 'Excessos',
    versiculoFruto: 'Gl 5.23', versiculoObra: 'Gl 5.21',
    descFruto: 'Autocontrole e temperança que guardam o corpo e a mente.',
    descObra:  'Bebedices e glutonarias que escravizam os sentidos.',
    icone: 'bi-lightning-charge-fill'
  },
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
