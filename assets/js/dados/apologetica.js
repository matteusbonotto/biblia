/**
 * Apologética — Perguntas Frequentes e Respostas para Defender a Fé Cristã
 * Perspectiva Presbiteriana Calvinista Reformada
 * 
 * Doutrinas fundamentais:
 * - Depravação Total: O homem está totalmente corrompido pelo pecado
 * - Eleição Incondicional: Deus escolhe quem será salvo, não baseado em mérito humano
 * - Expiação Limitada: Cristo morreu especificamente pelos eleitos
 * - Graça Irresistível: Quando Deus chama, o eleito não pode resistir
 * - Perseverança dos Santos: Os eleitos não podem perder a salvação
 * 
 * Estrutura organizada por categorias para facilitar o estudo e preparação
 */

export const CATEGORIAS_APOLOGETICA = [
  { id: 'deus-existe', nome: 'Existência de Deus', icone: 'bi-star-fill', cor: '#25633b' },
  { id: 'biblia-confiavel', nome: 'Confiabilidade da Bíblia', icone: 'bi-book-fill', cor: '#2c6ebf' },
  { id: 'jesus-cristo', nome: 'Jesus Cristo', icone: 'bi-heart-fill', cor: '#dc143c' },
  { id: 'ciencia-fe', nome: 'Ciência e Fé', icone: 'bi-flask', cor: '#7b68ee' },
  { id: 'sofrimento-mal', nome: 'Sofrimento e Mal', icone: 'bi-exclamation-triangle-fill', cor: '#ff6b35' },
  { id: 'outras-religioes', nome: 'Outras Religiões', icone: 'bi-globe', cor: '#f39c12' },
  { id: 'objecoes-comuns', nome: 'Objeções Comuns', icone: 'bi-question-circle-fill', cor: '#9b59b6' },
  { id: 'evidencias', nome: 'Evidências Históricas', icone: 'bi-file-earmark-text-fill', cor: '#16a085' },
];

export const PERGUNTAS_APOLOGETICA = [
  // ── EXISTÊNCIA DE DEUS ────────────────────────────────────────────────
  {
    id: 'deus-1',
    categoria: 'deus-existe',
    pergunta: 'Como sabemos que Deus existe?',
    resposta: 'A existência de Deus pode ser conhecida através de várias evidências: (1) A criação testemunha um Criador (Sl 19.1; Rm 1.20); (2) A complexidade e ordem do universo apontam para design inteligente; (3) A lei moral universal sugere um Legislador; (4) A experiência pessoal de milhões de crentes ao longo da história; (5) A ressurreição de Jesus Cristo é a maior evidência histórica.',
    versiculos: [
      { ref: 'Salmo 19.1', texto: 'Os céus proclamam a glória de Deus, e o firmamento anuncia as obras das suas mãos.' },
      { ref: 'Romanos 1.20', texto: 'Pois os atributos invisíveis de Deus, assim o seu eterno poder, como também a sua própria divindade, claramente se reconhecem, desde o princípio do mundo, sendo percebidos por meio das coisas que foram criadas.' },
    ],
    pontosChave: ['Argumento cosmológico', 'Argumento do design', 'Argumento moral', 'Evidência histórica'],
    dificuldade: 'iniciante',
  },
  {
    id: 'deus-2',
    categoria: 'deus-existe',
    pergunta: 'E se Deus não existir? O que perdemos em acreditar?',
    resposta: 'Esta é a famosa "Aposta de Pascal", mas a fé cristã não é apenas uma aposta. Se Deus não existir, perdemos apenas uma vida terrena. Mas se Ele existir (e as evidências apontam fortemente para isso), ganhamos a vida eterna e perdemos tudo se não crermos. Além disso, a vida cristã traz benefícios reais mesmo nesta vida: propósito, esperança, comunidade, transformação moral. A questão não é "e se não existir?", mas "as evidências apontam para a existência de Deus" — e a ressurreição de Jesus é a prova definitiva.',
    versiculos: [
      { ref: '1 Coríntios 15.19', texto: 'Se a nossa esperança em Cristo se limita apenas a esta vida, somos os mais infelizes de todos os homens.' },
      { ref: 'João 3.16', texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
    ],
    pontosChave: ['Aposta de Pascal', 'Evidências históricas', 'Benefícios da fé', 'Ressurreição de Jesus'],
    dificuldade: 'iniciante',
  },
  {
    id: 'deus-3',
    categoria: 'deus-existe',
    pergunta: 'Por que há tanto mal no mundo se Deus é bom?',
    resposta: 'Esta é uma das objeções mais profundas. A Bíblia explica: (1) Deus criou um mundo perfeito, mas o mal entrou através do pecado de Adão (Gn 3; Rm 5.12) — a Queda afetou toda a criação; (2) O homem está totalmente depravado pelo pecado e não pode escolher o bem por si mesmo (Rm 3.10-12; Ef 2.1); (3) Deus, em Sua soberania, permite o mal para cumprir Seus propósitos eternos (Gn 50.20; Rm 9.17-18); (4) Deus não é indiferente ao sofrimento — Ele mesmo sofreu na cruz; (5) Deus usa o sofrimento para santificação e glória (Rm 8.28-30); (6) Um dia, Deus julgará todo mal e restaurará a criação (Ap 21.4). O problema do mal, na verdade, é um argumento A FAVOR da existência de Deus — porque sem um padrão absoluto de bem, não poderíamos chamar nada de "mal".',
    versiculos: [
      { ref: 'Romanos 5.12', texto: 'Portanto, assim como por um só homem entrou o pecado no mundo, e pelo pecado, a morte, assim também a morte passou a todos os homens, porque todos pecaram.' },
      { ref: 'Romanos 8.28', texto: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
      { ref: 'Romanos 3.10-12', texto: 'Não há justo, nem um sequer, não há quem entenda, não há quem busque a Deus; todos se extraviaram, à uma se fizeram inúteis; não há quem faça o bem, não há nem um sequer.' },
      { ref: 'Apocalipse 21.4', texto: 'E lhes enxugará dos olhos toda lágrima, e a morte já não existirá, já não haverá luto, nem pranto, nem dor, porque as primeiras coisas passaram.' },
    ],
    pontosChave: ['Origem do mal (Queda)', 'Depravação total', 'Soberania de Deus', 'Sofrimento de Deus', 'Propósito do sofrimento', 'Julgamento final'],
    dificuldade: 'intermediario',
  },

  // ── CONFIABILIDADE DA BÍBLIA ──────────────────────────────────────────
  {
    id: 'biblia-1',
    categoria: 'biblia-confiavel',
    pergunta: 'A Bíblia não foi alterada ao longo dos séculos?',
    resposta: 'Não. A Bíblia é o documento antigo mais bem preservado da história. Temos mais de 5.800 manuscritos do Novo Testamento em grego (comparado a apenas 7 manuscritos de Platão). Os manuscritos mais antigos datam de poucas décadas após os eventos (P52, fragmento de João, ~125 d.C.). A precisão textual é de 99,5% — as variações são principalmente erros de ortografia ou ordem de palavras, sem impacto doutrinário. O Antigo Testamento foi preservado com extrema precisão pelos escribas judeus (massoretas). A arqueologia confirma consistentemente os relatos bíblicos.',
    versiculos: [
      { ref: '2 Timóteo 3.16', texto: 'Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção, para a educação na justiça.' },
      { ref: '2 Pedro 1.21', texto: 'Porque nunca jamais qualquer profecia foi dada por vontade humana; entretanto, homens santos falaram da parte de Deus, movidos pelo Espírito Santo.' },
    ],
    pontosChave: ['Manuscritos antigos', 'Precisão textual', 'Arqueologia', 'Inspiração divina'],
    dificuldade: 'intermediario',
  },
  {
    id: 'biblia-2',
    categoria: 'biblia-confiavel',
    pergunta: 'A Bíblia não tem contradições?',
    resposta: 'As aparentes contradições são na verdade complementos ou diferenças de perspectiva. Por exemplo: (1) Diferentes evangelistas destacam aspectos diferentes do mesmo evento; (2) Números arredondados vs. exatos; (3) Diferentes testemunhas oculares descrevem o mesmo evento de formas ligeiramente diferentes (isso é normal e esperado); (4) Contexto histórico e cultural. Quando estudadas cuidadosamente, as "contradições" se resolvem. Nenhuma contradição real foi encontrada que comprometa a mensagem central. A consistência da Bíblia ao longo de 1.500 anos, 40+ autores e 3 continentes é, na verdade, um milagre que aponta para a inspiração divina.',
    versiculos: [
      { ref: 'Lucas 1.1-4', texto: 'Visto que muitos houve que empreenderam uma narração coordenada dos fatos que entre nós se realizaram... para que tenhas plena certeza das verdades em que foste instruído.' },
    ],
    pontosChave: ['Perspectivas diferentes', 'Contexto histórico', 'Consistência geral', 'Inspiração divina'],
    dificuldade: 'intermediario',
  },
  {
    id: 'biblia-3',
    categoria: 'biblia-confiavel',
    pergunta: 'Como sabemos que os livros da Bíblia são os corretos?',
    resposta: 'O cânon bíblico (lista de livros inspirados) foi estabelecido através de critérios rigorosos: (1) Autoria apostólica ou profética; (2) Consistência com o restante das Escrituras; (3) Uso universal nas igrejas antigas; (4) Testemunho do Espírito Santo na comunidade de fé. O Antigo Testamento foi estabelecido pelos judeus antes de Cristo. O Novo Testamento foi reconhecido pela igreja primitiva no século IV, mas os livros já eram usados e citados desde o século I. Não foi um "conselho" que decidiu — foi o reconhecimento do que já era aceito universalmente.',
    versiculos: [
      { ref: '1 Timóteo 5.18', texto: 'Pois a Escritura diz: "Não amordaces o boi quando ele estiver debulhando o cereal", e: "O trabalhador é digno do seu salário".' },
    ],
    pontosChave: ['Critérios do cânon', 'Reconhecimento histórico', 'Uso universal', 'Testemunho do Espírito'],
    dificuldade: 'avancado',
  },

  // ── JESUS CRISTO ───────────────────────────────────────────────────────
  {
    id: 'jesus-1',
    categoria: 'jesus-cristo',
    pergunta: 'Jesus realmente existiu?',
    resposta: 'Sim, a existência histórica de Jesus é aceita por praticamente todos os historiadores sérios, cristãos ou não. Evidências: (1) Relatos bíblicos (4 evangelhos + cartas); (2) Fontes romanas (Tácito, Suetônio, Plínio); (3) Fontes judaicas (Flávio Josefo); (4) Evidências arqueológicas. A questão não é "se Jesus existiu", mas "quem Ele era". As evidências apontam fortemente para Sua divindade e ressurreição.',
    versiculos: [
      { ref: 'João 1.1,14', texto: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus... E o Verbo se fez carne e habitou entre nós.' },
      { ref: '1 Coríntios 15.3-4', texto: 'Cristo morreu pelos nossos pecados, segundo as Escrituras, e foi sepultado, e ressuscitou ao terceiro dia, segundo as Escrituras.' },
    ],
    pontosChave: ['Evidências históricas', 'Fontes não-cristãs', 'Arqueologia', 'Divindade de Jesus'],
    dificuldade: 'iniciante',
  },
  {
    id: 'jesus-2',
    categoria: 'jesus-cristo',
    pergunta: 'Jesus realmente ressuscitou?',
    resposta: 'Sim. As evidências da ressurreição são esmagadoras: (1) O túmulo vazio — os inimigos de Jesus nunca produziram o corpo; (2) Múltiplas aparições a mais de 500 pessoas (1 Co 15.6); (3) A transformação dos discípulos (de medrosos a mártires); (4) O surgimento da Igreja — algo extraordinário aconteceu; (5) A conversão de Paulo (inimigo ferrenho); (6) O testemunho das mulheres (não teriam credibilidade na época, então não seriam inventadas); (7) A mudança do sábado para o domingo. A melhor explicação para todos esses fatos é que Jesus realmente ressuscitou.',
    versiculos: [
      { ref: '1 Coríntios 15.6', texto: 'Depois apareceu a mais de quinhentos irmãos de uma só vez, dos quais a maioria ainda vive.' },
      { ref: 'Mateus 28.6', texto: 'Não está aqui, porque ressuscitou, como tinha dito. Vinde ver o lugar onde jazia.' },
    ],
    pontosChave: ['Túmulo vazio', 'Aparições', 'Transformação dos discípulos', 'Conversão de Paulo', 'Mudança do sábado'],
    dificuldade: 'intermediario',
  },
  {
    id: 'jesus-3',
    categoria: 'jesus-cristo',
    pergunta: 'Jesus é realmente Deus?',
    resposta: 'Sim. Jesus afirmou ser Deus de várias formas: (1) "Eu e o Pai somos um" (Jo 10.30); (2) "Antes que Abraão existisse, EU SOU" (Jo 8.58) — usando o nome divino; (3) Aceitou adoração (Mt 14.33); (4) Perdoou pecados (Mc 2.5-7) — algo que só Deus pode fazer; (5) Afirmou ter autoridade sobre a vida eterna (Jo 5.24). Os discípulos O reconheceram como Deus (Jo 1.1; Cl 2.9). A ressurreição confirma Sua divindade (Rm 1.4).',
    versiculos: [
      { ref: 'João 10.30', texto: 'Eu e o Pai somos um.' },
      { ref: 'João 8.58', texto: 'Em verdade, em verdade vos digo: antes que Abraão existisse, EU SOU.' },
      { ref: 'Colossenses 2.9', texto: 'Pois nele habita corporalmente toda a plenitude da divindade.' },
    ],
    pontosChave: ['Afirmações de Jesus', 'Nome divino', 'Aceitou adoração', 'Perdoou pecados', 'Ressurreição'],
    dificuldade: 'intermediario',
  },

  // ── CIÊNCIA E FÉ ──────────────────────────────────────────────────────
  {
    id: 'ciencia-1',
    categoria: 'ciencia-fe',
    pergunta: 'A ciência não prova que a Bíblia está errada?',
    resposta: 'Não. A ciência e a Bíblia não estão em conflito quando ambas são interpretadas corretamente. (1) A Bíblia não é um livro de ciência — ela descreve eventos de forma fenomenológica (como aparecem aos olhos); (2) Muitos cientistas renomados foram/são cristãos (Newton, Kepler, Pascal, Collins); (3) A ciência moderna nasceu em ambiente cristão (crença em ordem e leis universais); (4) Quando há aparente conflito, geralmente é questão de interpretação, não de fato. A Bíblia e a ciência respondem perguntas diferentes: "Como?" vs. "Por quê?".',
    versiculos: [
      { ref: 'Salmo 19.1', texto: 'Os céus proclamam a glória de Deus, e o firmamento anuncia as obras das suas mãos.' },
      { ref: 'Romanos 1.20', texto: 'Pois os atributos invisíveis de Deus... claramente se reconhecem... sendo percebidos por meio das coisas que foram criadas.' },
    ],
    pontosChave: ['Interpretação correta', 'Cientistas cristãos', 'Origens da ciência', 'Perguntas diferentes'],
    dificuldade: 'intermediario',
  },
  {
    id: 'ciencia-2',
    categoria: 'ciencia-fe',
    pergunta: 'E a teoria da evolução?',
    resposta: 'A evolução é uma teoria científica sobre como a vida mudou ao longo do tempo. A Bíblia não é um livro de biologia. O que a Bíblia ensina claramente é: (1) Deus criou tudo; (2) Os humanos são especiais, feitos à imagem de Deus; (3) Adão e Eva foram pessoas reais (Lc 3.23-38 traça a genealogia até Adão). Alguns cristãos veem a evolução como o "mecanismo" que Deus usou; outros rejeitam. O ponto central é: Deus é o Criador, e os humanos têm valor especial. A questão não é "evolução vs. criação", mas "evolução guiada por Deus vs. evolução sem propósito".',
    versiculos: [
      { ref: 'Gênesis 1.27', texto: 'Criou Deus, pois, o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.' },
      { ref: 'Lucas 3.38', texto: '...filho de Enos, filho de Sete, filho de Adão, filho de Deus.' },
    ],
    pontosChave: ['Criação divina', 'Imagem de Deus', 'Adão histórico', 'Mecanismo vs. propósito'],
    dificuldade: 'avancado',
  },

  // ── SOFRIMENTO E MAL ──────────────────────────────────────────────────
  {
    id: 'sofrimento-1',
    categoria: 'sofrimento-mal',
    pergunta: 'Por que Deus permite o sofrimento?',
    resposta: 'Esta é uma questão profunda. A Bíblia explica: (1) O sofrimento entrou no mundo através do pecado de Adão (Gn 3; Rm 5.12) — a Queda afetou toda a criação; (2) O homem está totalmente depravado e não pode escolher o bem por si mesmo (Rm 3.10-12; Ef 2.1); (3) Deus, em Sua soberania, permite o sofrimento para cumprir Seus propósitos eternos — santificação dos eleitos e manifestação de Sua glória (Rm 8.28-30; 2 Co 4.17); (4) Deus não é indiferente — Ele mesmo sofreu na cruz; (5) Deus usa o sofrimento para nos conformar à imagem de Cristo (Rm 8.29), produzir perseverança (Tg 1.2-4) e nos fazer depender dEle; (6) Um dia, todo sofrimento acabará (Ap 21.4); (7) O sofrimento pode ser um meio que Deus usa para chamar Seus eleitos à salvação. A cruz mostra que Deus entende nosso sofrimento — Ele não está distante, mas sofreu conosco.',
    versiculos: [
      { ref: 'Romanos 5.12', texto: 'Portanto, assim como por um só homem entrou o pecado no mundo, e pelo pecado, a morte, assim também a morte passou a todos os homens, porque todos pecaram.' },
      { ref: 'Romanos 8.28-30', texto: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito... aos que predestinou, a esses também chamou; e aos que chamou, a esses também justificou; e aos que justificou, a esses também glorificou.' },
      { ref: 'Efésios 2.1', texto: 'Ele vos deu vida, estando vós mortos nos vossos delitos e pecados.' },
      { ref: 'Tiago 1.2-4', texto: 'Meus irmãos, tende por motivo de toda alegria o passardes por várias provações, sabendo que a prova da vossa fé produz perseverança.' },
      { ref: 'Apocalipse 21.4', texto: 'E lhes enxugará dos olhos toda lágrima, e a morte já não existirá.' },
    ],
    pontosChave: ['Origem do mal (Queda)', 'Depravação total', 'Soberania de Deus', 'Sofrimento de Deus', 'Santificação', 'Propósito eterno', 'Fim do sofrimento'],
    dificuldade: 'intermediario',
  },

  // ── OUTRAS RELIGIÕES ──────────────────────────────────────────────────
  {
    id: 'religioes-1',
    categoria: 'outras-religioes',
    pergunta: 'Todas as religiões não levam ao mesmo lugar?',
    resposta: 'Não. As religiões têm crenças fundamentalmente diferentes sobre Deus, salvação e vida após a morte. Por exemplo: (1) Cristianismo reformado: salvação pela graça somente, através da fé em Jesus Cristo, por eleição incondicional de Deus; (2) Islamismo: salvação por obras; (3) Hinduísmo: ciclo de reencarnação; (4) Budismo: eliminação do desejo. Essas são incompatíveis. Jesus disse: "Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim" (Jo 14.6). A salvação não é por escolha humana, mas pela graça soberana de Deus (Ef 2.8-9; Rm 9.16). A questão não é "todas são válidas", mas "qual é verdadeira?". As evidências históricas (especialmente a ressurreição) apontam para Jesus.',
    versiculos: [
      { ref: 'João 14.6', texto: 'Respondeu-lhe Jesus: Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim.' },
      { ref: 'Atos 4.12', texto: 'E não há salvação em nenhum outro; porque abaixo do céu não existe nenhum outro nome, dado entre os homens, pelo qual importa que sejamos salvos.' },
      { ref: 'Efésios 2.8-9', texto: 'Pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus; não de obras, para que ninguém se glorie.' },
      { ref: 'Romanos 9.16', texto: 'Assim, pois, não depende de quem quer ou de quem corre, mas de usar Deus a sua misericórdia.' },
    ],
    pontosChave: ['Crenças incompatíveis', 'Salvação pela graça somente', 'Eleição incondicional', 'Afirmação de Jesus', 'Evidências históricas'],
    dificuldade: 'intermediario',
  },

  // ── OBJEÇÕES COMUNS ────────────────────────────────────────────────────
  {
    id: 'objecao-1',
    categoria: 'objecoes-comuns',
    pergunta: 'A religião é só uma muleta emocional',
    resposta: 'Se a religião cristã fosse apenas uma "muleta", não teria sobrevivido 2.000 anos de perseguição, martírio e críticas intelectuais. Além disso: (1) A fé cristã tem base histórica sólida (ressurreição); (2) Muitos dos maiores intelectuais da história foram cristãos; (3) A "muleta" não explica a transformação de vida de milhões; (4) Se fosse apenas conforto, por que tantos cristãos escolheram o martírio? (5) A verdade não depende de ser "confortável" — ela é verdade independentemente. A questão é: "É verdade?" — não "É confortável?".',
    versiculos: [
      { ref: '1 Coríntios 15.14', texto: 'E, se Cristo não ressuscitou, é vã a nossa pregação, e vã, a vossa fé.' },
      { ref: '1 Pedro 3.15', texto: 'Estai sempre preparados para responder a todo aquele que vos pedir razão da esperança que há em vós.' },
    ],
    pontosChave: ['Base histórica', 'Intelectuais cristãos', 'Transformação', 'Martírio', 'Verdade vs. conforto'],
    dificuldade: 'iniciante',
  },
  {
    id: 'objecao-2',
    categoria: 'objecoes-comuns',
    pergunta: 'Os cristãos são hipócritas',
    resposta: 'Infelizmente, alguns cristãos não vivem de acordo com o que pregam. Mas isso não invalida o cristianismo — na verdade, prova que a Bíblia está certa ao dizer que todos são pecadores (Rm 3.23). A diferença não é que os cristãos são perfeitos, mas que reconhecem sua imperfeição e dependem da graça de Deus. Jesus mesmo condenou a hipocrisia (Mt 23). O fato de haver cristãos hipócritas não significa que o cristianismo seja falso — significa que precisamos de mais graça, não menos. O padrão é Cristo, não os cristãos.',
    versiculos: [
      { ref: 'Romanos 3.23', texto: 'Pois todos pecaram e carecem da glória de Deus.' },
      { ref: 'Mateus 23.13', texto: 'Ai de vós, escribas e fariseus, hipócritas!' },
    ],
    pontosChave: ['Pecadores salvos', 'Graça de Deus', 'Padrão é Cristo', 'Hipocrisia condenada'],
    dificuldade: 'iniciante',
  },

  // ── EVIDÊNCIAS HISTÓRICAS ──────────────────────────────────────────────
  {
    id: 'evidencia-1',
    categoria: 'evidencias',
    pergunta: 'Quais são as evidências históricas do cristianismo?',
    resposta: 'As evidências são abundantes: (1) Manuscritos bíblicos antigos (mais de 5.800 do NT); (2) Fontes não-cristãs confirmando Jesus (Tácito, Josefo, Plínio); (3) Arqueologia confirmando lugares e eventos bíblicos; (4) A rápida expansão do cristianismo (algo extraordinário aconteceu); (5) O testemunho dos mártires (ninguém morre por uma mentira); (6) A transformação dos discípulos; (7) A conversão de Paulo (inimigo ferrenho). A ressurreição é a evidência central — sem ela, o cristianismo não teria começado.',
    versiculos: [
      { ref: '1 Coríntios 15.3-8', texto: 'Cristo morreu pelos nossos pecados... foi sepultado, e ressuscitou... apareceu a Cefas, e, depois, aos doze. Depois, apareceu a mais de quinhentos irmãos de uma só vez... por último de todos, apareceu também a mim.' },
    ],
    pontosChave: ['Manuscritos', 'Fontes não-cristãs', 'Arqueologia', 'Expansão rápida', 'Mártires', 'Ressurreição'],
    dificuldade: 'intermediario',
  },

  // ── DOUTRINAS REFORMADAS ────────────────────────────────────────────────
  {
    id: 'doutrina-1',
    categoria: 'objecoes-comuns',
    pergunta: 'Se Deus já escolheu quem será salvo, por que pregar o evangelho?',
    resposta: 'Esta é uma objeção comum à doutrina da eleição. A resposta bíblica é: (1) Deus ordenou tanto os fins (eleição) quanto os meios (pregação) — Ele escolheu salvar através da pregação do evangelho (Rm 10.14-17); (2) Não sabemos quem são os eleitos — devemos pregar a todos; (3) A pregação é o meio que Deus usa para chamar Seus eleitos à fé (1 Co 1.21); (4) A responsabilidade humana permanece — todos são responsáveis por crer, mesmo que a capacidade de crer venha de Deus (Ef 2.8-9); (5) A pregação glorifica a Deus ao manifestar Sua graça. A eleição não anula a responsabilidade de pregar, mas a fundamenta — sabemos que a Palavra não retornará vazia (Is 55.11).',
    versiculos: [
      { ref: 'Romanos 10.14-17', texto: 'Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados? ... E, assim, a fé vem pela pregação, e a pregação, pela palavra de Cristo.' },
      { ref: '1 Coríntios 1.21', texto: 'Visto que, na sabedoria de Deus, o mundo não o conheceu por sua própria sabedoria, aprouve a Deus salvar os que crêem pela loucura da pregação.' },
      { ref: 'Efésios 2.8-9', texto: 'Pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus; não de obras, para que ninguém se glorie.' },
      { ref: 'Isaías 55.11', texto: 'Assim será a palavra que sair da minha boca; não voltará para mim vazia, mas fará o que me apraz e prosperará naquilo para que a designei.' },
    ],
    pontosChave: ['Eleição e meios', 'Responsabilidade de pregar', 'Pregação como meio', 'Glorificação de Deus', 'Eficácia da Palavra'],
    dificuldade: 'avancado',
  },
  {
    id: 'doutrina-2',
    categoria: 'objecoes-comuns',
    pergunta: 'A predestinação não torna Deus injusto?',
    resposta: 'Não. A Bíblia ensina que: (1) Todos pecaram e merecem condenação (Rm 3.23; 6.23) — ninguém é inocente; (2) A justiça de Deus exigiria que todos fossem condenados; (3) A graça é um ato de misericórdia, não de justiça — Deus não é obrigado a salvar ninguém (Rm 9.14-18); (4) A questão não é "por que alguns são condenados?", mas "por que alguns são salvos?" — a resposta é a graça soberana de Deus; (5) Deus é justo ao condenar os réprobos e misericordioso ao salvar os eleitos (Rm 9.22-24); (6) Não podemos questionar a justiça de Deus — Ele é o Criador e tem autoridade sobre Sua criação (Rm 9.20-21). A predestinação manifesta tanto a justiça quanto a misericórdia de Deus.',
    versiculos: [
      { ref: 'Romanos 3.23', texto: 'Pois todos pecaram e carecem da glória de Deus.' },
      { ref: 'Romanos 6.23', texto: 'Pois o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus, nosso Senhor.' },
      { ref: 'Romanos 9.14-18', texto: 'Que diremos, pois? Há injustiça da parte de Deus? De modo nenhum! Pois ele diz a Moisés: Terei misericórdia de quem me aprouver ter misericórdia e compadecer-me-ei de quem me aprouver ter compaixão. Assim, pois, não depende de quem quer ou de quem corre, mas de usar Deus a sua misericórdia.' },
      { ref: 'Romanos 9.20-21', texto: 'Quem és tu, ó homem, para discutires com Deus? Porventura, pode o objeto perguntar a quem o fez: Por que me fizeste assim? Ou não tem o oleiro direito sobre a massa?' },
    ],
    pontosChave: ['Depravação total', 'Merecimento de condenação', 'Graça como misericórdia', 'Soberania de Deus', 'Justiça e misericórdia'],
    dificuldade: 'avancado',
  },
  {
    id: 'doutrina-3',
    categoria: 'objecoes-comuns',
    pergunta: 'Se não há livre-arbítrio, como posso ser responsável pelos meus pecados?',
    resposta: 'A Bíblia ensina que: (1) O homem não tem livre-arbítrio no sentido de poder escolher o bem espiritual — está morto em pecados (Ef 2.1; Rm 3.10-12); (2) Mas o homem tem liberdade de escolha dentro de sua natureza corrompida — escolhe o que deseja, mas seus desejos são pecaminosos (Jo 8.34); (3) A responsabilidade permanece porque o homem peca voluntariamente, não forçado — ele escolhe pecar porque quer (Tg 1.14-15); (4) A incapacidade de escolher o bem não anula a responsabilidade — um homem cego é responsável por não ver, mesmo que não possa ver; (5) Deus é soberano e o homem é responsável — ambas as verdades são bíblicas e devem ser mantidas juntas (Fp 2.12-13); (6) A salvação é obra de Deus, mas o pecado é culpa do homem. A responsabilidade não depende de capacidade, mas de agência — o homem age conforme sua natureza pecaminosa.',
    versiculos: [
      { ref: 'Efésios 2.1', texto: 'Ele vos deu vida, estando vós mortos nos vossos delitos e pecados.' },
      { ref: 'Romanos 3.10-12', texto: 'Não há justo, nem um sequer, não há quem entenda, não há quem busque a Deus; todos se extraviaram, à uma se fizeram inúteis; não há quem faça o bem, não há nem um sequer.' },
      { ref: 'João 8.34', texto: 'Respondeu-lhes Jesus: Em verdade, em verdade vos digo: todo o que comete pecado é escravo do pecado.' },
      { ref: 'Tiago 1.14-15', texto: 'Ao contrário, cada um é tentado pela sua própria cobiça, quando esta o atrai e seduz. Então, a cobiça, tendo engendrado o pecado, o pecado, uma vez consumado, gera a morte.' },
      { ref: 'Filipenses 2.12-13', texto: 'Assim, pois, amados meus, como sempre obedecestes, não só na minha presença, porém, muito mais agora, na minha ausência, desenvolvei a vossa salvação com temor e tremor; porque Deus é quem efetua em vós tanto o querer como o realizar, segundo a sua boa vontade.' },
    ],
    pontosChave: ['Morte espiritual', 'Liberdade dentro da natureza', 'Pecado voluntário', 'Responsabilidade e incapacidade', 'Soberania e responsabilidade', 'Agência humana'],
    dificuldade: 'avancado',
  },
];

/**
 * Dicas para estudar apologética
 */
export const DICAS_ESTUDO = [
  'Estude uma pergunta por vez — não tente memorizar tudo de uma vez.',
  'Pratique explicar as respostas com suas próprias palavras.',
  'Use versículos bíblicos relevantes — a Palavra tem poder.',
  'Seja humilde — não é sobre "vencer" debates, mas sobre compartilhar a verdade com amor.',
  'Reconheça quando não souber algo — é melhor dizer "não sei, mas vou pesquisar" do que inventar.',
  'Foque nas evidências da ressurreição — é o ponto central do cristianismo.',
  'Lembre-se: o objetivo é glorificar a Deus e ajudar pessoas, não provar que você é inteligente.',
];
