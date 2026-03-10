/**
 * App principal - Alpine.js SPA, roteamento por hash, PWA mobile-first
 */
import { supabase } from './config/supabase.js';
import { obterUsuarioAtual, entrar, sair, cadastrar, onMudancaAuth } from './servicos/autenticacao.js';
import {
  obterPerfil,
  criarOuAtualizarPerfilCompleto,
  obterNivel,
  garantirNivelInicial,
  obterMoeda,
  garantirMoedaInicial,
  registrarAceiteTermos
} from './servicos/perfil.js';
import { listarInventario, listarEfeitosAtivos, usarItem, equiparItem } from './servicos/inventario.js';
import { listarModelosMissoes, listarMissoesAtivas, listarTodasMissoes, obterMetricasMissoes, iniciarMissao, concluirMissao, desistirMissao } from './servicos/missoes.js';
import { obterCapitulo } from './api/apiBiblia.js';
import { montarUrlAvataaars, CONFIG_AVATAR_PADRAO } from './api/apiAvataaars.js';
import { LIVROS_BIBLIA, GRUPOS_BIBLIA, ORDEM_CRONOLOGICA, obterLivrosAntigoTestamento, obterLivrosNovoTestamento } from './dados/livrosBiblia.js';
import { OPCOES_AVATAAARS, BACKGROUNDS_AVATAR } from './dados/opcoesAvataaars.js';
import {
  salvarProgresso,
  obterProgressoUsuario,
  resetarProgressoLivro,
  obterLivrosAprovadosQuiz,
  registrarAprovacaoQuizLivro
} from './servicos/leituraBiblia.js';
import { registrarAcao } from './servicos/acoesJogador.js';
import { listarItensLoja, comprarItem as comprarItemLoja } from './servicos/loja.js';
import { formatarTempoRestante } from './componentes/hud.js';
import { VERSAO_TERMOS } from './dados/constantes.js';
import { TRILHAS_ESTUDO, ARMADURA_DEUS_SLOTS, ARMADURA_EFEITOS, SLOTS_PERMANENTES, REFS_BIBLICAS, OBRAS_DA_CARNE, FRUTO_DO_ESPIRITO, BATALHA_ESPIRITUAL, TOOLTIPS_FRUTO, TOOLTIPS_OBRA } from './dados/estudoEvangelho.js';
import { CATEGORIAS_APOLOGETICA, PERGUNTAS_APOLOGETICA, DICAS_ESTUDO } from './dados/apologetica.js';

function rotaAtual() {
  return (window.location.hash || '#login').replace('#', '');
}

document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    usuario: null,
    perfil: null,
    nivel: null,
    moeda: null,
    coracoes: { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 },
    efeitosAtivos: [],
    inventario: [],
    viewInventario: 'equipamentos',
    missoesAtivas: [],
    modelosMissoes: [],
    todasMissoes: [],
    _demoTodasMissoes: [],
    missoesFiltradas: [],
    modelosMissoesFiltrados: [],
    metricasMissoes: null,
    filtroMissaoStatus: null,
    filtroMissaoTipo: null,
    mostrarFiltroTipo: false,
    paginaMissoes: 1,
    limiteMissoes: 10,
    totalMissoes: 0,
    modalDetalhesMissao: { aberto: false, missao: null },
    pagina: 'login',
    carregando: true,
    erro: '',
    sucesso: '',
    modoDemo: false,

    // Login
    emailLogin: '',
    senhaLogin: '',

    // Cadastro
    passoCadastro: 0,
    aceiteTermos: false,
    nomeCadastro: '',
    sobrenomeCadastro: '',
    dataNascimentoCadastro: '',
    emailCadastro: '',
    senhaCadastro: '',
    senhaMostrar: false,        // toggle visibilidade da senha no cadastro
    estadoCivilCadastro: '',
    configAvatarCadastro: { ...CONFIG_AVATAR_PADRAO },
    opcoesAvataaars: OPCOES_AVATAAARS,
    backgroundsAvatar: BACKGROUNDS_AVATAR,

    // Editar perfil
    viewPerfil: 'ver',          // 'ver' | 'editar'
    abaEditarPerfil: 'dados',   // 'dados' | 'personagem'
    perfilEditando: null,
    configAvatarEditando: null,

    // Leitura Bíblia
    livroSelecionado: 'JHN',
    capituloSelecionado: 1,
    capituloBiblia: null,
    carregandoCapitulo: false,
    progressoLeitura: [],
    livrosAprovadosQuiz: [],
    viewBiblia: 'livros',
    gridOuListaBiblia: 'grid',
    livroSelecionadoParaCapitulos: null,
    abaTestamentoBiblia: 'AT',       // 'AT' | 'NT'
    filtroBiblia: '',                // busca reativa de livro
    filtroCategoriaBiblia: 'canonico', // filtro/ordem ativa (ver GRUPOS_BIBLIA)
    traducaoBiblia: 'arib',          // tradução ativa ('arib' | 'livre' | 'aa')
    dropdownTraducaoAberto: false,   // estado do dropdown customizado de tradução
    traducoesBiblia: [
      { valor: 'arib',  label: 'ARIB', nome: 'Almeida Imprensa Bíblica'  },
      { valor: 'livre', label: 'BL',   nome: 'Bíblia Livre'              },
      { valor: 'aa',    label: 'AC',   nome: 'Almeida Clássica'          },
    ],
    // Quiz do livro (estado da tela de quiz)
    quizLivroAtivo: null,
    quizTipo: null,
    quizPerguntas: [],
    quizRespostas: {},
    quizEnviado: false,
    quizNota: null,
    quizPerguntaAtual: 0, // Índice da pergunta atual
    quizRespostaSelecionada: null, // Resposta selecionada na pergunta atual
    quizFeedback: null, // 'correto' | 'errado' | null
    quizAcertos: 0,
    quizErros: 0,
    progressoLeituraScroll: 0,
    _timeoutSalvarScroll: null,
    notacoesCapitulo: [],
    corMarcadorAtiva: null,
    modoNota: false,
    mostrarCoresMarcador: false,
    _longPressTimer: null,
    _longPressAcionado: false,
    notaPopup: { aberto: false, id: null, conteudo: '', textoRef: '', corFundo: '#fef08a' },
    bibleContextMenu: { aberto: false, x: 0, y: 0, pendente: null, modoSheet: true },
    // Seleção customizada com pinos arrastáveis
    bibleSelecaoCustom: {
      ativo: false,
      // Endpoints armazenados INDEPENDENTEMENTE do estado do browser
      // → mover pin D nunca precisa consultar o estado do pin E, e vice-versa
      sNode: null, sOff: 0,  // nó/offset do início (pin E)
      eNode: null, eOff: 0,  // nó/offset do fim    (pin D)
      pinE: { x: 0, y: 0, h: 20 },
      pinD: { x: 0, y: 0, h: 20 },
      arrastando: null,  // 'E' | 'D' | null
    },
    // Preferências de leitura (persistidas)
    fonteTamanhoBiblia: parseFloat(localStorage.getItem('biblia_fonte') || '1.0'),
    velocidadeNarracao: parseFloat(localStorage.getItem('biblia_velocidade') || '1.0'),
    _narracaoIdx: 0,
    narrando: false,

    CORES_MARCADOR: [
      { nome: 'Amarelo', valor: '#fef08a' },
      { nome: 'Laranja', valor: '#fdba74' },
      { nome: 'Verde', valor: '#bbf7d0' },
      { nome: 'Azul', valor: '#bfdbfe' }
    ],

    // ══════════════════════════════════════════
    // HARPA CRISTÃ
    // ══════════════════════════════════════════
    viewHarpa: 'lista',           // 'lista' | 'hino'
    hinoSelecionado: null,
    harpaHinos: [],               // 640 hinos carregados da API
    harpaCarregando: false,
    harpaErro: null,
    harpaBusca: '',
    harpaPagina: 0,
    HARPA_POR_PAGINA: 50,
    modoHarpa: false,             // true quando lendo hino (reutiliza infra de notações)
    harpaPlayerAberto: false,     // toggle do player de música
    // Player de áudio Deezer
    harpaAudio: null,             // HTMLAudioElement atual
    harpaAudioUrl: null,          // URL da prévia MP3
    harpaAudioNome: '',           // título da faixa encontrada
    harpaAudioCarregando: false,
    harpaAudioTocando: false,
    harpaAudioProgresso: 0,       // 0-100
    harpaAudioTempo: 0,
    harpaAudioDuracao: 30,

    // Ranking
    ranking: [],
    // Loja / Inventário
    itensLoja: [],
    filtroLoja: null,
    viewLoja: 'grid',
    modalItemDetalhes: false,
    itemSelecionado: null,
    // Modal de item no inventário (equip / vender / trocar)
    inventarioItemModal: { aberto: false, linha: null },
    // Press / "quase drag" de itens do inventário (para mobile)
    dragInventario: {
      timer: null,
      ativo: false,
      itemId: null,
    },

    // ─── Requisitos de acesso por seção ──────────────────────
    // Cada página pode exigir um item equipado no inventário.
    // item_id: chave usada em inventario[].item_id
    REQUISITOS_PAGINAS: {
      'leitura-biblia': { item_id: 'item-biblia', nome: 'Bíblia Sagrada',     icone: 'bi-book-fill',           dica: 'A Palavra de Deus como lampada aos seus pés (Sl 119.105).' },
      'estudo':         { item_id: 'item-espada', nome: 'Espada do Espírito', icone: 'bi-sword',               dica: 'A Palavra de Deus como arma ofensiva (Ef 6.17).' },
      'harpa':          { item_id: 'item-harpa',  nome: 'Harpa Cristã',       icone: 'bi-music-note-beamed',   dica: 'Cantai ao Senhor um cântico novo (Sl 96.1).' },
    },
    // Modal quando seção está bloqueada
    modalBloqueio: { aberto: false, rota: null, req: null },

    // ── ADMIN ───────────────────────────────────────────────────────────────
    modoAdmin: false,
    adminSenha: '',                    // senha digitada no modal
    adminSenhaErro: '',                // mensagem de erro
    adminAutenticado: false,           // flag de autenticação
    adminSecao: 'dashboard',
    adminBusca: '',
    adminModal: { aberto: false, modo: 'add', tipo: null, dados: {}, campos: [] },
    adminDelConfirm: { aberto: false, tipo: null, id: null, nome: '' },
    adminImportErro: '',

    // ── EXCLUIR CONTA ────────────────────────────────────────────────────────
    modalExcluirConta: { aberto: false },

    // ── CONFIRMAÇÃO UNIVERSAL ─────────────────────────────────────────────────
    modalConfirm: {
      aberto: false,
      titulo: '',
      msg: '',
      detalhe: '',         // linha extra opcional (ex: "Item: Espada do Espírito")
      tipo: 'perigo',      // 'perigo' | 'aviso' | 'info' | 'sucesso'
      icone: 'bi-question-circle-fill',
      labelOk: 'Confirmar',
      labelCancelar: 'Cancelar',
      _acao: null,
    },

    // ── FEED / COMUNIDADE ───────────────────────────────────────────────────
    feedPosts: [],
    feedCarregando: false,
    feedModalAberto: false,

    // Rascunho do novo devocional
    feedRascunho: {
      texto: '',
      versiculos: [],           // [{ label:'Jo 3.16', livro:'JHN', cap:3, ver:16 }]
    },
    // Seletor de versículo no modal
    feedVersSel: { livro: '', cap: 1, ver: 1 },
    // Comentários abertos: postId → true
    feedComentariosAbertos: {},
    // Texto de novo comentário por postId
    feedNovoComentario: {},

    // ── CONQUISTAS TOAST ────────────────────────────────────────────────────
    toastConquista: null,
    conquistasNotificadas: [],

    // ── APOLOGÉTICA ────────────────────────────────────────────────────────
    apolCategoriaSelecionada: null,        // null = todas, ou id da categoria
    apolBusca: '',                        // busca de texto
    apolPerguntaAberta: null,             // id da pergunta expandida
    apolPerguntasEstudadas: [],           // IDs das perguntas já estudadas (localStorage)
    apolProgresso: {},                    // { categoriaId: { total: X, estudadas: Y } }

    // ── AMIGOS / COMUNIDADE ────────────────────────────────────────────────
    amigos: [],                           // Lista de amigos
    amigosCarregando: false,
    amigosBusca: '',                      // Busca de amigos
    convitesPendentes: [],                // Convites recebidos
    convitesEnviados: [],                 // Convites enviados
    chatAberto: null,                     // ID do amigo com chat aberto
    chatMensagens: {},                    // { amigoId: [mensagens] }
    chatNovaMensagem: '',                 // Texto da nova mensagem
    chatRapidoAberto: false,             // Chat rápido (flutuante)
    chatRapidoAmigo: null,               // Amigo no chat rápido
    modalConvidarMissao: { aberto: false, missao: null, amigosSelecionados: [] },

    // Estudo do evangelho
    TRILHAS_ESTUDO,
    ARMADURA_DEUS_SLOTS,
    ARMADURA_EFEITOS,
    SLOTS_PERMANENTES,
    REFS_BIBLICAS,
    OBRAS_DA_CARNE,
    FRUTO_DO_ESPIRITO,
    BATALHA_ESPIRITUAL,
    TOOLTIPS_FRUTO,
    TOOLTIPS_OBRA,
    // Modal tooltip — item individual
    tooltipEsp: { aberto: false, tipo: null, dados: null },
    // Modal "Saiba mais" — lista completa de frutos ou obras
    infoListEsp: { aberto: false, tipo: null, expandido: null },

    // Estado de zoom/pan para Obras da Carne e Fruto do Espírito
    obrasZoom: { scale: 1, tx: 0, ty: 0, dragging: false, startX: 0, startY: 0 },
    frutoZoom: { scale: 1, tx: 0, ty: 0, dragging: false, startX: 0, startY: 0 },
    viewEstudo: 'trilhas',
    trilhaSelecionadaEstudo: null,
    aulaSelecionadaEstudo: null,
    progressoEstudo: {}, // { [aulaId]: { concluido, quizAprovado }, modulos: { [trilhaId]: true } }
    aulaAtualMarcadaLida: false, // estado reativo do botão toggle (sincronizado ao abrir e ao marcar/desmarcar)
    modoAulaEstudo: false, // true quando a tela de aula está ativa (reutiliza infra da Bíblia)
    quizEstudoTipo: 'aula', // 'aula' | 'modulo'
    quizEstudoPerguntas: [],
    quizEstudoRespostas: {},
    quizEstudoEnviado: false,
    quizEstudoNota: null,
    quizEstudoPerguntaAtual: 0, // Índice da pergunta atual
    quizEstudoRespostaSelecionada: null, // Resposta selecionada na pergunta atual
    quizEstudoFeedback: null, // 'correto' | 'errado' | null
    quizEstudoAcertos: 0,
    quizEstudoErros: 0,

    temaSalvo: 'claro',
    tempoAtual: Date.now(),
    _tempoContador: 0,
    init() {
      this.temaSalvo = localStorage.getItem('tema') || 'claro';
      this.aplicarTema(this.temaSalvo);
      this.atualizarPagina();
      window.addEventListener('hashchange', () => this.atualizarPagina());
      
      // Verificar regeneração de corações a cada minuto
      setInterval(() => {
        this.verificarRegeneracaoCoracoes();
      }, 60000); // 1 minuto
      
      // Carregar corações do localStorage no modo demo
      if (this.modoDemo) {
        const coracoesSalvos = localStorage.getItem('demo_coracoes');
        if (coracoesSalvos) {
          try {
            this.coracoes = JSON.parse(coracoesSalvos);
            this.verificarRegeneracaoCoracoes();
          } catch (e) {
            console.error('Erro ao carregar corações:', e);
          }
        }
      }
      
      // Timer será inicializado via x-init em cada elemento
      
      onMudancaAuth(async (evento, sessao) => {
        this.usuario = sessao?.user || null;
        if (this.usuario) {
          await this.carregarDadosUsuario();
        } else {
          this.perfil = null;
          this.nivel = null;
          this.moeda = null;
          this.efeitosAtivos = [];
          this.inventario = [];
          this.missoesAtivas = [];
        }
        this.carregando = false;
      });
      obterUsuarioAtual().then(async (u) => {
        this.usuario = u;
        if (u) {
          try {
            await this.carregarDadosUsuario();
          } catch (e) {
            console.error('Erro ao carregar dados do usuário:', e);
          }
        }
        this.carregando = false;
      }).catch((e) => {
        console.error('Erro ao obter usuário:', e);
        this.carregando = false;
      });
    },

    // ─────────────────────────────────────────────────────────────────
    // Controle de acesso por item equipado
    // ─────────────────────────────────────────────────────────────────

    /** Verifica se algum item com o item_id informado está equipado */
    temItemEquipado(itemId) {
      return this.inventario.some(l => l.item_id === itemId && l.equipado);
    },

    /** Retorna true se o usuário tem acesso à página (sem restrição ou item equipado) */
    temAcesso(rota) {
      const req = this.REQUISITOS_PAGINAS[rota];
      if (!req) return true;
      return this.temItemEquipado(req.item_id);
    },

    /**
     * Tenta navegar para uma rota.
     * Se a rota exige item não equipado, abre o modal de bloqueio.
     * Usado pelos atalhos da home e navbar.
     */
    tentarNavegar(rota) {
      if (this.temAcesso(rota)) {
        window.location.hash = rota;
      } else {
        const req = this.REQUISITOS_PAGINAS[rota];
        this.modalBloqueio = { aberto: true, rota, req };
      }
    },

    fecharModalBloqueio() {
      this.modalBloqueio.aberto = false;
    },

    atualizarPagina() {
      const r = rotaAtual();
      if (r === 'login' || r === 'cadastro') {
        this.pagina = r;
        return;
      }
      if (!this.usuario && r !== 'termos' && r !== 'sobre' && r !== 'doacoes') {
        window.location.hash = 'login';
        return;
      }
      // Guarda: admin — resetar autenticação ao sair da página
      if (r !== 'admin' && this.adminAutenticado) {
        this.adminAutenticado = false;
        this.adminSenha = '';
        this.adminSenhaErro = '';
      }
      // Se tentar acessar admin, verificar autenticação (não redireciona, mostra modal)
      if (r === 'admin' && this.usuario && !this.adminAutenticado && !this.isAdmin()) {
        // Permanece na página para mostrar modal de autenticação
        return;
      }
      // Carregar feed ao navegar para a página de feed
      if (r === 'feed' && this.usuario) {
        this.carregarFeed();
      }
      // Carregar progresso de apologética
      if (r === 'apologetica' && this.usuario) {
        this.carregarProgressoApologetica();
      }
      // Carregar amigos
      if (r === 'amigos' && this.usuario) {
        this.carregarAmigos();
      }
      // Guarda de acesso: se a página requer item e ele não está equipado
      if (this.usuario && !this.temAcesso(r)) {
        const req = this.REQUISITOS_PAGINAS[r];
        this.modalBloqueio = { aberto: true, rota: r, req };
        // Redireciona para home silenciosamente
        history.replaceState(null, '', '#home');
        this.pagina = 'home';
        return;
      }
      this.pagina = r;

      // ── Limpar seleção/contexto da Bíblia ao trocar de tela ──────────────
      this.bibleSelecaoCustom.ativo = false;
      this.bibleContextMenu.aberto  = false;
      this.bibleContextMenu.pendente = null;
      if (window.getSelection) window.getSelection().removeAllRanges();

      if (r === 'estudo') {
        this.viewEstudo = 'trilhas';
        this.trilhaSelecionadaEstudo = null;
        this.aulaSelecionadaEstudo = null;
        this.quizEstudoEnviado = false;
        this.quizEstudoNota = null;
        this.carregarProgressoEstudoDemo();
      }
      if (r === 'harpa') {
        if (this.harpaHinos.length === 0 && !this.harpaCarregando) {
          this.carregarHinos();
        }
      } else {
        // Ao sair da harpa, reseta modo e para narração
        if (this.modoHarpa) {
          this.pararNarracao();
          this.modoHarpa = false;
        }
      }
      if (this.usuario && (r === 'home' || r === 'inventario' || r === 'missoes')) {
        this.carregarDadosUsuario();
      }
      if (r === 'inventario') {
        if (this.viewInventario === 'fruto') {
          setTimeout(() => this.renderizarFrutosSVG(), 100);
        } else if (this.viewInventario === 'obras') {
          setTimeout(() => this.renderizarObrasSVG(), 100);
        }
      }
      if (r === 'missoes' && this.usuario) {
        if (this.modoDemo) {
          // FORÇAR: Garantir que todasMissoes está carregado antes de filtrar
          if (!this.todasMissoes || this.todasMissoes.length === 0) {
            // Tentar usar missoesAtivas como fallback
            if (this.missoesAtivas && this.missoesAtivas.length > 0) {
              this.todasMissoes = this.missoesAtivas;
            }
          }
          this.atualizarFiltrosMissoes();
        } else {
          this.carregarMissoes();
        }
      }
      if (r === 'leitura-biblia' && this.usuario) this.carregarProgressoLeitura();
      if (r === 'ranking' && !this.modoDemo) this.carregarRanking();
      if (r === 'loja' && this.usuario && !this.modoDemo) this.carregarLoja();
    },

    async carregarDadosUsuario() {
      if (!this.usuario || this.modoDemo) return;
      const id = this.usuario.id;
      this.perfil = await obterPerfil(id);
      await garantirNivelInicial(id);
      await garantirMoedaInicial(id);
      this.nivel = await obterNivel(id);
      this.moeda = await obterMoeda(id);
      this.efeitosAtivos = await listarEfeitosAtivos(id);
      this.inventario = await listarInventario(id);
      this.missoesAtivas = await listarMissoesAtivas(id);
      if (this.pagina === 'missoes') {
        await this.carregarMissoes();
      }
    },

    async carregarProgressoLeitura() {
      if (!this.usuario) return;
      if (this.modoDemo) {
        this.progressoLeitura = this.obterProgressoLeituraDemo();
        this.livrosAprovadosQuiz = [];
        return;
      }
      this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
      this.livrosAprovadosQuiz = await obterLivrosAprovadosQuiz(this.usuario.id);
    },

    CHAVE_PROGRESSO_DEMO: 'progressoLeitura_demo',

    obterProgressoLeituraDemo() {
      try {
        const raw = localStorage.getItem(this.CHAVE_PROGRESSO_DEMO);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    salvarProgressoLeituraDemo() {
      try {
        localStorage.setItem(this.CHAVE_PROGRESSO_DEMO, JSON.stringify(this.progressoLeitura));
      } catch (e) {
        console.error(e);
      }
    },

    // ══════════════════════════════════════════════════════════
    // HARPA CRISTÃ — funções
    // ══════════════════════════════════════════════════════════
    async carregarHinos() {
      if (this.harpaCarregando) return;
      this.harpaCarregando = true;
      this.harpaErro = null;
      try {
        const url = 'https://raw.githubusercontent.com/DanielLiberato/Harpa-Crista-JSON-640-Hinos-Completa/main/harpa_crista_640_hinos.json';
        const r = await fetch(url);
        if (!r.ok) throw new Error('Falha ao carregar hinos (HTTP ' + r.status + ')');
        const raw = await r.json();
        // Normaliza: transforma o objeto indexado em array ordenado
        const lista = [];
        for (const key of Object.keys(raw)) {
          if (key === '-1') continue; // metadado do autor
          const h = raw[key];
          const num = parseInt(key, 10);
          // Título: remove "N - " do campo "hino" se existir
          const titulo = (h.hino || '').replace(/^\d+\s*-\s*/, '').trim();
          // Estrofes: extrai do objeto "verses" na ordem numérica
          const estrofes = Object.keys(h.verses || {})
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (h.verses[k] || '').replace(/<br\s*\/?>/gi, '\n').trim());
          // Coro
          const coro = (h.coro || '').replace(/<br\s*\/?>/gi, '\n').trim();
          lista.push({ numero: num, titulo, coro, estrofes });
        }
        lista.sort((a, b) => a.numero - b.numero);
        this.harpaHinos = lista;
      } catch (e) {
        console.error('[Harpa]', e);
        this.harpaErro = 'Não foi possível carregar os hinos. Verifique sua conexão.';
      } finally {
        this.harpaCarregando = false;
      }
    },

    abrirHino(hino) {
      this.pararNarracao();
      this.cancelarSelecaoBiblia();
      this._pararAudioHarpa();          // para áudio ao trocar de hino
      this.modoHarpa = true;
      this.modoAulaEstudo = false;
      this.harpaPlayerAberto = false;
      this.hinoSelecionado = hino;
      this.viewHarpa = 'hino';
      this.carregarNotacoesCapitulo();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    voltarListaHinos() {
      this.pararNarracao();
      this.cancelarSelecaoBiblia();
      this._pararAudioHarpa();
      this.modoHarpa = false;
      this.hinoSelecionado = null;
      this.viewHarpa = 'lista';
    },

    navegarHino(delta) {
      const idx = this.harpaHinos.findIndex((h) => h.numero === this.hinoSelecionado?.numero);
      if (idx === -1) return;
      const novo = this.harpaHinos[idx + delta];
      if (novo) this.abrirHino(novo);
    },

    // ─────────────────────────────────────────────────
    // Player de áudio — Deezer JSONP (prévia 30s MP3)
    // ─────────────────────────────────────────────────

    /** Abre/fecha o painel e busca áudio se ainda não buscou */
    togglePlayerHarpa() {
      this.harpaPlayerAberto = !this.harpaPlayerAberto;
      if (this.harpaPlayerAberto && !this.harpaAudioUrl && !this.harpaAudioCarregando) {
        this.buscarAudioDeezer(this.hinoSelecionado);
      }
    },

    /**
     * Busca prévia de 30s no Deezer via JSONP (sem API key).
     * Usa encadeamento de queries: "Harpa Cristã N Título" → "Harpa Cristã Título"
     */
    async buscarAudioDeezer(hino) {
      if (!hino) return;
      this.harpaAudioCarregando = true;
      this.harpaAudioUrl = null;
      this.harpaAudioNome = '';

      const tentativas = [
        `Harpa Cristã ${hino.numero} ${hino.titulo}`,
        `Harpa Cristã ${hino.titulo}`,
        `hino ${hino.titulo} gospel`,
      ];

      for (const query of tentativas) {
        const resultado = await this._fetchDeezerJsonp(query);
        if (resultado) {
          this.harpaAudioUrl = resultado.preview;
          this.harpaAudioNome = resultado.title;
          break;
        }
      }

      this.harpaAudioCarregando = false;
      if (this.harpaAudioUrl) {
        this._iniciarAudioHarpa();
      }
    },

    /** Fetch Deezer via JSONP — retorna { preview, title } ou null */
    _fetchDeezerJsonp(query) {
      return new Promise((resolve) => {
        const cb = '__dz_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
        const timeout = setTimeout(() => {
          delete window[cb];
          s.remove();
          resolve(null);
        }, 7000);

        window[cb] = (data) => {
          clearTimeout(timeout);
          delete window[cb];
          s.remove();
          // Pega primeira faixa que tenha prévia (preview URL)
          const faixa = (data?.data || []).find((f) => f.preview);
          resolve(faixa ? { preview: faixa.preview, title: faixa.title_short || faixa.title } : null);
        };

        const s = document.createElement('script');
        s.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5&output=jsonp&callback=${cb}`;
        s.onerror = () => { clearTimeout(timeout); delete window[cb]; resolve(null); };
        document.head.appendChild(s);
      });
    },

    /** Cria e inicia o HTMLAudioElement com eventos reativos */
    _iniciarAudioHarpa() {
      this._pararAudioHarpa();
      const audio = new Audio(this.harpaAudioUrl);
      audio.crossOrigin = 'anonymous';

      audio.addEventListener('timeupdate', () => {
        this.harpaAudioTempo    = audio.currentTime;
        this.harpaAudioDuracao  = isFinite(audio.duration) ? audio.duration : 30;
        this.harpaAudioProgresso = (audio.currentTime / this.harpaAudioDuracao) * 100;
      });
      audio.addEventListener('ended',   () => { this.harpaAudioTocando = false; });
      audio.addEventListener('pause',   () => { this.harpaAudioTocando = false; });
      audio.addEventListener('playing', () => { this.harpaAudioTocando = true;  });
      audio.addEventListener('error',   () => {
        this.harpaAudioTocando = false;
        this.harpaAudioUrl = null; // mostra "não encontrado"
      });

      this.harpaAudio = audio;
      audio.play().catch(() => { /* autoplay bloqueado — usuário clica manualmente */ });
    },

    /** Para e libera o áudio atual */
    _pararAudioHarpa() {
      if (this.harpaAudio) {
        this.harpaAudio.pause();
        this.harpaAudio.src = '';
        this.harpaAudio = null;
      }
      this.harpaAudioTocando   = false;
      this.harpaAudioProgresso = 0;
      this.harpaAudioTempo     = 0;
      this.harpaAudioDuracao   = 30;
    },

    toggleAudioHarpa() {
      if (!this.harpaAudio) return;
      if (this.harpaAudioTocando) {
        this.harpaAudio.pause();
      } else {
        this.harpaAudio.play().catch(() => {});
      }
    },

    seekAudioHarpa(e) {
      if (!this.harpaAudio) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.harpaAudio.currentTime = pct * (this.harpaAudio.duration || 30);
    },

    formatarTempoHarpa(seg) {
      if (!seg || !isFinite(seg)) return '0:00';
      const m = Math.floor(seg / 60);
      const s = Math.floor(seg % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    },

    // ─────────────────────────────────────────────────
    // Narração do hino — ordem correta: estrofe → coro → estrofe → coro
    // ─────────────────────────────────────────────────
    narrarHino() {
      if (!this.hinoSelecionado) return;
      const partes = [];
      (this.hinoSelecionado.estrofes || []).forEach((letra, i) => {
        partes.push(`Estrofe ${i + 1}: ${letra}`);
        if (this.hinoSelecionado.coro) {
          partes.push(`Coro: ${this.hinoSelecionado.coro}`);
        }
      });
      // Se só tem coro (sem estrofes)
      if (!partes.length && this.hinoSelecionado.coro) {
        partes.push(`Coro: ${this.hinoSelecionado.coro}`);
      }
      this._narracaoTextos = partes;
      this._narracaoIdx = 0;
      this.narrando = true;
      this._narrarProximoHino();
    },

    _narrarProximoHino() {
      if (!this.narrando || this._narracaoIdx >= (this._narracaoTextos || []).length) {
        this.narrando = false;
        return;
      }
      const texto = this._narracaoTextos[this._narracaoIdx];
      const utt = new SpeechSynthesisUtterance(texto);
      utt.lang = 'pt-BR';
      utt.rate = this.velocidadeNarracao;
      utt.onend = () => {
        this._narracaoIdx++;
        this._narrarProximoHino();
      };
      utt.onerror = () => { this.narrando = false; };
      window.speechSynthesis.speak(utt);
    },

    async carregarRanking() {
      if (!supabase) return;
      const { data } = await supabase.from('ranking_usuarios').select('*').limit(50);
      this.ranking = data || [];
    },

    async carregarLoja() {
      this.itensLoja = await listarItensLoja();
    },

    // Computed para itens filtrados da loja
    get itensLojaFiltrados() {
      if (!this.filtroLoja) return this.itensLoja || [];
      return (this.itensLoja || []).filter(item => item.tipo === this.filtroLoja);
    },

    getRaridadeNome(raridade) {
      const nomes = {
        comum: 'Comum',
        raro: 'Raro',
        epico: 'Épico',
        lendario: 'Lendário'
      };
      return nomes[raridade] || 'Comum';
    },

    abrirDetalhesItem(item) {
      this.itemSelecionado = item;
      this.modalItemDetalhes = true;
    },

    fecharDetalhesItem() {
      this.modalItemDetalhes = false;
      this.itemSelecionado = null;
    },

    async comprarItem(item) {
      this.erro = '';
      if (this.modoDemo) {
        // No modo demo, simular compra e adicionar corações se for item de coração
        if (item.adiciona_coracoes) {
          if ((this.moeda?.ouro || 0) >= item.preco_ouro) {
            this.moeda.ouro -= item.preco_ouro;
            this.adicionarCoracoes(item.adiciona_coracoes);
            this.sucesso = `Compra realizada! Você ganhou ${item.adiciona_coracoes} coração(ões).`;
            setTimeout(() => (this.sucesso = ''), 3000);
          } else {
            this.erro = 'Ouro insuficiente!';
          }
        } else {
          this.sucesso = 'Modo demonstração: crie uma conta para comprar itens.';
          setTimeout(() => (this.sucesso = ''), 3000);
        }
        return;
      }
      const r = await comprarItemLoja(this.usuario.id, item.id, item.preco_ouro);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        this.carregarLoja();
        
        // Se o item adiciona corações, adicionar
        if (item.adiciona_coracoes) {
          this.adicionarCoracoes(item.adiciona_coracoes);
        }
        
        this.sucesso = 'Compra realizada!';
        setTimeout(() => (this.sucesso = ''), 2000);
      } else {
        this.erro = r.erro || '';
      }
    },

    CHAVE_PROGRESSO_ESTUDO: 'progressoEstudo_demo',

    totalAulasEstudo() {
      return this.TRILHAS_ESTUDO.reduce((s, t) => s + (t.aulas?.length || 0), 0);
    },
    aulasCompletasEstudo() {
      let n = 0;
      this.TRILHAS_ESTUDO.forEach((trilha) => {
        (trilha.aulas || []).forEach((aula) => {
          const p = this.progressoEstudo[aula.id];
          const concluido = p?.concluido;
          const temQuiz = (aula.quiz?.length || 0) > 0;
          const quizOk = !temQuiz || p?.quizAprovado;
          if (concluido && quizOk) n++;
        });
      });
      return n;
    },
    percentualProgressoEstudo() {
      const total = this.totalAulasEstudo();
      return total ? Math.round((this.aulasCompletasEstudo() / total) * 100) : 0;
    },
    aulaConcluidaEstudo(aulaId) {
      return !!this.progressoEstudo[aulaId]?.concluido;
    },
    aulaQuizAprovadoEstudo(aulaId) {
      return !!this.progressoEstudo[aulaId]?.quizAprovado;
    },
    aulaTemQuiz(aula) {
      return (aula?.quiz?.length || 0) > 0;
    },
    aulaCompletaEstudo(aula) {
      const p = this.progressoEstudo[aula?.id];
      if (!p?.concluido) return false;
      return !this.aulaTemQuiz(aula) || p?.quizAprovado;
    },
    aulasCompletasNaTrilha(trilha) {
      if (!trilha?.aulas?.length) return 0;
      return trilha.aulas.filter((a) => this.aulaCompletaEstudo(a)).length;
    },
    totalAulasNaTrilha(trilha) {
      return trilha?.aulas?.length || 0;
    },
    percentualTrilhaEstudo(trilha) {
      const total = this.totalAulasNaTrilha(trilha);
      return total ? Math.round((this.aulasCompletasNaTrilha(trilha) / total) * 100) : 0;
    },
    desmarcarLidaEstudo() {
      if (!this.aulaSelecionadaEstudo) return;
      const id = this.aulaSelecionadaEstudo.id;
      const atual = this.progressoEstudo[id] || {};
      this.progressoEstudo = { ...this.progressoEstudo, [id]: { ...atual, concluido: false } };
      this.aulaAtualMarcadaLida = false;
      this.salvarProgressoEstudoDemo();
    },
    toggleLidaEstudo() {
      if (!this.aulaSelecionadaEstudo) return;
      if (this.aulaAtualMarcadaLida) {
        this.desmarcarLidaEstudo();
      } else {
        this.marcarConcluidoEstudo();
      }
    },
    carregarProgressoEstudoDemo() {
      try {
        const key = this.modoDemo ? this.CHAVE_PROGRESSO_ESTUDO : 'progressoEstudo_' + (this.usuario?.id || '');
        const raw = localStorage.getItem(key);
        this.progressoEstudo = raw ? JSON.parse(raw) : {};
        if (!this.progressoEstudo.modulos) this.progressoEstudo.modulos = {};
      } catch {
        this.progressoEstudo = { modulos: {} };
      }
    },
    salvarProgressoEstudoDemo() {
      try {
        const key = this.modoDemo ? this.CHAVE_PROGRESSO_ESTUDO : 'progressoEstudo_' + (this.usuario?.id || '');
        localStorage.setItem(key, JSON.stringify(this.progressoEstudo));
      } catch (e) {
        console.error(e);
      }
    },
    marcarConcluidoEstudo() {
      if (!this.aulaSelecionadaEstudo) return;
      const id = this.aulaSelecionadaEstudo.id;
      const atual = this.progressoEstudo[id] || {};
      this.progressoEstudo = { ...this.progressoEstudo, [id]: { ...atual, concluido: true } };
      this.aulaAtualMarcadaLida = true;
      this.salvarProgressoEstudoDemo();
      this.sucesso = 'Aula marcada como lida.';
      setTimeout(() => (this.sucesso = ''), 2500);
    },
    proximaAulaEstudo() {
      if (!this.trilhaSelecionadaEstudo?.aulas?.length || !this.aulaSelecionadaEstudo) return null;
      const idx = this.trilhaSelecionadaEstudo.aulas.findIndex((a) => a.id === this.aulaSelecionadaEstudo.id);
      return this.trilhaSelecionadaEstudo.aulas[idx + 1] || null;
    },
    irParaProximaAulaEstudo() {
      const next = this.proximaAulaEstudo();
      if (next) this.selecionarAulaEstudo(next);
    },
    iniciarQuizEstudo() {
      if (!this.aulaSelecionadaEstudo?.quiz?.length) return;
      this.pararNarracao();
      this.modoAulaEstudo = false;
      this.bibleContextMenu.aberto = false;
      this.quizEstudoTipo = 'aula';
      this.quizEstudoPerguntas = this.aulaSelecionadaEstudo.quiz;
      this.quizEstudoRespostas = {};
      this.quizEstudoEnviado = false;
      this.quizEstudoNota = null;
      this.viewEstudo = 'quiz';
    },
    iniciarQuizModuloEstudo() {
      if (!this.trilhaSelecionadaEstudo?.quizModulo?.length) return;
      this.quizEstudoTipo = 'modulo';
      this.quizEstudoPerguntas = this.trilhaSelecionadaEstudo.quizModulo;
      this.quizEstudoRespostas = {};
      this.quizEstudoEnviado = false;
      this.quizEstudoNota = null;
      this.viewEstudo = 'quiz';
    },
    moduloAprovadoEstudo(trilhaId) {
      return !!(this.progressoEstudo.modulos && this.progressoEstudo.modulos[trilhaId]);
    },
    trilhaTemQuizModulo(trilha) {
      return (trilha?.quizModulo?.length || 0) > 0;
    },
    // Selecionar resposta no quiz de estudo (feedback imediato)
    selecionarRespostaQuizEstudo(respostaIndex) {
      if (this.quizEstudoFeedback !== null) return; // Já respondeu esta pergunta
      
      const pergunta = this.quizEstudoPerguntas[this.quizEstudoPerguntaAtual];
      const correta = Number(respostaIndex) === pergunta.correta;
      
      this.quizEstudoRespostaSelecionada = respostaIndex;
      this.quizEstudoRespostas[this.quizEstudoPerguntaAtual] = respostaIndex;
      
      if (correta) {
        this.quizEstudoFeedback = 'correto';
        this.quizEstudoAcertos++;
        this.tocarSomSucesso();
      } else {
        this.quizEstudoFeedback = 'errado';
        this.quizEstudoErros++;
        this.consumirCoracaoComBônus(); // usa bônus do Escudo da Fé se equipado
        this.tocarSomErro();
      }
      
      // Avançar para próxima pergunta após 1.5 segundos
      setTimeout(() => {
        this.proximaPerguntaQuizEstudo();
      }, 1500);
    },
    
    // Avançar para próxima pergunta no quiz de estudo
    proximaPerguntaQuizEstudo() {
      if (this.quizEstudoPerguntaAtual < this.quizEstudoPerguntas.length - 1) {
        this.quizEstudoPerguntaAtual++;
        this.quizEstudoRespostaSelecionada = null;
        this.quizEstudoFeedback = null;
      } else {
        // Finalizar quiz
        this.finalizarQuizEstudo();
      }
    },
    
    // Finalizar quiz de estudo
    finalizarQuizEstudo() {
      const total = this.quizEstudoPerguntas.length;
      this.quizEstudoNota = total ? Math.round((this.quizEstudoAcertos / total) * 100) : 0;
      this.quizEstudoEnviado = true;
      const aprovado = this.quizEstudoNota >= 70;
      
      if (aprovado) {
        if (this.quizEstudoTipo === 'aula' && this.aulaSelecionadaEstudo) {
          const id = this.aulaSelecionadaEstudo.id;
          // Usar spread para garantir reatividade do Alpine.js
          this.progressoEstudo = {
            ...this.progressoEstudo,
            [id]: { ...(this.progressoEstudo[id] || {}), quizAprovado: true },
          };
        } else if (this.quizEstudoTipo === 'modulo' && this.trilhaSelecionadaEstudo) {
          const mods = { ...(this.progressoEstudo.modulos || {}), [this.trilhaSelecionadaEstudo.id]: true };
          this.progressoEstudo = { ...this.progressoEstudo, modulos: mods };
        }
        this.salvarProgressoEstudoDemo();
      }
    },
    
    submitQuizEstudo() {
      // Função antiga mantida para compatibilidade, mas não é mais usada
      this.finalizarQuizEstudo();
    },
    voltarQuizParaAula() {
      this.viewEstudo = this.quizEstudoTipo === 'modulo' ? 'aulas' : 'aula';
      this.quizEstudoEnviado = false;
      this.quizEstudoNota = null;
    },
    selecionarTrilhaEstudo(trilha) {
      this.trilhaSelecionadaEstudo = trilha;
      this.viewEstudo = 'aulas';
      this.aulaSelecionadaEstudo = null;
    },
    voltarEstudoTrilhas() {
      this.pararNarracao();
      this.modoAulaEstudo = false;
      this.bibleContextMenu.aberto = false;
      this.bibleSelecaoCustom.ativo = false;
      this.viewEstudo = 'trilhas';
      this.trilhaSelecionadaEstudo = null;
      this.aulaSelecionadaEstudo = null;
    },
    selecionarAulaEstudo(aula) {
      this.aulaSelecionadaEstudo = aula;
      this.aulaAtualMarcadaLida = !!(aula && this.progressoEstudo[aula.id]?.concluido);
      this.modoAulaEstudo = true;
      this.viewEstudo = 'aula';
      this.quizEstudoEnviado = false;
      this.quizEstudoNota = null;
      // Fechar qualquer menu de contexto aberto
      this.bibleContextMenu.aberto = false;
      this.bibleContextMenu.pendente = null;
      this.bibleSelecaoCustom.ativo = false;
      this.pararNarracao();
      // Carregar notações da aula na mesma variável usada pela Bíblia
      if (aula?.id) this.carregarNotacoesCapitulo();
    },
    voltarEstudoAulas() {
      this.pararNarracao();
      this.modoAulaEstudo = false;
      this.bibleContextMenu.aberto = false;
      this.bibleSelecaoCustom.ativo = false;
      this.viewEstudo = 'aulas';
      this.aulaSelecionadaEstudo = null;
    },

    async fazerLogin() {
      this.erro = '';
      const r = await entrar(this.emailLogin, this.senhaLogin);
      if (r.sucesso) {
        window.location.hash = 'home';
      } else {
        this.erro = r.erro || 'Erro ao entrar';
      }
    },

    async entrarModoDemo() {
      this.carregando = true;
      this.erro = '';
      try {
        const res = await fetch('assets/dados/demo.json');
        if (!res.ok) throw new Error('Demo não disponível');
        const dados = await res.json();
        this.modoDemo = true;
        this.usuario = { id: 'demo' };
        // Prioridade: localStorage (edições do usuário) > demo.json > fallback
        const perfilSalvo = (() => { try { const s = localStorage.getItem('demo_perfil'); return s ? JSON.parse(s) : null; } catch { return null; } })();
        this.perfil = perfilSalvo || dados.perfil || { nome: 'Demo', sobrenome: 'Usuário', config_avatar: {} };
        // Garantir config_avatar e bgAvatar padrão
        if (!this.perfil.config_avatar) this.perfil.config_avatar = {};
        if (!this.perfil.config_avatar.bgAvatar) this.perfil.config_avatar.bgAvatar = 'cinza';
        if (!this.perfil.config_avatar.avatarStyle) this.perfil.config_avatar.avatarStyle = 'Transparent';
        this.nivel = dados.nivel || { nivel: 1, xp_total: 50, dias_sequencia: 3 };
        this.moeda = dados.moeda || { ouro: 100 };
        this.coracoes = dados.coracoes || { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
        this.efeitosAtivos = dados.efeitosAtivos || [];
        // Prioridade: localStorage (equip/sell do usuário) > demo.json
        const inventarioSalvo = (() => { try { const s = localStorage.getItem('demo_inventario'); return s ? JSON.parse(s) : null; } catch { return null; } })();
        this.inventario = inventarioSalvo || dados.inventario || [];
        this.modelosMissoes = dados.modelosMissoes || [];
        this.itensLoja = dados.itensLoja || [];
        this.ranking = dados.ranking || [];
        this.progressoLeitura = [];
        this.livrosAprovadosQuiz = [];
        // Inicializar variáveis de missões
        this.todasMissoes = dados.todasMissoes || [];
        // Cópia profunda para que mutações de status (ex: expiração) não afetem a fonte dos filtros
        this._demoTodasMissoes = JSON.parse(JSON.stringify(dados.todasMissoes || []));
        this.missoesFiltradas = dados.todasMissoes || [];
        this.modelosMissoesFiltrados = dados.modelosMissoes || [];
        // Calcular missoesAtivas a partir de todasMissoes
        this.missoesAtivas = this.todasMissoes.filter(m => m.status === 'ativa') || [];
        // Calcular métricas reais (apenas missões, não modelos)
        const todas = this.todasMissoes || [];
        this.metricasMissoes = {
          total: todas.length,
          concluidas: todas.filter(m => m.status === 'concluida').length,
          ativas: todas.filter(m => m.status === 'ativa').length,
          abandonadas: todas.filter(m => m.status === 'abandonada').length,
          expiradas: todas.filter(m => m.status === 'expirada').length
        };
        this.totalMissoes = todas.length;
        
        // Carregar admin itens/missoes do localStorage se existirem
        const adminItens = (() => { try { const s = localStorage.getItem('admin_itens'); return s ? JSON.parse(s) : null; } catch { return null; } })();
        if (adminItens) this.itensLoja = adminItens;
        const adminMissoes = (() => { try { const s = localStorage.getItem('admin_missoes'); return s ? JSON.parse(s) : null; } catch { return null; } })();
        if (adminMissoes) this.modelosMissoes = adminMissoes;
        
        // Inicializar timers após carregar dados do demo
        setTimeout(() => {
          this.reinicializarTimersMissoes();
          this.verificarNovasConquistas();
          this.carregarFeed();
        }, 500);
      } catch (e) {
        this.erro = 'Não foi possível carregar os dados da demonstração.';
        return;
      } finally {
        this.carregando = false;
      }
      window.location.hash = 'home';
    },

    sair() {
      if (this.modoDemo) {
        this.modoDemo = false;
        this.usuario = null;
        this.perfil = null;
        this.nivel = null;
        this.moeda = null;
        this.inventario = [];
        localStorage.removeItem('demo_inventario');
        this.missoesAtivas = [];
        this.efeitosAtivos = [];
        this.modelosMissoes = [];
        this.itensLoja = [];
        this.ranking = [];
        window.location.hash = 'login';
        return;
      }
      sair();
      window.location.hash = 'login';
    },

    /**
     * Calcula a força da senha de cadastro.
     * Retorna { pct, label, classe } para uso no indicador visual.
     */
    forcaSenha() {
      const s = this.senhaCadastro;
      if (!s) return { pct: 0, label: '', classe: '' };
      let pts = 0;
      if (s.length >= 6)  pts++;
      if (s.length >= 10) pts++;
      if (/[A-Z]/.test(s)) pts++;
      if (/[0-9]/.test(s)) pts++;
      if (/[^A-Za-z0-9]/.test(s)) pts++;
      const mapa = [
        { pct: 20,  label: 'Muito fraca',  classe: 'forca-fraca'  },
        { pct: 40,  label: 'Fraca',        classe: 'forca-fraca'  },
        { pct: 60,  label: 'Regular',      classe: 'forca-media'  },
        { pct: 80,  label: 'Boa',          classe: 'forca-boa'    },
        { pct: 100, label: 'Muito forte ', classe: 'forca-forte' },
      ];
      return mapa[Math.min(pts - 1, 4)] || mapa[0];
    },

    avancarCadastro() {
      if (this.passoCadastro === 0 && !this.aceiteTermos) {
        this.erro = 'É necessário aceitar os Termos de Uso para continuar.';
        return;
      }
      if (this.passoCadastro === 1 && !this.nomeCadastro.trim()) {
        this.erro = 'Por favor, informe seu nome.';
        return;
      }
      if (this.passoCadastro === 3 && !(this.emailCadastro.includes('@') && this.emailCadastro.includes('.'))) {
        this.erro = 'Informe um e-mail válido.';
        return;
      }
      if (this.passoCadastro === 4 && this.senhaCadastro.length < 6) {
        this.erro = 'A senha deve ter pelo menos 6 caracteres.';
        return;
      }
      this.erro = '';
      if (this.passoCadastro < 6) {
        this.passoCadastro++;
        return;
      }
      this.finalizarCadastro();
    },

    voltarCadastro() {
      this.erro = '';
      this.senhaMostrar = false;
      if (this.passoCadastro > 0) this.passoCadastro--;
    },

    async finalizarCadastro() {
      this.erro = '';
      this.carregando = true;
      const r = await cadastrar(this.emailCadastro, this.senhaCadastro, {
        nome: this.nomeCadastro,
        sobrenome: this.sobrenomeCadastro
      });
      if (!r.sucesso) {
        this.erro = r.erro || 'Erro ao criar conta';
        this.carregando = false;
        return;
      }
      const agora = new Date().toISOString();
      await criarOuAtualizarPerfilCompleto(r.usuario.id, {
        nome: this.nomeCadastro,
        sobrenome: this.sobrenomeCadastro,
        dataNascimento: this.dataNascimentoCadastro || null,
        estadoCivil: this.estadoCivilCadastro || null,
        configAvatar: this.configAvatarCadastro,
        aceiteTermosEm: agora,
        versaoTermosAceitos: VERSAO_TERMOS
      });
      this.carregando = false;
      window.location.hash = 'home';
    },

    urlAvatar(config) {
      return montarUrlAvataaars(config || this.perfil?.config_avatar || {});
    },

    // ---- Editar Perfil (Demo) ----
    abrirEditarPerfil() {
      this.perfilEditando = {
        nome: this.perfil?.nome || '',
        sobrenome: this.perfil?.sobrenome || '',
        dataNascimento: this.perfil?.data_nascimento || '',
        estadoCivil: this.perfil?.estado_civil || '',
      };
      this.configAvatarEditando = { ...(this.perfil?.config_avatar || CONFIG_AVATAR_PADRAO) };
      this.abaEditarPerfil = 'dados';
      this.viewPerfil = 'editar';
    },
    cancelarEditarPerfil() {
      this.viewPerfil = 'ver';
      this.perfilEditando = null;
      this.configAvatarEditando = null;
    },
    salvarEditarPerfil() {
      if (!this.perfilEditando) return;
      this.perfil = {
        ...this.perfil,
        nome: this.perfilEditando.nome,
        sobrenome: this.perfilEditando.sobrenome,
        data_nascimento: this.perfilEditando.dataNascimento || null,
        estado_civil: this.perfilEditando.estadoCivil || null,
        config_avatar: { ...this.configAvatarEditando },
      };
      if (this.modoDemo) {
        try { localStorage.setItem('demo_perfil', JSON.stringify(this.perfil)); } catch(e) {}
      }
      this.viewPerfil = 'ver';
      this.sucesso = 'Perfil atualizado com sucesso!';
      setTimeout(() => (this.sucesso = ''), 3000);
    },
    urlAvatarEditando() {
      return montarUrlAvataaars(this.configAvatarEditando || this.perfil?.config_avatar || {});
    },
    // Gera URL do avatar com UM campo sobreposto — mantido por compatibilidade
    urlAvatarComOpcao(campo, valor) {
      if (!this.configAvatarEditando) return '';
      return montarUrlAvataaars({ ...this.configAvatarEditando, [campo]: valor });
    },
    // ── Backgrounds do avatar ──────────────────────────────────────────────
    // Calcula CSS de background a partir do valor salvo no config
    _cssBgDeValor(valor) {
      if (!valor || valor === 'nenhum') return '';
      const opt = BACKGROUNDS_AVATAR.find(b => b.valor === valor);
      if (!opt || !opt.gradient) return '';
      if (opt.svgPattern) {
        const encoded = encodeURIComponent(opt.svgPattern);
        return `url("data:image/svg+xml,${encoded}") repeat, ${opt.gradient}`;
      }
      return opt.gradient;
    },
    // Background atual no EDITOR
    cssBackgroundAvatarAtual() {
      return this._cssBgDeValor(this.configAvatarEditando?.bgAvatar);
    },
    // Background do perfil salvo (view mode)
    cssBgAvatarPerfil() {
      return this._cssBgDeValor(this.perfil?.config_avatar?.bgAvatar);
    },
    // ───────────────────────────────────────────────────────────────────────

    // Gera URL de um avatar BASE neutro (careca, sem barba, sem óculos, expressão padrão)
    // com APENAS o campo de opção sobreposto — para previews individuais de cada opção
    urlAvatarBaseComOpcao(campo, valor) {
      const BASE_NEUTRO = {
        avatarStyle:      'Transparent',
        topType:          'NoHair',
        accessoriesType:  'Blank',
        hairColor:        'BrownDark',
        facialHairType:   'Blank',
        facialHairColor:  'BrownDark',
        clotheType:       'ShirtCrewNeck',
        clotheColor:      'Blue03',
        eyeType:          'Default',
        eyebrowType:      'Default',
        mouthType:        'Default',
        skinColor:        'Light',
      };
      return montarUrlAvataaars({ ...BASE_NEUTRO, [campo]: valor });
    },
    cicloOpcaoAvatarEdit(campo, direcao) {
      const lista = this.opcoesAvataaars[campo];
      if (!lista || lista.length === 0) return;
      const atual = this.configAvatarEditando?.[campo];
      let i = lista.findIndex((o) => o.valor === atual);
      if (i < 0) i = 0;
      i += direcao;
      if (i < 0) i = lista.length - 1;
      if (i >= lista.length) i = 0;
      this.configAvatarEditando = { ...this.configAvatarEditando, [campo]: lista[i].valor };
    },
    selecionarOpcaoAvatarEdit(campo, valor) {
      this.configAvatarEditando = { ...this.configAvatarEditando, [campo]: valor };
    },
    labelOpcaoAvatarEdit(campo) {
      const lista = this.opcoesAvataaars[campo];
      if (!lista) return '';
      const item = lista.find((o) => o.valor === this.configAvatarEditando?.[campo]);
      return item ? (item.label || item.valor) : '';
    },
    indiceInfoAvatarEdit(campo) {
      const lista = this.opcoesAvataaars[campo];
      if (!lista) return { atual: 0, total: 0 };
      const i = lista.findIndex((o) => o.valor === this.configAvatarEditando?.[campo]);
      return { atual: (i < 0 ? 0 : i) + 1, total: lista.length };
    },

    indiceOpcaoAvatar(campo) {
      const lista = this.opcoesAvataaars[campo];
      if (!lista) return 0;
      const atual = this.configAvatarCadastro[campo];
      const i = lista.findIndex((o) => o.valor === atual);
      return i >= 0 ? i : 0;
    },
    cicloOpcaoAvatar(campo, direcao) {
      const lista = this.opcoesAvataaars[campo];
      if (!lista || lista.length === 0) return;
      let i = this.indiceOpcaoAvatar(campo) + direcao;
      if (i < 0) i = lista.length - 1;
      if (i >= lista.length) i = 0;
      this.configAvatarCadastro[campo] = lista[i].valor;
    },
    labelOpcaoAvatar(campo) {
      const lista = this.opcoesAvataaars[campo];
      const i = this.indiceOpcaoAvatar(campo);
      return lista && lista[i] ? (lista[i].label || lista[i].valor) : '';
    },
    hexOpcaoAvatar(campo) {
      const lista = this.opcoesAvataaars[campo];
      const i = this.indiceOpcaoAvatar(campo);
      return lista && lista[i] && lista[i].hex ? lista[i].hex : '#ccc';
    },
    selecionarOpcaoAvatar(campo, valor) {
      if (!this.configAvatarCadastro) return;
      this.configAvatarCadastro = { ...this.configAvatarCadastro, [campo]: valor };
    },

    // Background atual no CADASTRO
    cssBgCadastroAvatar() {
      return this._cssBgDeValor(this.configAvatarCadastro?.bgAvatar);
    },

    // Leitura Bíblia

    aplicarTema(tema) {
      const root = document.documentElement;
      const isDark = tema === 'escuro' || (tema === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.setAttribute('data-tema', 'escuro');
        root.setAttribute('data-bs-theme', 'dark');
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', '#0d1210');
      } else {
        root.removeAttribute('data-tema');
        root.setAttribute('data-bs-theme', 'light');
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', '#25633b');
      }
      localStorage.setItem('tema', tema);
      this.temaSalvo = tema;
    },

    async usarItemConsumivel(itemId) {
      this.erro = '';
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para usar itens.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await usarItem(this.usuario.id, itemId);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        this.sucesso = 'Item usado!';
        setTimeout(() => (this.sucesso = ''), 2000);
      } else {
        this.erro = r.erro || 'Não foi possível usar o item';
      }
    },

    async toggleEquipar(linha) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para equipar itens.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await equiparItem(this.usuario.id, linha.id, !linha.equipado);
      if (r.sucesso) await this.carregarDadosUsuario();
      else this.erro = r.erro || '';
    },

    async registrarAcaoRapida(acao) {
      if (this.modoDemo) {
        this.sucesso = `${acao.charAt(0).toUpperCase() + acao.slice(1)} (demo).`;
        setTimeout(() => (this.sucesso = ''), 2000);
        return;
      }
      const r = await registrarAcao(this.usuario.id, acao);
      if (r.sucesso) {
        this.sucesso = `${acao.charAt(0).toUpperCase() + acao.slice(1)} registrado.`;
        setTimeout(() => (this.sucesso = ''), 2000);
      }
    },

    async iniciarMissao(modeloId) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para iniciar missões.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await iniciarMissao(this.usuario.id, modeloId);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        await this.carregarMissoes();
        this.fecharDetalhesMissao();
      } else {
        this.erro = r.erro || '';
      }
    },

    async concluirMissao(m) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para concluir missões.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await concluirMissao(this.usuario.id, m.id);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        await this.carregarMissoes();
        this.fecharDetalhesMissao();
      }
    },

    async desistirMissao(m) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para gerenciar missões.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await desistirMissao(this.usuario.id, m.id);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        await this.carregarMissoes();
      }
    },

    async carregarMissoes() {
      if (!this.usuario) return;
      
      // No modo demo, usar dados já carregados
      if (this.modoDemo) {
        this.atualizarFiltrosMissoes();
        return;
      }
      // Carregar métricas
      this.metricasMissoes = await obterMetricasMissoes(this.usuario.id);
      // Carregar missões do usuário
      let statusFiltro = this.filtroMissaoStatus;

      if (this.filtroMissaoStatus === 'ativa') {
        this.modelosMissoes = [];
        this.modelosMissoesFiltrados = [];
        const { missoes: todasAtivas, total: totalAtivas } = await listarTodasMissoes(
          this.usuario.id, 'ativa', this.filtroMissaoTipo, 9999, 0
        );
        const ativas = todasAtivas || [];
        if (ativas.length > 0) this.todasMissoes = ativas;
        this.totalMissoes = totalAtivas || ativas.length;
        const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
        this.missoesFiltradas = ativas.slice(inicio, inicio + this.limiteMissoes);

      } else if (this.filtroMissaoStatus === 'nao_concluidas') {
        this.modelosMissoes = [];
        this.modelosMissoesFiltrados = [];
        const [{ missoes: abandonadas }, { missoes: expiradas }] = await Promise.all([
          listarTodasMissoes(this.usuario.id, 'abandonada', this.filtroMissaoTipo, 9999, 0),
          listarTodasMissoes(this.usuario.id, 'expirada',  this.filtroMissaoTipo, 9999, 0)
        ]);
        const naoConcluidas = [...(abandonadas || []), ...(expiradas || [])];
        naoConcluidas.sort((a, b) => new Date(b.iniciada_em) - new Date(a.iniciada_em));
        if (naoConcluidas.length > 0) this.todasMissoes = naoConcluidas;
        this.totalMissoes = naoConcluidas.length;
        const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
        this.missoesFiltradas = naoConcluidas.slice(inicio, inicio + this.limiteMissoes);

      } else if (this.filtroMissaoStatus === 'concluida') {
        this.modelosMissoes = [];
        this.modelosMissoesFiltrados = [];
        const { missoes, total } = await listarTodasMissoes(
          this.usuario.id, 'concluida', this.filtroMissaoTipo, 9999, 0
        );
        const lista = missoes || [];
        if (lista.length > 0) this.todasMissoes = lista;
        this.totalMissoes = total || lista.length;
        const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
        this.missoesFiltradas = lista.slice(inicio, inicio + this.limiteMissoes);

      } else {
        // filtroMissaoStatus === null  →  mostrar tudo (modelos + missões do usuário), paginados juntos
        const [modelosData, { missoes: todasUser }] = await Promise.all([
          listarModelosMissoes(),
          listarTodasMissoes(this.usuario.id, null, this.filtroMissaoTipo, 9999, 0)
        ]);
        this.modelosMissoes = modelosData || [];
        const missoes = todasUser || [];
        if (missoes.length > 0) this.todasMissoes = missoes;

        // Filtrar modelos por tipo
        let modelos = this.modelosMissoes.slice();
        if (this.filtroMissaoTipo) modelos = modelos.filter(m => m?.tipo === this.filtroMissaoTipo);

        // Paginação UNIFICADA: modelos primeiro, depois missões do usuário
        const combinado = [...modelos, ...missoes];
        this.totalMissoes = combinado.length;
        const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
        const paginaItems = combinado.slice(inicio, inicio + this.limiteMissoes);

        this.modelosMissoesFiltrados = paginaItems.filter(item => !item.status);
        this.missoesFiltradas       = paginaItems.filter(item =>  item.status);
      }
      // Atualizar missões ativas para o HUD
      this.missoesAtivas = this.todasMissoes.filter(m => m.status === 'ativa');
      
      // Reinicializar timers após carregar missões (usar setTimeout para garantir que o DOM foi atualizado)
      setTimeout(() => {
        this.reinicializarTimersMissoes();
      }, 100);
    },

    // Função para inicializar contador regressivo em cada elemento
    initCountdown(element, prazoEm, prazoModeloHoras, missaoId) {
      if (!element) return;
      
      // Limpar intervalo anterior se existir
      if (element._countdownInterval) {
        clearInterval(element._countdownInterval);
        element._countdownInterval = null;
      }
      
      const self = this;
      const updateTimer = function() {
        try {
          let dataFinal;
          
          // Ler atributos diretamente do DOM (Alpine.js já renderizou)
          const prazoAttr = element.getAttribute('data-prazo');
          const prazoModeloAttr = element.getAttribute('data-prazo-modelo');
          const missaoIdAttr = element.getAttribute('data-missao-id');
          
          // Usar valores passados como parâmetro ou do atributo
          const prazo = prazoEm || prazoAttr;
          const prazoModelo = prazoModeloHoras || prazoModeloAttr;
          const idMissao = missaoId || missaoIdAttr;
          
          if (prazo && prazo !== 'null' && prazo !== 'undefined' && prazo !== '') {
            // Missão real com data específica
            dataFinal = new Date(prazo).getTime();
            if (isNaN(dataFinal)) {
              element.textContent = '--:--:--:--';
              return;
            }
          } else if (prazoModelo && prazoModelo !== 'null' && prazoModelo !== 'undefined' && prazoModelo !== '') {
            // Modelo de missão - calcular a partir de agora + horas
            const horas = parseInt(prazoModelo);
            if (isNaN(horas)) {
              element.textContent = '--:--:--:--';
              return;
            }
            dataFinal = Date.now() + (horas * 60 * 60 * 1000);
          } else {
            element.textContent = '--:--:--:--';
            return;
          }
          
          // Define a data final (ex: 31 de Dezembro de 2026)
          // Atualiza o contador a cada 1 segundo
          const agora = Date.now();
          const tempoRestante = dataFinal - agora;
          
          // Cálculos de tempo
          const dias = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
          const horas = Math.floor((tempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);
          
          // Exibe o resultado no elemento
          if (tempoRestante < 0) {
            element.textContent = '00:00:00:00';
            // Quando terminar, expirar missão (apenas se for missão real)
            if (idMissao && idMissao !== 'null' && idMissao !== 'undefined' && idMissao !== '') {
              self.expirarMissao(idMissao);
            }
            // Parar o intervalo
            if (element._countdownInterval) {
              clearInterval(element._countdownInterval);
              element._countdownInterval = null;
            }
          } else {
            element.textContent = dias.toString().padStart(2, '0') + ':' + 
                                   horas.toString().padStart(2, '0') + ':' + 
                                   minutos.toString().padStart(2, '0') + ':' + 
                                   segundos.toString().padStart(2, '0');
          }
        } catch (e) {
          // Silenciar erros
        }
      };
      
      // Executar imediatamente
      updateTimer();
      
      // Criar intervalo para atualizar a cada segundo
      element._countdownInterval = setInterval(updateTimer, 1000);
    },

    // Função para reinicializar todos os timers das missões visíveis
    reinicializarTimersMissoes() {
      // Limpar todos os intervalos existentes primeiro
      document.querySelectorAll('.contador-regressivo').forEach(el => {
        if (el._countdownInterval) {
          clearInterval(el._countdownInterval);
          el._countdownInterval = null;
        }
      });
      
      // Aguardar um pouco para garantir que o DOM foi atualizado
      setTimeout(() => {
        // Reinicializar timers para missões ativas
        if (this.missoesFiltradas && this.missoesFiltradas.length > 0) {
          this.missoesFiltradas.forEach(missao => {
            if (missao.status === 'ativa' && missao.prazo_em) {
              // Buscar todos os elementos com esse data-missao-id
              const timerElements = document.querySelectorAll(`.contador-regressivo[data-missao-id="${missao.id}"]`);
              timerElements.forEach(timerElement => {
                if (timerElement && !timerElement._countdownInterval) {
                  this.initCountdown(timerElement, missao.prazo_em, null, missao.id);
                }
              });
            }
          });
        }
        
        // Reinicializar timers para modelos de missão (se visíveis)
        if (this.filtroMissaoStatus === null && this.modelosMissoesFiltrados && this.modelosMissoesFiltrados.length > 0) {
          this.modelosMissoesFiltrados.forEach(modelo => {
            const prazoModelo = modelo.prazo_padrao_horas || 168;
            // Buscar todos os elementos com esse atributo e inicializar apenas os que não têm intervalo
            document.querySelectorAll(`.contador-regressivo[data-prazo-modelo="${prazoModelo}"]`).forEach(timerElement => {
              if (timerElement && !timerElement._countdownInterval) {
                this.initCountdown(timerElement, null, prazoModelo, null);
              }
            });
          });
        }
        
        // Se ainda houver elementos sem timer inicializado, tentar inicializar todos
        document.querySelectorAll('.contador-regressivo').forEach(timerElement => {
          if (!timerElement._countdownInterval) {
            const prazoAttr = timerElement.getAttribute('data-prazo');
            const prazoModeloAttr = timerElement.getAttribute('data-prazo-modelo');
            const missaoIdAttr = timerElement.getAttribute('data-missao-id');
            
            if (prazoAttr && missaoIdAttr) {
              this.initCountdown(timerElement, prazoAttr, null, missaoIdAttr);
            } else if (prazoModeloAttr) {
              this.initCountdown(timerElement, null, parseInt(prazoModeloAttr), null);
            }
          }
        });
      }, 150);
    },

    async expirarMissao(missaoId) {
      // Encontrar a missão
      const missao = this.missoesFiltradas?.find(m => m.id === missaoId && m.status === 'ativa');
      if (!missao) return;
      
      // Verificar se realmente expirou
      const prazo = new Date(missao.prazo_em).getTime();
      if (prazo > Date.now()) return; // Ainda não expirou
      
      if (this.modoDemo) {
        // No modo demo, atualizar localmente
        missao.status = 'expirada';
        this.atualizarFiltrosMissoes();
        this.carregarMissoes();
      } else {
        // Em produção, chamar API
        const { expirarMissao: expirarMissaoAPI } = await import('./servicos/missoes.js');
        await expirarMissaoAPI(this.usuario.id, missaoId);
        this.carregarMissoes();
      }
    },

    formatarDataConclusao(data) {
      if (!data) return '';
      const d = new Date(data);
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatarDataExpiracao(data) {
      if (!data) return '';
      const d = new Date(data);
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    calcularPrazoModelo(prazoPadraoHoras) {
      if (!prazoPadraoHoras) return '';
      // Calcular prazo a partir de agora + horas padrão
      const agora = this.tempoAtual || Date.now();
      const prazo = agora + (prazoPadraoHoras * 60 * 60 * 1000);
      const diff = prazo - agora;
      if (diff <= 0) return '00:00:00:00';
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);
      return `${dias.toString().padStart(2, '0')}:${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    },

    abrirDetalhesMissao(missao, tipo = 'missao') {
      this.modalDetalhesMissao = {
        aberto: true,
        missao: tipo === 'modelo' ? { ...missao, status: 'disponivel' } : missao
      };
    },

    getItensRecompensaModal() {
      if (!this.modalDetalhesMissao.missao) return [];
      // Para missões: verificar em modelos_missao.recompensas.itens
      // Para modelos: verificar em recompensas.itens
      return this.modalDetalhesMissao.missao?.modelos_missao?.recompensas?.itens || 
             this.modalDetalhesMissao.missao?.recompensas?.itens || 
             [];
    },

    // Função para marcar/desmarcar item do checklist
    toggleChecklistItem(missaoId, itemId) {
      if (this.modoDemo) {
        const missao = this.todasMissoes.find(m => m.id === missaoId);
        if (!missao || !missao.checklist) return;
        
        const item = missao.checklist.find(c => c.id === itemId);
        if (!item) return;
        
        // Toggle do status
        item.concluida = !item.concluida;
        if (item.concluida) {
          item.concluida_em = new Date().toISOString();
          item.concluida_por = this.usuario?.id || 'demo';
        } else {
          item.concluida_em = null;
          item.concluida_por = null;
        }
        
        // Verificar se todos os itens estão concluídos
        const todosConcluidos = missao.checklist.every(c => c.concluida);
        if (todosConcluidos && missao.status === 'ativa') {
          // Concluir missão automaticamente
          this.concluirMissao(missao);
        }
      } else {
        // TODO: Implementar chamada à API para atualizar checklist
        console.log('Atualizar checklist via API:', missaoId, itemId);
      }
    },

    // Verificar se todos os itens do checklist estão concluídos
    todosChecklistConcluidos(missao) {
      if (!missao.checklist || missao.checklist.length === 0) return false;
      return missao.checklist.every(item => item.concluida === true);
    },

    // Calcular progresso do checklist
    progressoChecklist(missao) {
      if (!missao.checklist || missao.checklist.length === 0) return 0;
      const concluidos = missao.checklist.filter(item => item.concluida).length;
      return Math.round((concluidos / missao.checklist.length) * 100);
    },

    fecharDetalhesMissao() {
      this.modalDetalhesMissao = { aberto: false, missao: null };
    },

    get totalPaginasMissoes() {
      return Math.ceil(this.totalMissoes / this.limiteMissoes) || 1;
    },

    get paginasMissoes() {
      const total = this.totalPaginasMissoes;
      const atual = this.paginaMissoes;
      const paginas = [];
      if (total <= 7) {
        for (let i = 1; i <= total; i++) paginas.push(i);
      } else {
        if (atual <= 3) {
          for (let i = 1; i <= 4; i++) paginas.push(i);
          paginas.push('...');
          paginas.push(total);
        } else if (atual >= total - 2) {
          paginas.push(1);
          paginas.push('...');
          for (let i = total - 3; i <= total; i++) paginas.push(i);
        } else {
          paginas.push(1);
          paginas.push('...');
          for (let i = atual - 1; i <= atual + 1; i++) paginas.push(i);
          paginas.push('...');
          paginas.push(total);
        }
      }
      return paginas;
    },

    atualizarFiltrosMissoes() {
      if (this.modoDemo) {
        // Sempre usar cópia de segurança completa do demo como fonte
        const fonte = (this._demoTodasMissoes && this._demoTodasMissoes.length > 0)
          ? this._demoTodasMissoes
          : this.todasMissoes;
        let filtradas = [...(fonte || [])];

        // Filtro por status
        if (this.filtroMissaoStatus === 'ativa') {
          filtradas = filtradas.filter(m => m?.status === 'ativa');
        } else if (this.filtroMissaoStatus === 'concluida') {
          filtradas = filtradas.filter(m => m?.status === 'concluida');
        } else if (this.filtroMissaoStatus === 'nao_concluidas') {
          filtradas = filtradas.filter(m => m?.status === 'abandonada' || m?.status === 'expirada');
        }
        // null = todas, sem filtro de status

        // Filtro por tipo
        if (this.filtroMissaoTipo) {
          filtradas = filtradas.filter(m => {
            const tipo = m?.modelos_missao?.tipo || m?.tipo;
            return tipo === this.filtroMissaoTipo;
          });
        }

        if (this.filtroMissaoStatus === null) {
          // Filtrar modelos por tipo (se aplicável)
          let modelos = [...(this.modelosMissoes || [])];
          if (this.filtroMissaoTipo) {
            modelos = modelos.filter(m => m?.tipo === this.filtroMissaoTipo);
          }

          // Paginação UNIFICADA: modelos primeiro, depois missões do usuário
          // Assim o limite (10/20/50/Todos) se aplica ao total de cards visíveis na tela
          const combinado = [...modelos, ...filtradas];
          this.totalMissoes = combinado.length;
          const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
          const paginaItems = combinado.slice(inicio, inicio + this.limiteMissoes);

          // Separar de volta para os dois arrays de exibição:
          // modelos = itens sem campo "status" (são modelos de missão, não missões do usuário)
          this.modelosMissoesFiltrados = paginaItems.filter(item => !item.status);
          this.missoesFiltradas       = paginaItems.filter(item =>  item.status);
        } else {
          this.modelosMissoesFiltrados = [];
          this.totalMissoes = filtradas.length;
          const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
          this.missoesFiltradas = filtradas.slice(inicio, inicio + this.limiteMissoes);
        }

        this.$nextTick(() => setTimeout(() => this.reinicializarTimersMissoes(), 300));
      } else {
        this.carregarMissoes();
      }
    },

    async carregarCapituloBiblia() {
      this.carregandoCapitulo = true;
      this.capituloBiblia = null;
      this.erro = '';
      // Limpa seleção/pinos ao trocar de capítulo
      window.getSelection()?.removeAllRanges();
      this.bibleSelecaoCustom.ativo = false;
      this.bibleContextMenu.aberto = false;
      const traducao = this.traducaoBiblia || 'arib';
      this.dropdownTraducaoAberto = false;
      const dados = await obterCapitulo(this.livroSelecionado, this.capituloSelecionado, traducao);
      if (!dados) {
        this.erro = 'Não foi possível carregar os versículos. Verifique sua conexão e tente novamente.';
      }
      this.capituloBiblia = dados;
      this.carregandoCapitulo = false;
      this.progressoLeituraScroll = this.percentualCapitulo(this.livroSelecionado, this.capituloSelecionado);
      this.carregarNotacoesCapitulo();
    },

    narrarCapitulo(fromIdx = 0) {
      if (!window.speechSynthesis) return;
      // Modo aula: narrar parágrafos da aula
      if (this.modoAulaEstudo && this.aulaSelecionadaEstudo) {
        const paragrafos = this.aulaSelecionadaEstudo.conteudo || [];
        if (!paragrafos.length) return;
        this.narrando = true;
        const fila = [this.aulaSelecionadaEstudo.titulo + '.', ...paragrafos];
        this._narracaoIdx = fromIdx;
        const falar = () => {
          if (this._narracaoIdx >= fila.length) { this.narrando = false; return; }
          const u = new SpeechSynthesisUtterance(fila[this._narracaoIdx]);
          u.lang = 'pt-BR';
          u.rate = this.velocidadeNarracao;
          u.onend = () => { this._narracaoIdx++; falar(); };
          window.speechSynthesis.speak(u);
        };
        window.speechSynthesis.cancel();
        falar();
        return;
      }
      // Modo Bíblia
      const verses = (this.capituloBiblia && this.capituloBiblia.verses) || [];
      if (!verses.length) return;
      this.narrando = true;
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado);
      const nomeLivro = livro ? livro.nome : this.livroSelecionado;
      const fila = [
        `${nomeLivro} capítulo ${this.capituloSelecionado}.`,
        ...verses.map((v) => `Versículo ${v.verse}. ${v.text || ''}`)
      ];
      this._narracaoIdx = fromIdx;
      const falar = () => {
        if (this._narracaoIdx >= fila.length) {
          this.narrando = false;
          return;
        }
        const u = new SpeechSynthesisUtterance(fila[this._narracaoIdx]);
        u.lang = 'pt-BR';
        u.rate = this.velocidadeNarracao;
        u.onend = () => { this._narracaoIdx++; falar(); };
        window.speechSynthesis.speak(u);
      };
      window.speechSynthesis.cancel();
      falar();
    },

    pararNarracao() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.narrando = false;
    },

    chaveNotacoesCapitulo() {
      const uid = this.modoDemo ? 'demo' : (this.usuario?.id || '');
      if (this.modoHarpa && this.hinoSelecionado?.numero) {
        return `notacoes_harpa_${uid}_${this.hinoSelecionado.numero}`;
      }
      if (this.modoAulaEstudo && this.aulaSelecionadaEstudo?.id) {
        return `notacoes_aula_${uid}_${this.aulaSelecionadaEstudo.id}`;
      }
      const trad = this.traducaoBiblia || 'arib';
      return `notacoes_${uid}_${trad}_${this.livroSelecionado}_${this.capituloSelecionado}`;
    },

    carregarNotacoesCapitulo() {
      try {
        const raw = localStorage.getItem(this.chaveNotacoesCapitulo());
        this.notacoesCapitulo = raw ? JSON.parse(raw) : [];
      } catch {
        this.notacoesCapitulo = [];
      }
    },

    salvarNotacoesCapitulo() {
      try {
        localStorage.setItem(this.chaveNotacoesCapitulo(), JSON.stringify(this.notacoesCapitulo));
      } catch (e) {
        console.error(e);
      }
    },

    adicionarMarcador(verse, start, end, text, color) {
      // Se houver nota sobreposta, atualiza a cor do highlight na nota (mantém o link)
      // Se houver highlight puro sobreposto, descarta-o (será substituído)
      let temNotaSobreposta = false;
      const novas = [];
      for (const n of this.notacoesCapitulo) {
        const sobrepoe = n.verse === verse && n.end > start && n.start < end;
        if (!sobrepoe) { novas.push(n); continue; }
        if (n.type === 'note') {
          temNotaSobreposta = true;
          novas.push({ ...n, highlightColor: color }); // preserva nota, atualiza a cor
        }
        // highlight puro sobreposto: descarta (vai ser substituído)
      }
      if (!temNotaSobreposta) {
      const id = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        novas.push({ id, type: 'highlight', verse, start, end, text, color });
      }
      this.notacoesCapitulo = novas;
      this.salvarNotacoesCapitulo();
    },

    adicionarNota(verse, start, end, text, noteContent, corFundo) {
      // Se há highlight sobreposto, herda a cor e remove o highlight (mantém visual + vira link)
      const highlightExistente = this.notacoesCapitulo.find(
        (n) => n.verse === verse && n.type === 'highlight' && n.start < end && n.end > start
      );
      const highlightColor = highlightExistente?.color || null;
      // Remove anotações que se sobrepõem ao mesmo trecho
      this.notacoesCapitulo = this.notacoesCapitulo.filter(
        (n) => n.verse !== verse || n.end <= start || n.start >= end
      );
      const id = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
      this.notacoesCapitulo.push({ id, type: 'note', verse, start, end, text, noteContent: noteContent || '', highlightColor, corFundo: corFundo || '#fef08a' });
      this.salvarNotacoesCapitulo();
    },

    removerNotacao(id) {
      const n = this.notacoesCapitulo.find((x) => x.id === id);
      if (n && n.type === 'note' && n.highlightColor) {
        // Nota tinha marcação de cor → converte para highlight puro (mantém a cor, remove o link)
        const novoId = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        this.notacoesCapitulo = this.notacoesCapitulo
          .filter((x) => x.id !== id)
          .concat([{ id: novoId, type: 'highlight', verse: n.verse, start: n.start, end: n.end, text: n.text, color: n.highlightColor }]);
      } else {
        this.notacoesCapitulo = this.notacoesCapitulo.filter((x) => x.id !== id);
      }
      this.salvarNotacoesCapitulo();
      this.notaPopup.aberto = false;
    },

    removerMarcadorSelecao() {
      const p = this.bibleContextMenu.pendente;
      if (!p) return;
      // Para highlights puros: remove. Para notas com highlightColor: mantém a nota, remove a cor.
      const novas = [];
      for (const n of this.notacoesCapitulo) {
        const sobrepoe = n.verse === p.verse && n.end > p.start && n.start < p.end;
        if (!sobrepoe) { novas.push(n); continue; }
        if (n.type === 'note' && n.highlightColor) {
          novas.push({ ...n, highlightColor: null }); // mantém nota, remove a cor do fundo
        }
        // highlight puro: descarta
      }
      this.notacoesCapitulo = novas;
      this.salvarNotacoesCapitulo();
      this.bibleContextMenu.aberto = false;
      this.bibleContextMenu.pendente = null;
      this.bibleSelecaoCustom.ativo = false;
      window.getSelection()?.removeAllRanges();
    },

    atualizarNota(id, novoConteudo) {
      const n = this.notacoesCapitulo.find((x) => x.id === id);
      if (n && n.type === 'note') n.noteContent = novoConteudo;
      this.salvarNotacoesCapitulo();
    },

    renderVersoHtml(verseNum, text) {
      if (!text) return '';
      const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const notacoes = this.notacoesCapitulo.filter((n) => n.verse === verseNum).sort((a, b) => a.start - b.start);
      if (notacoes.length === 0) return esc(text);
      let out = '';
      let last = 0;
      for (const n of notacoes) {
        if (n.start > last) out += esc(text.slice(last, n.start));
        const segment = esc(text.slice(n.start, n.end));
        if (n.type === 'highlight') out += `<mark class="marca-texto" style="background:${n.color}; border-radius:2px;">${segment}</mark>`;
        else if (n.type === 'note') {
          const noteSpan = `<span class="nota-link" data-note-id="${esc(n.id)}" tabindex="0" role="button">${segment}</span>`;
          if (n.highlightColor) {
            out += `<mark class="marca-texto nota-marcada-com-nota" style="background:${esc(n.highlightColor)}; border-radius:2px;">${noteSpan}</mark>`;
          } else {
            out += noteSpan;
          }
        }
        last = n.end;
      }
      if (last < text.length) out += esc(text.slice(last));
      return out;
    },

    // Extrai os dados da seleção atual (retorna null se inválida)
    _extrairSelecaoBiblia() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return null;
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const elNode = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      const el = elNode && elNode.closest ? elNode.closest('.verso-texto') : null;
      if (!el || !el.contains(range.commonAncestorContainer)) return null;
      const verseNum = parseInt(el.getAttribute('data-verse'), 10);
      const div = document.createElement('div');
      div.appendChild(range.cloneContents());
      const selectedText = (div.textContent || '').trim();
      if (!selectedText) return null;
      const start = this.offsetEmTexto(el, range.startContainer, range.startOffset);
      const end = this.offsetEmTexto(el, range.endContainer, range.endOffset);
      if (start === undefined || end === undefined) return null;
      const [s, e] = start <= end ? [start, end] : [end, start];
      return { verse: verseNum, start: s, end: e, text: selectedText };
    },

    // Posiciona e abre o menu de contexto da Bíblia.
    // isTouch=true  → bottom sheet (CSS cuida da posição, sem coordenadas JS)
    // isTouch=false → popup próximo ao cursor (desktop)
    _mostrarMenuBiblia(x, y, isTouch) {
      this.bibleContextMenu.modoSheet = isTouch;
      if (!isTouch) {
        const menuW = 260, menuH = 240;
        const vw = window.innerWidth, vh = window.innerHeight;
        const cx = Math.min(x, vw - menuW - 10);
        const cy = (y + 18 + menuH < vh) ? y + 18 : y - menuH - 8;
        this.bibleContextMenu.x = Math.max(8, cx);
        this.bibleContextMenu.y = Math.max(8, cy);
      }
      this.bibleContextMenu.aberto = true;
    },

    onSoltarLeitura(ev) {
      if (this._longPressAcionado) return;
      if (this._longPressTimer) { clearTimeout(this._longPressTimer); this._longPressTimer = null; }

      const isTouch = !!ev.changedTouches;
      const cx = isTouch ? ev.changedTouches[0].clientX : ev.clientX;
      const cy = isTouch ? ev.changedTouches[0].clientY : ev.clientY;

      const processar = () => {
        const pendente = this._extrairSelecaoBiblia();
        if (!pendente) {
          // Seleção foi perdida: fecha o menu
          this.fecharMenuBiblia();
          return;
        }
        // Atualiza a seleção pendente
        this.bibleContextMenu.pendente = pendente;
        if (!this.bibleContextMenu.aberto) {
          // Primeira vez: posiciona e abre o menu
          this._mostrarMenuBiblia(cx, cy, isTouch);
        }
        // Se já está aberto: apenas atualiza o pendente (não reposiciona)
        // O usuário estendeu a seleção — o menu fica onde está, pronto para aplicar
      };

      // Pequeno delay no touch para o browser terminar de atualizar a seleção
      if (isTouch) {
        setTimeout(processar, 120);
      } else {
        processar();
      }
    },

    abrirMenuContextoBiblia(ev) {
      const pendente = this._extrairSelecaoBiblia();
      if (!pendente) return;
      this.bibleContextMenu.pendente = pendente;
      this._mostrarMenuBiblia(ev.clientX, ev.clientY, false);
    },

    fecharMenuBiblia() {
      this.bibleContextMenu.aberto = false;
    },

    aplicarMarcadorDoMenu(cor) {
      const p = this.bibleContextMenu.pendente;
      if (!p) return;
      this.adicionarMarcador(p.verse, p.start, p.end, p.text, cor);
      window.getSelection()?.removeAllRanges();
      this.bibleContextMenu.aberto = false;
      this.bibleContextMenu.pendente = null;
      this.bibleSelecaoCustom.ativo = false;
    },

    abrirNotaDoMenu() {
      const p = this.bibleContextMenu.pendente;
      if (!p) return;
      this.notaPopup.aberto = true;
      this.notaPopup.id = null;
      this.notaPopup.textoRef = p.text;
      this.notaPopup.conteudo = '';
      this._pendenteNota = p;
      window.getSelection()?.removeAllRanges();
      this.bibleContextMenu.aberto = false;
      this.bibleContextMenu.pendente = null;
      this.bibleSelecaoCustom.ativo = false;
    },

    offsetEmTexto(containerEl, node, offset) {
      const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT);
      let count = 0;
      let current;
      while ((current = walker.nextNode())) {
        const len = current.textContent.length;
        if (current === node) return count + offset;
        count += len;
      }
      return undefined;
    },

    iniciarLongPressLeitura(ev) {
      // Apenas touch; mouse usa mouseup + onSoltarLeitura
      if (!ev.touches) return;
      const touch = ev.touches[0];
      this._longPressTimer = setTimeout(() => {
        this._longPressTimer = null;
        this._longPressAcionado = true;
        setTimeout(() => (this._longPressAcionado = false), 800);
        const pendente = this._extrairSelecaoBiblia();
        if (!pendente) return;
        this.bibleContextMenu.pendente = pendente;
        this._mostrarMenuBiblia(touch.clientX, touch.clientY, true);
      }, 650);
    },

    cancelarLongPressLeitura() {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
    },

    salvarNotaPendente() {
      if (!this._pendenteNota) return;
      this.adicionarNota(
        this._pendenteNota.verse,
        this._pendenteNota.start,
        this._pendenteNota.end,
        this._pendenteNota.text,
        this.notaPopup.conteudo,
        this.notaPopup.corFundo
      );
      this._pendenteNota = null;
      this.notaPopup.aberto = false;
      this.notaPopup.conteudo = '';
    },

    onClickConteudoLeitura(ev) {
      const link = ev.target.closest('.nota-link');
      if (!link) return;
      ev.preventDefault();
      const id = link.getAttribute('data-note-id');
      const n = this.notacoesCapitulo.find((x) => x.id === id);
      if (!n || n.type !== 'note') return;
      this.notaPopup.aberto = true;
      this.notaPopup.id = id;
      this.notaPopup.conteudo = n.noteContent || '';
      this.notaPopup.textoRef = n.text || '';
      this.notaPopup.corFundo = n.corFundo || '#fef08a';
    },

    fecharNotaPopup() {
      this.notaPopup.aberto = false;
      this.notaPopup.id = null;
      this.notaPopup.conteudo = '';
      this.notaPopup.textoRef = '';
      this.notaPopup.corFundo = '#fef08a';
      this._pendenteNota = null;
    },

    salvarEdicaoNota() {
      if (this.notaPopup.id) {
        // Atualiza conteúdo + cor do post-it
        const n = this.notacoesCapitulo.find((x) => x.id === this.notaPopup.id);
        if (n && n.type === 'note') {
          n.noteContent = this.notaPopup.conteudo;
          n.corFundo = this.notaPopup.corFundo || '#fef08a';
        }
        this.salvarNotacoesCapitulo();
      } else {
        this.salvarNotaPendente();
      }
      this.fecharNotaPopup();
    },

    onScrollLeitura(ev) {
      const el = ev.target;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) {
        this.progressoLeituraScroll = 100;
        if (this._timeoutSalvarScroll) clearTimeout(this._timeoutSalvarScroll);
        this.salvarProgressoScroll();
        return;
      }
      const pct = ((scrollTop + clientHeight) / scrollHeight) * 100;
      const atual = Number(this.progressoLeituraScroll) || 0;
      const novo = Math.max(atual, Math.min(100, Math.round(pct)));
      this.progressoLeituraScroll = novo;
      if (novo >= 100) {
        if (this._timeoutSalvarScroll) clearTimeout(this._timeoutSalvarScroll);
        this.salvarProgressoScroll();
      } else {
        this.agendarSalvarProgressoScroll();
      }
    },

    agendarSalvarProgressoScroll() {
      if (this._timeoutSalvarScroll) clearTimeout(this._timeoutSalvarScroll);
      this._timeoutSalvarScroll = setTimeout(() => this.salvarProgressoScroll(), 1200);
    },

    async salvarProgressoScroll() {
      if (!this.capituloBiblia) return;
      const verses = this.capituloBiblia.verses || [];
      const totalVersos = verses.length;
      const pct = Math.min(100, Number(this.progressoLeituraScroll) || 0);
      const ultimoVersiculo = totalVersos > 0 ? Math.max(1, Math.ceil((pct / 100) * totalVersos)) : 0;

      if (this.modoDemo) {
        const lista = this.progressoLeitura || [];
        const idx = lista.findIndex(
          (p) => p.codigo_livro === this.livroSelecionado && Number(p.capitulo) === Number(this.capituloSelecionado)
        );
        const linha = { codigo_livro: this.livroSelecionado, capitulo: this.capituloSelecionado, percentual: pct, ultimo_versiculo: ultimoVersiculo };
        if (idx >= 0) this.progressoLeitura[idx] = linha;
        else this.progressoLeitura = [...lista, linha];
        this.salvarProgressoLeituraDemo();
        return;
      }

      if (!this.usuario) return;
      await salvarProgresso(
        this.usuario.id,
        'almeida',
        this.livroSelecionado,
        this.capituloSelecionado,
        ultimoVersiculo,
        pct
      );
      this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
    },

    async marcarProgressoLeitura() {
      if (!this.usuario || !this.capituloBiblia) return;
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para salvar seu progresso.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      this.progressoLeituraScroll = 100;
      const verses = this.capituloBiblia.verses || [];
      await salvarProgresso(
        this.usuario.id,
        'almeida',
        this.livroSelecionado,
        this.capituloSelecionado,
        verses.length,
        100
      );
      this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
      this.sucesso = 'Progresso salvo!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    tempoRestante(terminaEm) {
      return formatarTempoRestante(terminaEm);
    },

    livrosBiblia: LIVROS_BIBLIA,
    livrosAT: obterLivrosAntigoTestamento(),
    livrosNT: obterLivrosNovoTestamento(),
    gruposBiblia: GRUPOS_BIBLIA,

    // Computed: lista filtrada pela busca e categoria/ordem ativa
    // ── Harpa Cristã: hinos filtrados e paginados ──
    get harpaHinosFiltrados() {
      const q = (this.harpaBusca || '').trim().toLowerCase();
      if (!q) return this.harpaHinos;
      return this.harpaHinos.filter((h) =>
        String(h.numero).includes(q) || h.titulo.toLowerCase().includes(q)
      );
    },
    get harpaHinosPagina() {
      const inicio = this.harpaPagina * this.HARPA_POR_PAGINA;
      return this.harpaHinosFiltrados.slice(inicio, inicio + this.HARPA_POR_PAGINA);
    },

    get livrosFiltrados() {
      const q = (this.filtroBiblia || '').trim().toLowerCase();
      const cat = this.filtroCategoriaBiblia || 'canonico';

      // Busca textual: ignora filtro de categoria
      if (q) {
        return LIVROS_BIBLIA.filter((l) => l.nome.toLowerCase().includes(q));
      }

      // Ordem cronológica
      if (cat === 'cronologico') {
        return ORDEM_CRONOLOGICA.map((cod) => LIVROS_BIBLIA.find((l) => l.codigo === cod)).filter(Boolean);
      }

      // Testamentos
      if (cat === 'AT') return this.livrosAT;
      if (cat === 'NT') return this.livrosNT;

      // Grupos temáticos (lei, historia, sabedoria, profetas, evangelhos, cartas-paulo, epistolas)
      const gruposTemáticos = ['lei','historia','sabedoria','profetas','evangelhos','cartas-paulo','epistolas'];
      if (gruposTemáticos.includes(cat)) {
        return LIVROS_BIBLIA.filter((l) => l.grupo === cat);
      }

      // Padrão: canônico (ordem da Bíblia)
      return LIVROS_BIBLIA;
    },

    // Retorna font-size inline baseado no comprimento do nome do livro.
    // Garante legibilidade até ~6px — abaixo disso o CSS aplica ellipsis.
    fontSizeLivro(nome) {
      const len = (nome || '').length;
      if (len <= 7)  return 'font-size:0.72rem';
      if (len <= 10) return 'font-size:0.62rem';
      if (len <= 13) return 'font-size:0.52rem';
      if (len <= 17) return 'font-size:0.43rem';
      return 'font-size:0.375rem'; // ≈6px, abaixo disso o text-overflow corta
    },

    percentualLivro(codigoLivro) {
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === codigoLivro);
      const totalCap = livro?.totalCapitulos ?? 0;
      if (totalCap === 0) return 0;
      const doLivro = (this.progressoLeitura || []).filter((p) => p.codigo_livro === codigoLivro);
      if (doLivro.length === 0) return 0;
      const soma = doLivro.reduce((acc, p) => acc + (Number(p.percentual) || 0), 0);
      return Math.round(soma / totalCap);
    },

    percentualCapitulo(codigoLivro, capitulo) {
      const p = (this.progressoLeitura || []).find(
        (r) => r.codigo_livro === codigoLivro && Number(r.capitulo) === Number(capitulo)
      );
      return p ? Math.round(Number(p.percentual) || 0) : 0;
    },

    livroCompletoParaQuiz(codigoLivro) {
      return this.percentualLivro(codigoLivro) >= 100;
    },

    quizDesbloqueado(codigoLivro) {
      return this.livroCompletoParaQuiz(codigoLivro) && !this.livroAprovado(codigoLivro);
    },

    quizDesbloqueadoCapitulo() {
      return this.capituloBiblia && Math.round(Number(this.progressoLeituraScroll) || 0) >= 100;
    },

    livroAprovado(codigoLivro) {
      return (this.livrosAprovadosQuiz || []).includes(codigoLivro);
    },

    // ---- Estatísticas de quizes para o Perfil ----

    // Quizes concluídos com nota >= 70% (livros bíblicos + aulas + módulos)
    quizesConcluidos() {
      const livros = (this.livrosAprovadosQuiz || []).length;
      let aulasAprovadas = 0;
      Object.entries(this.progressoEstudo || {}).forEach(([key, p]) => {
        if (key !== 'modulos' && p && typeof p === 'object' && p.quizAprovado) aulasAprovadas++;
      });
      const modulosAprovados = Object.keys(this.progressoEstudo?.modulos || {}).length;
      return livros + aulasAprovadas + modulosAprovados;
    },

    // Total de quizes disponíveis no app
    totalQuizesDisponiveis() {
      let aulasComQuiz = 0;
      (this.TRILHAS_ESTUDO || []).forEach((trilha) => {
        (trilha.aulas || []).forEach((aula) => {
          if ((aula.quiz?.length || 0) > 0) aulasComQuiz++;
        });
      });
      const modulosComQuiz = (this.TRILHAS_ESTUDO || []).filter((t) => (t.quizModulo?.length || 0) > 0).length;
      const totalLivros = LIVROS_BIBLIA.length; // todos os 66 livros têm quiz disponível
      return aulasComQuiz + modulosComQuiz + totalLivros;
    },

    // ── Posição no ranking ─────────────────────────────────────────────────
    posicaoRanking() {
      if (!this.ranking || !this.ranking.length) return null;
      const idx = this.ranking.findIndex(r => r.usuario_id === this.usuario?.id || r.id === this.usuario?.id);
      return idx >= 0 ? idx + 1 : this.ranking.length + 1;
    },

    // ── Lista de conquistas ────────────────────────────────────────────────
    conquistas() {
      const lidos        = (this.progressoLeitura || []).filter(p => p.concluido).length;
      const totalCap     = (this.livrosBiblia || []).reduce((s, l) => s + (l.capitulos || 0), 0) || 1189;
      const pctBiblia    = Math.round(lidos / totalCap * 100);
      const quizFeitos   = this.quizesConcluidos ? this.quizesConcluidos() : 0;
      const missoesDone  = (this.todasMissoes || []).filter(m => m.status === 'concluida').length;
      const nivelAtual   = this.nivel?.nivel || 1;
      const sequencia    = this.nivel?.dias_sequencia || 0;
      const xpTotal      = this.nivel?.xp_total || 0;
      const perfilOk     = !!(this.perfil?.nome && this.perfil?.dataNascimento);
      const avatarOk     = !!(this.perfil?.config_avatar?.bgAvatar && this.perfil.config_avatar.bgAvatar !== 'nenhum');

      const lista = [
        { icone:'bi-book-half',           titulo:'Primeiro Passo',          desc:'Leia o primeiro capítulo',               conquistado: lidos >= 1,    cor:'success' },
        { icone:'bi-book',                titulo:'Leitor Dedicado',          desc:'Leia 50 capítulos',                      conquistado: lidos >= 50,   cor:'success' },
        { icone:'bi-journals',            titulo:'Maratonista da Palavra',   desc:'Leia 500 capítulos',                     conquistado: lidos >= 500,  cor:'success' },
        { icone:'bi-book-fill',           titulo:'Bíblia Completa',          desc:'Leia todos os capítulos',                conquistado: pctBiblia>=100,cor:'warning'  },
        { icone:'bi-fire',                titulo:'Em Chamas',                desc:'7 dias seguidos de leitura',             conquistado: sequencia>=7,  cor:'danger'  },
        { icone:'bi-lightning-charge-fill',titulo:'30 Dias de Fé',          desc:'30 dias consecutivos de leitura',        conquistado: sequencia>=30, cor:'danger'  },
        { icone:'bi-patch-question-fill', titulo:'Estudioso',                desc:'Conclua 1 quiz com ≥70%',                conquistado: quizFeitos>=1, cor:'primary' },
        { icone:'bi-mortarboard-fill',    titulo:'Quizmaster',               desc:'Conclua 10 quizes com ≥70%',             conquistado: quizFeitos>=10,cor:'primary' },
        { icone:'bi-star-fill',           titulo:'Nível 5',                  desc:'Alcance o nível 5',                      conquistado: nivelAtual>=5, cor:'warning'  },
        { icone:'bi-trophy-fill',         titulo:'Veterano',                 desc:'Alcance o nível 10',                     conquistado: nivelAtual>=10,cor:'warning'  },
        { icone:'bi-lightning-fill',      titulo:'1.000 XP',                 desc:'Acumule 1.000 pontos de experiência',    conquistado: xpTotal>=1000, cor:'primary' },
        { icone:'bi-flag-fill',           titulo:'Missionário',              desc:'Conclua 3 missões',                      conquistado: missoesDone>=3,cor:'info'    },
        { icone:'bi-check-circle-fill',   titulo:'Perfil Completo',          desc:'Preencha nome e data de nascimento',     conquistado: perfilOk,      cor:'success' },
        { icone:'bi-palette-fill',        titulo:'Personalidade',            desc:'Personalize seu personagem',             conquistado: avatarOk,      cor:'info'    },
      ];

      // Conquistadas primeiro, depois bloqueadas
      return lista.sort((a, b) => (b.conquistado ? 1 : 0) - (a.conquistado ? 1 : 0));
    },
    // ───────────────────────────────────────────────────────────────────────

    selecionarLivroParaCapitulos(livro) {
      this.livroSelecionadoParaCapitulos = livro;
      this.viewBiblia = 'capitulos';
    },

    voltarBibliaLivros() {
      this.viewBiblia = 'livros';
      this.livroSelecionadoParaCapitulos = null;
      this.quizLivroAtivo = null;
    },

    voltarBibliaCapitulos() {
      this.viewBiblia = 'capitulos';
      this.quizLivroAtivo = null;
      this.quizTipo = null;
    },

    async selecionarCapituloParaLeitura(livro, capitulo) {
      this.livroSelecionado = livro.codigo;
      this.capituloSelecionado = capitulo;
      this.viewBiblia = 'leitura';
      this.capituloBiblia = null;
      await this.carregarCapituloBiblia();
    },

    async voltarParaCapitulosBiblia() {
      await this.salvarProgressoScroll();
      this.viewBiblia = 'capitulos';
    },

    async avancarCapituloBiblia() {
      if (!this.capituloBiblia || !this.livroSelecionado) return;
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado);
      const totalCap = livro?.totalCapitulos ?? 0;
      const proximoCap = this.capituloSelecionado + 1;
      if (!this.livroAprovado(this.livroSelecionado)) {
        if (!this.modoDemo && this.usuario) {
          await resetarProgressoLivro(this.usuario.id, this.livroSelecionado);
          this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
        }
        this.sucesso = 'Progresso do livro não contabilizado. Faça o quiz com nota ≥70% para validar.';
        setTimeout(() => (this.sucesso = ''), 4000);
      }
      if (proximoCap <= totalCap) {
        this.capituloSelecionado = proximoCap;
        this.capituloBiblia = null;
        this.progressoLeituraScroll = this.percentualCapitulo(this.livroSelecionado, this.capituloSelecionado);
        await this.carregarCapituloBiblia();
      } else {
        await this.voltarParaCapitulosBiblia();
      }
    },

    async iniciarQuizLivro(livro) {
      if (!this.quizDesbloqueado(livro.codigo)) return;
      if (!this.temCoracoesSuficientes()) {
        this.erro = 'Você não tem corações suficientes para fazer o quiz.';
        return;
      }
      this.quizLivroAtivo = livro;
      this.quizTipo = 'livro';
      this.quizPerguntas = this.gerarPerguntasQuizLivro(livro);
      this.quizRespostas = {};
      this.quizEnviado = false;
      this.quizNota = null;
      this.quizPerguntaAtual = 0;
      this.quizRespostaSelecionada = null;
      this.quizFeedback = null;
      this.quizAcertos = 0;
      this.quizErros = 0;
      this.viewBiblia = 'quiz';
    },

    iniciarQuizCapitulo() {
      if (!this.quizDesbloqueadoCapitulo() || !this.capituloBiblia) return;
      if (!this.temCoracoesSuficientes()) {
        this.erro = 'Você não tem corações suficientes para fazer o quiz.';
        return;
      }
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado);
      this.quizLivroAtivo = livro || { nome: this.livroSelecionado, codigo: this.livroSelecionado };
      this.quizTipo = 'capitulo';
      this.quizPerguntas = this.gerarPerguntasQuizCapitulo();
      this.quizRespostas = {};
      this.quizEnviado = false;
      this.quizNota = null;
      this.quizPerguntaAtual = 0;
      this.quizRespostaSelecionada = null;
      this.quizFeedback = null;
      this.quizAcertos = 0;
      this.quizErros = 0;
      this.viewBiblia = 'quiz';
    },

    gerarPerguntasQuizCapitulo() {
      const verses = (this.capituloBiblia && this.capituloBiblia.verses) || [];
      const trechos = verses.slice(0, 5).map((v) => (v.text || '').slice(0, 80));
      return [
        { pergunta: 'O texto deste capítulo faz parte de qual testamento?', opcoes: ['Antigo Testamento', 'Novo Testamento'], correta: (LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado)?.testamento === 'NT' ? 1 : 0) },
        { pergunta: 'A mensagem do capítulo está de acordo com a Palavra de Deus?', opcoes: ['Sim', 'Não'], correta: 0 },
        { pergunta: 'Ler a Bíblia regularmente ajuda no crescimento espiritual?', opcoes: ['Sim', 'Não'], correta: 0 },
        { pergunta: 'Este capítulo pode ser aplicado à vida diária?', opcoes: ['Sim', 'Não', 'Depende do contexto'], correta: 0 },
        { pergunta: 'A Bíblia é inspirada por Deus?', opcoes: ['Sim', 'Não'], correta: 0 }
      ];
    },

    gerarPerguntasQuizLivro(livro) {
      const perguntasPorLivro = {
        GEN: [
          { pergunta: 'Quantos dias durou a criação?', opcoes: ['5', '6', '7', '8'], correta: 1 },
          { pergunta: 'Quem foi expulso do Éden?', opcoes: ['Caim e Abel', 'Adão e Eva', 'Noé', 'Abraão'], correta: 1 },
          { pergunta: 'Quantas pessoas entraram na arca de Noé (além de Noé)?', opcoes: ['4', '5', '6', '7'], correta: 2 },
          { pergunta: 'Qual filho de Abraão foi sacrificado (em tipo)?', opcoes: ['Ismael', 'Isaque', 'Jacó', 'José'], correta: 1 },
          { pergunta: 'Quem vendeu José aos egípcios?', opcoes: ['Seus irmãos', 'Os midianitas', 'Potifar', 'Faraó'], correta: 0 }
        ],
        JHN: [
          { pergunta: 'Quem batizou Jesus (segundo João)?', opcoes: ['Pedro', 'João Batista', 'André', 'Filipe'], correta: 1 },
          { pergunta: '"Deus amou o mundo de tal maneira que deu o seu..."', opcoes: ['Filho unigênito', 'Reino', 'Espírito', 'Anjo'], correta: 0 },
          { pergunta: 'Em João 3, Jesus fala com quem à noite?', opcoes: ['Pedro', 'Nicodemos', 'Zaqueu', 'Maria'], correta: 1 },
          { pergunta: 'Quantos pães foram usados na multiplicação (Jo 6)?', opcoes: ['3', '5', '7', '12'], correta: 1 },
          { pergunta: 'Quem disse "Senhor, para quem iremos? Tu tens as palavras de vida eterna"?', opcoes: ['André', 'Pedro', 'João', 'Tomé'], correta: 1 }
        ]
      };
      const padrao = [
        { pergunta: 'Este livro faz parte de qual testamento?', opcoes: ['Antigo', 'Novo', 'Ambos', 'Nenhum'], correta: livro.testamento === 'NT' ? 1 : 0 },
        { pergunta: 'O conteúdo deste livro é inspirado?', opcoes: ['Sim', 'Não'], correta: 0 },
        { pergunta: 'Quantos livros tem a Bíblia?', opcoes: ['66', '73', '80', '27'], correta: 0 },
        { pergunta: 'A Bíblia foi escrita em quantos idiomas originais?', opcoes: ['1', '2', '3', 'Vários'], correta: 3 },
        { pergunta: 'Quem é o autor último das Escrituras?', opcoes: ['Homens', 'Deus', 'Anjos', 'Profetas'], correta: 1 }
      ];
      return (perguntasPorLivro[livro.codigo] || padrao).slice(0, 5);
    },

    // Selecionar resposta no quiz de livro (feedback imediato)
    selecionarRespostaQuizLivro(respostaIndex) {
      if (this.quizFeedback !== null) return; // Já respondeu esta pergunta
      
      const pergunta = this.quizPerguntas[this.quizPerguntaAtual];
      const correta = Number(respostaIndex) === pergunta.correta;
      
      this.quizRespostaSelecionada = respostaIndex;
      this.quizRespostas[this.quizPerguntaAtual] = respostaIndex;
      
      if (correta) {
        this.quizFeedback = 'correto';
        this.quizAcertos++;
        this.tocarSomSucesso();
      } else {
        this.quizFeedback = 'errado';
        this.quizErros++;
        this.consumirCoracaoComBônus(); // usa bônus do Escudo da Fé se equipado
        this.tocarSomErro();
      }
      
      // Avançar para próxima pergunta após 1.5 segundos
      setTimeout(() => {
        this.proximaPerguntaQuizLivro();
      }, 1500);
    },
    
    // Avançar para próxima pergunta no quiz de livro
    proximaPerguntaQuizLivro() {
      if (this.quizPerguntaAtual < this.quizPerguntas.length - 1) {
        this.quizPerguntaAtual++;
        this.quizRespostaSelecionada = null;
        this.quizFeedback = null;
      } else {
        // Finalizar quiz
        this.finalizarQuizLivro();
      }
    },
    
    // Finalizar quiz de livro
    async finalizarQuizLivro() {
      const total = this.quizPerguntas.length;
      const nota = total > 0 ? Math.round((this.quizAcertos / total) * 100) : 0;
      this.quizNota = nota;
      this.quizEnviado = true;
      const NOTA_MINIMA = 70;

      if (this.quizTipo === 'capitulo') {
        // Resultado será mostrado na tela
        return;
      }

      if (!this.modoDemo) {
        if (nota >= NOTA_MINIMA) {
          await registrarAprovacaoQuizLivro(this.usuario.id, this.quizLivroAtivo.codigo);
          this.livrosAprovadosQuiz = await obterLivrosAprovadosQuiz(this.usuario.id);
        } else {
          await resetarProgressoLivro(this.usuario.id, this.quizLivroAtivo.codigo);
          this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
        }
      }
    },

    async enviarQuizLivro() {
      // Função antiga mantida para compatibilidade
      await this.finalizarQuizLivro();
    },

    fecharQuiz() {
      this.quizLivroAtivo = null;
      this.quizTipo = null;
      this.quizEnviado = false;
      this.quizNota = null;
      this.quizPerguntaAtual = 0;
      this.quizRespostaSelecionada = null;
      this.quizFeedback = null;
      this.quizAcertos = 0;
      this.quizErros = 0;
      this.voltarBibliaCapitulos();
    },

    // ========== SISTEMA DE CORAÇÕES (VIDAS) ==========
    
    // Verificar se tem corações suficientes para fazer quiz
    temCoracoesSuficientes() {
      return (this.coracoes?.atual || 0) > 0;
    },
    
    // Consumir 1 coração
    consumirCoracao() {
      if (!this.coracoes) {
        this.coracoes = { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
      }
      
      if (this.coracoes.atual > 0) {
        this.coracoes.atual--;
        
        // Se ficou sem corações, iniciar regeneração
        if (this.coracoes.atual === 0) {
          this.iniciarRegeneracaoCoracoes();
        }
        
        // Salvar no modo demo
        if (this.modoDemo) {
          localStorage.setItem('demo_coracoes', JSON.stringify(this.coracoes));
        }
      }
    },
    
    // Adicionar corações (comprar, ganhar de missão, etc)
    adicionarCoracoes(quantidade = 1) {
      if (!this.coracoes) {
        this.coracoes = { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
      }
      
      this.coracoes.atual = Math.min(this.coracoes.maximo, this.coracoes.atual + quantidade);
      
      // Se chegou no máximo, limpar regeneração
      if (this.coracoes.atual >= this.coracoes.maximo) {
        this.coracoes.proxima_regeneracao = null;
      }
      
      // Salvar no modo demo
      if (this.modoDemo) {
        localStorage.setItem('demo_coracoes', JSON.stringify(this.coracoes));
      }
    },
    
    // Iniciar regeneração de corações
    iniciarRegeneracaoCoracoes() {
      if (!this.coracoes) {
        this.coracoes = { atual: 0, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
      }
      
      const horasRegeneracao = this.coracoes.tempo_regeneracao_horas || 4;
      const agora = new Date();
      const proximaRegeneracao = new Date(agora.getTime() + (horasRegeneracao * 60 * 60 * 1000));
      
      this.coracoes.proxima_regeneracao = proximaRegeneracao.toISOString();
      
      // Salvar no modo demo
      if (this.modoDemo) {
        localStorage.setItem('demo_coracoes', JSON.stringify(this.coracoes));
      }
    },
    
    // Verificar e regenerar corações automaticamente
    verificarRegeneracaoCoracoes() {
      if (!this.coracoes || !this.coracoes.proxima_regeneracao) return;
      
      const agora = new Date();
      const proximaRegeneracao = new Date(this.coracoes.proxima_regeneracao);
      
      // Se já passou o tempo de regeneração
      if (agora >= proximaRegeneracao && this.coracoes.atual < this.coracoes.maximo) {
        this.adicionarCoracoes(1);
        
        // Se ainda não está no máximo, agendar próxima regeneração
        if (this.coracoes.atual < this.coracoes.maximo) {
          this.iniciarRegeneracaoCoracoes();
        }
      }
    },
    
    // Tempo restante para próxima regeneração
    tempoRestanteRegeneracao() {
      if (!this.coracoes || !this.coracoes.proxima_regeneracao || this.coracoes.atual >= this.coracoes.maximo) {
        return 'Corações cheios!';
      }
      
      const agora = new Date();
      const proximaRegeneracao = new Date(this.coracoes.proxima_regeneracao);
      const diferenca = proximaRegeneracao - agora;
      
      if (diferenca <= 0) {
        return 'Regenerando...';
      }
      
      const horas = Math.floor(diferenca / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      
      if (horas > 0) {
        return `${horas}h ${minutos}m`;
      }
      return `${minutos}m`;
    },
    
    // Tocar som de sucesso
    tocarSomSucesso() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Silenciosamente falhar se áudio não estiver disponível
      }
    },
    
    // Tocar som de erro
    tocarSomErro() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 220; // A3
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (e) {
        // Silenciosamente falhar se áudio não estiver disponível
      }
    },
    
    // Orar para ganhar corações (1 coração por oração, máximo 1x por dia)
    orarParaGanharCoracao() {
      if (!this.coracoes) {
        this.coracoes = { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
      }
      
      // Verificar se já orou hoje (modo demo - usar localStorage)
      const hoje = new Date().toDateString();
      const ultimaOracao = localStorage.getItem('demo_ultima_oracao');
      
      if (ultimaOracao === hoje) {
        this.erro = 'Você já orou hoje! Volte amanhã para ganhar mais corações.';
        return;
      }
      
      // Adicionar coração e registrar oração
      this.adicionarCoracoes(1);
      localStorage.setItem('demo_ultima_oracao', hoje);
      this.sucesso = 'Oração registrada! Você ganhou 1 coração.';
      
      setTimeout(() => {
        this.sucesso = '';
      }, 3000);
    },
    
    // Enviar bênção para outro jogador (ganha 1 coração, máximo 3x por dia)
    enviarBencao(usuarioId) {
      if (!this.coracoes) {
        this.coracoes = { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
      }
      
      // Verificar quantas bênçãos já enviou hoje (modo demo)
      const hoje = new Date().toDateString();
      const bencoesHoje = JSON.parse(localStorage.getItem('demo_bencoes_hoje') || '[]');
      const bencoesHojeData = bencoesHoje[0] === hoje ? bencoesHoje.slice(1) : [];
      
      if (bencoesHojeData.length >= 3) {
        this.erro = 'Você já enviou 3 bênçãos hoje! Volte amanhã para enviar mais.';
        return;
      }
      
      // Adicionar coração e registrar bênção
      this.adicionarCoracoes(1);
      bencoesHojeData.push(usuarioId);
      localStorage.setItem('demo_bencoes_hoje', JSON.stringify([hoje, ...bencoesHojeData]));
      this.sucesso = 'Bênção enviada! Você ganhou 1 coração.';
      
      setTimeout(() => {
        this.sucesso = '';
      }, 3000);
    },

    // Funções do Inventário RPG
    getItemEquipadoSlot(slotId) {
      // 1ª tentativa: match direto pelo campo slot
      let found = (this.inventario || []).find(item =>
        item.equipado && item.itens?.slot === slotId
      );
      if (found) return found.itens;

      // 2ª tentativa: match por palavras-chave no nome (fallback retrocompat.)
      const nameMap = {
        cinto:    ['cinto', 'verdade'],
        couraca:  ['coura', 'peitoral', 'justiça', 'justi'],
        calcados: ['calç', 'calc', 'evangelho'],
        escudo:   ['escudo', 'fé', 'fe'],
        capacete: ['capacete', 'elmo', 'salva'],
        espada:   ['espada', 'espírito', 'espirito'],
      };
      const kws = nameMap[slotId] || [slotId];
      found = (this.inventario || []).find(item =>
        item.equipado && kws.some(kw => item.itens?.nome?.toLowerCase().includes(kw))
      );
      return found?.itens || null;
    },

    // Retorna lista de slots que têm item equipado
    armaduraEquipada() {
      return (this.ARMADURA_DEUS_SLOTS || []).filter(slot => this.getItemEquipadoSlot(slot.id));
    },

    // Equipa ou desequipa um slot pelo id (cinto, couraca, etc.)
    async toggleEquiparSlot(slotId) {
      const linhaEquipada = (this.inventario || []).find(item =>
        item.equipado && (item.itens?.slot === slotId ||
          (this.getItemEquipadoSlot(slotId) && item.itens === this.getItemEquipadoSlot(slotId)))
      );

      if (linhaEquipada) {
        // Desequipar
        if (this.modoDemo) {
          this.inventario = this.inventario.map(i =>
            i.id === linhaEquipada.id ? { ...i, equipado: false } : i
          );
          return;
        }
        await this.toggleEquipar(linhaEquipada);
      } else {
        // Equipar — busca item disponível do slot
        const linhaDisp = (this.inventario || []).find(item =>
          !item.equipado && item.itens?.slot === slotId
        );
        if (linhaDisp) {
          if (this.modoDemo) {
            this.inventario = this.inventario.map(i =>
              i.id === linhaDisp.id ? { ...i, equipado: true } : i
            );
            return;
          }
          await this.toggleEquipar(linhaDisp);
        } else {
          this.sucesso = 'Você não tem esta peça. Visite a Loja!';
          setTimeout(() => (this.sucesso = ''), 3000);
        }
      }
    },

    // =====================================================
    // INVENTÁRIO CRUD — Equip / Unequip / Swap / Sell
    // =====================================================

    /** Abre o modal de detalhes de um item do inventário (aceita ID ou objeto) */
    abrirInventarioItem(linhaOuId) {
      let linha = linhaOuId;
      if (typeof linhaOuId === 'string') {
        linha = (this.inventario || []).find(i => i.id === linhaOuId) || null;
      }
      if (!linha) {
        console.warn('[inventario] Item não encontrado ao abrir modal:', linhaOuId);
        return;
      }
      this.inventarioItemModal = { aberto: true, linha };
    },

    /** Fecha o modal */
    fecharInventarioItem() {
      this.inventarioItemModal = { aberto: false, linha: null };
    },

    /** Inicia o press longo em um item de inventário (1s = equipar/desequipar) */
    iniciarPressItemInventario(linhaIdOuObj) {
      const linhaId = (typeof linhaIdOuObj === 'string') ? linhaIdOuObj : linhaIdOuObj?.id;
      if (!linhaId) return;
      // Limpa qualquer timer anterior
      if (this.dragInventario.timer) {
        clearTimeout(this.dragInventario.timer);
      }
      this.dragInventario.ativo = false;
      this.dragInventario.itemId = linhaId;
      this.dragInventario.timer = setTimeout(() => {
        // Considera como "drag/press concluído": alterna equipar
        this.dragInventario.ativo = true;
        this.equiparItemInventario(linhaId);
      }, 1000);
    },

    /** Cancela o press longo (soltou antes de 1s ou moveu o dedo/mouse) */
    cancelarPressItemInventario() {
      if (this.dragInventario.timer) {
        clearTimeout(this.dragInventario.timer);
        this.dragInventario.timer = null;
      }
    },

    /**
     * Equipa ou desequipa item do inventário.
     * — Armadura: usa slot exclusivo (troca automática se necessário).
     * — Permanente: máximo de 3 equipados simultâneos.
     * — Consumível: não pode ser equipado.
     */
    async equiparItemInventario(linhaIdOuObj) {
      // Aceita tanto um ID (string) quanto um objeto/proxy — normaliza para ID
      const linhaId = (typeof linhaIdOuObj === 'string') ? linhaIdOuObj : linhaIdOuObj?.id;
      if (!linhaId) { console.warn('[equipar] linhaId não encontrado', linhaIdOuObj); return; }

      // Busca o item ATUAL no array reativo (evita problemas com proxies stale)
      const inventarioArr = JSON.parse(JSON.stringify(this.inventario || []));
      const linha = inventarioArr.find(i => i.id === linhaId);
      if (!linha) { console.warn('[equipar] item não encontrado no inventário:', linhaId); return; }

      const tipo = linha.itens?.tipo;
      if (tipo === 'consumivel') {
        this.erro = 'Consumíveis não podem ser equipados. Use-os diretamente!';
        setTimeout(() => (this.erro = ''), 3000);
        return;
      }

      if (tipo === 'armadura') {
        const slotId = linha.itens?.slot;
        if (!slotId) return;
        // Desequipar item atual do mesmo slot (swap automático)
        const atualId = inventarioArr.find(
          i => i.equipado && i.itens?.slot === slotId && i.id !== linhaId
        )?.id;
        if (atualId) {
          if (this.modoDemo) {
            this.inventario = this.inventario.map(i => i.id === atualId ? { ...i, equipado: false } : i);
          } else {
            await equiparItem(this.usuario.id, atualId, false);
          }
        }
        // Equipar / desequipar o novo
        if (this.modoDemo) {
          const novoEquipado = !linha.equipado;
          this.inventario = this.inventario.map(i => i.id === linhaId ? { ...i, equipado: novoEquipado } : i);
          this._salvarInventarioDemo();
        } else {
          const r = await equiparItem(this.usuario.id, linhaId, !linha.equipado);
          if (r.sucesso) await this.carregarDadosUsuario();
          else this.erro = r.erro || '';
        }
      } else if (tipo === 'permanente') {
        // Checar limite máximo
        const limite = this.SLOTS_PERMANENTES?.maximo || 3;
        const equipados = inventarioArr.filter(
          i => i.equipado && i.itens?.tipo === 'permanente' && i.id !== linhaId
        ).length;
        if (!linha.equipado && equipados >= limite) {
          this.erro = `Máximo de ${limite} itens permanentes equipados. Desequipe um antes.`;
          setTimeout(() => (this.erro = ''), 3500);
          return;
        }
        if (this.modoDemo) {
          const novoEquipado = !linha.equipado;
          this.inventario = this.inventario.map(i => i.id === linhaId ? { ...i, equipado: novoEquipado } : i);
          this._salvarInventarioDemo();
        } else {
          const r = await equiparItem(this.usuario.id, linhaId, !linha.equipado);
          if (r.sucesso) await this.carregarDadosUsuario();
          else this.erro = r.erro || '';
        }
      }

      // Atualiza a linha no modal com o dado fresco
      const linhaAtualizada = this.inventario.find(i => i.id === linhaId);
      if (linhaAtualizada) this.inventarioItemModal = { ...this.inventarioItemModal, linha: { ...linhaAtualizada } };
      this.sucesso = linha.equipado ? 'Item desequipado!' : 'Item equipado!';
      setTimeout(() => (this.sucesso = ''), 2500);
    },

    /** Salva o inventário demo no localStorage para persistência */
    _salvarInventarioDemo() {
      try {
        const raw = JSON.parse(JSON.stringify(this.inventario || []));
        localStorage.setItem('demo_inventario', JSON.stringify(raw));
      } catch (e) { console.warn('[demo] Falha ao salvar inventário:', e); }
    },

    /**
     * Vende um item do inventário por 50% do preço original.
     * Se equipado, desequipa automaticamente antes de vender.
     */
    async venderItem(linhaIdOuObj) {
      const linhaId = (typeof linhaIdOuObj === 'string') ? linhaIdOuObj : linhaIdOuObj?.id;
      const inventarioArr = JSON.parse(JSON.stringify(this.inventario || []));
      const linha = inventarioArr.find(i => i.id === linhaId);
      if (!linha) return;
      const preco = Math.max(1, Math.floor((linha.itens?.preco_ouro || 10) * 0.5));
      if (this.modoDemo) {
        // Remover ou decrementar quantidade
        if ((linha.quantidade || 1) > 1) {
          this.inventario = this.inventario.map(i =>
            i.id === linhaId ? { ...i, quantidade: i.quantidade - 1 } : i
          );
        } else {
          this.inventario = this.inventario.filter(i => i.id !== linhaId);
        }
        this.moeda = { ...(this.moeda || {}), ouro: (this.moeda?.ouro || 0) + preco };
        this._salvarInventarioDemo();
        this.sucesso = `Vendido por ${preco} ouro!`;
        setTimeout(() => (this.sucesso = ''), 2500);
        this.fecharInventarioItem();
        return;
      }
      // Modo real — TODO: chamar API de venda quando disponível
      this.sucesso = `Vendido por ${preco} ouro!`;
      setTimeout(() => (this.sucesso = ''), 2500);
      this.fecharInventarioItem();
    },

    // =====================================================
    // SISTEMA DE BÔNUS GLOBAIS (Armadura + Permanentes + Consumíveis)
    // =====================================================

    /**
     * Retorna o valor total de bônus de um determinado tipo.
     * Tipos: 'xp_leitura' | 'xp_estudo' | 'xp_missao' | 'resistencia'
     *        | 'protecao' | 'penalidade_quiz'
     */
    getBonusAtivo(tipo) {
      let total = 0;
      // 1. Bônus de armadura equipada
      for (const slot of (this.ARMADURA_DEUS_SLOTS || [])) {
        if (this.getItemEquipadoSlot(slot.id)) {
          const ef = this.ARMADURA_EFEITOS?.[slot.id];
          if (ef && ef.tipo === tipo) total += ef.valor;
        }
      }
      // 2. Bônus de itens permanentes equipados
      for (const linha of (this.inventario || [])) {
        if (linha.equipado && linha.itens?.tipo === 'permanente' && linha.itens?.efeitos?.[tipo]) {
          total += linha.itens.efeitos[tipo];
        }
      }
      // 3. Bônus de consumíveis ativos
      for (const ef of (this.efeitosAtivos || [])) {
        if (ef.itens?.efeitos?.[tipo]) total += ef.itens.efeitos[tipo];
      }
      return total;
    },

    /**
     * Retorna multiplicador de XP para o contexto dado.
     * Ex: getMultiplicadorXP('leitura') → 1.05 se capacete equipado
     */
    getMultiplicadorXP(contexto = 'geral') {
      const bonus = this.getBonusAtivo('xp_' + contexto);
      return 1 + (bonus / 100);
    },

    /**
     * Retorna percentual de redução de penalidade no quiz (0–100).
     * Ex: com escudo → 20 (%)
     */
    getPenalidadeQuizReducao() {
      return Math.abs(this.getBonusAtivo('penalidade_quiz'));
    },

    /**
     * Ao errar no quiz: com escudo da fé, 20% de chance de salvar o coração.
     */
    consumirCoracaoComBônus() {
      const reducao = this.getPenalidadeQuizReducao(); // ex: 20
      const salvo = Math.random() * 100 < reducao;
      if (salvo) {
        this.sucesso = 'Escudo da Fé protegeu seu coração!';
        setTimeout(() => (this.sucesso = ''), 2000);
        return; // não consome
      }
      this.consumirCoracao();
    },

    /** Lista de bônus ativos para exibição rápida */
    listaBonusAtivos() {
      const tipos = ['xp_leitura', 'xp_estudo', 'xp_missao', 'resistencia', 'protecao', 'penalidade_quiz'];
      return tipos
        .map(tipo => ({ tipo, valor: this.getBonusAtivo(tipo) }))
        .filter(b => b.valor !== 0);
    },

    isFrutoDesbloqueado(index) {
      // No modo demo, simular alguns frutos desbloqueados baseado no nível
      const nivel = this.nivel?.nivel || 1;
      // Cada nível desbloqueia mais frutos
      return index < nivel * 2;
    },
    
    getPercentualFruto(index) {
      // Retorna porcentagem do fruto (0-100)
      // No modo demo, simular progresso baseado no nível
      const nivel = this.nivel?.nivel || 1;
      if (index >= nivel * 2) return 0; // Bloqueado
      // Simular progresso variado
      const baseProgress = (index + 1) * 10;
      return Math.min(baseProgress + (nivel * 5), 100);
    },

    getIconeFruto(index) {
      const icones = [
        'bi-heart-fill',      // Amor
        'bi-emoji-smile-fill', // Alegria
        'bi-peace-fill',      // Paz
        'bi-hourglass-split',  // Longanimidade
        'bi-hand-thumbs-up-fill', // Benignidade
        'bi-gift-fill',       // Bondade
        'bi-shield-check-fill', // Fidelidade
        'bi-dove-fill',       // Mansidão
        'bi-lock-fill'        // Domínio próprio
      ];
      return 'bi ' + (icones[index] || 'bi-circle');
    },

    getPosicaoGalho(index) {
      // Função mantida para compatibilidade, mas não usada mais (usamos SVG agora)
      return '';
    },

    getPosicaoFrutoSVG(index) {
      // Posições dos frutos na árvore SVG original (coordenadas no viewBox 1024x1024)
      // Baseado nas posições das folhas verdes claras (maçãs) do SVG original
      const posicoes = [
        { x: 646, y: 604.6 },   // Amor - baseado na primeira folha verde clara
        { x: 754, y: 688.08 },  // Alegria - segunda folha
        { x: 398.35, y: 593.07 }, // Paz - terceira folha
        { x: 331.52, y: 535.27 }, // Longanimidade - quarta folha
        { x: 248.41, y: 711.5 },  // Benignidade - quinta folha
        { x: 465.43, y: 430.07 }, // Bondade - sexta folha
        { x: 380.65, y: 327.94 }, // Fidelidade - sétima folha
        { x: 481.56, y: 223.27 }, // Mansidão - oitava folha
        { x: 538, y: 278.32 }     // Domínio próprio - nona folha
      ];
      return posicoes[index] || { x: 512, y: 512 };
    },

    getAbreviaturaFruto(fruto) {
      // Retorna abreviação do fruto para caber no círculo SVG
      const abreviacoes = {
        'Amor': 'AM',
        'Alegria': 'AL',
        'Paz': 'PZ',
        'Longanimidade': 'LG',
        'Benignidade': 'BN',
        'Bondade': 'BD',
        'Fidelidade': 'FD',
        'Mansidão': 'MS',
        'Domínio próprio': 'DP'
      };
      return abreviacoes[fruto] || fruto.substring(0, 2).toUpperCase();
    },

    toggleFrutoInfo(index) {
      // Pode ser usado para mostrar informações do fruto ao clicar
      const fruto = this.FRUTO_DO_ESPIRITO[index];
      const desbloqueado = this.isFrutoDesbloqueado(index);
      // Aqui você pode adicionar um modal ou tooltip com informações
      console.log(`${fruto} - ${desbloqueado ? 'Desbloqueado' : 'Bloqueado'}`);
    },

    getPosicaoLabelFruto(index) {
      // Posições fixas em % relativas ao .fruto-arvore-wrapper (viewBox 1024×1024).
      // Distribuição: 2 + 3 + 3 + 1 = 9 itens em fileiras, formato que acompanha
      // a copa da árvore (mais estreita no topo, larga no meio, afunilando no fim).
      // O CSS aplica transform: translate(-50%, -50%) para centralizar cada círculo.
      const posicoes = [
        // Fileira 1 — topo da copa, mais estreito (2 itens)
        [38, 13], [62, 13],
        // Fileira 2 — copa larga (3 itens)
        [22, 29], [50, 29], [78, 29],
        // Fileira 3 — copa mais larga (3 itens)
        [20, 45], [50, 45], [80, 45],
        // Fileira 4 — base da copa, acima do tronco (1 item centrado)
        [50, 60],
      ];
      const [left, top] = posicoes[index] || [50, 50];
      return `left: ${left}%; top: ${top}%;`;
    },

    renderizarFrutosSVG() {
      // Renderiza os frutos no SVG após o DOM estar pronto
      const container = document.getElementById('frutos-container');
      if (!container || !this.FRUTO_DO_ESPIRITO) return;
      
      container.innerHTML = '';
      
      this.FRUTO_DO_ESPIRITO.forEach((fruto, index) => {
        const pos = this.getPosicaoFrutoSVG(index);
        const desbloqueado = this.isFrutoDesbloqueado(index);
        const abreviacao = this.getAbreviaturaFruto(fruto);
        
        // Grupo para o fruto (maçã)
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.setAttribute('class', `fruto-grupo ${desbloqueado ? 'desbloqueado' : 'bloqueado'}`);
        grupo.setAttribute('transform', `translate(${pos.x}, ${pos.y}) scale(0.8)`);
        grupo.setAttribute('style', 'cursor: pointer;');
        grupo.setAttribute('title', `${fruto} - ${desbloqueado ? 'Desbloqueado' : 'Bloqueado'}`);
        grupo.addEventListener('click', () => this.toggleFrutoInfo(index));
        
        // Forma de maçã usando o path fornecido
        const maca = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        maca.setAttribute('d', 'M0,-10 C-2.5,-12.5 -4,-15 -4,-18 C-4,-21 -2.5,-22.5 0,-22.5 C2.5,-22.5 4,-21 4,-18 C4,-15 2.5,-12.5 0,-10 Z M-1.5,-10 L-1.5,7 C-1.5,8.5 -0.75,10 0,10 C0.75,10 1.5,8.5 1.5,7 L1.5,-10 Z');
        maca.setAttribute('class', `fruto-maca ${desbloqueado ? 'desbloqueado' : 'bloqueado'}`);
        grupo.appendChild(maca);
        
        // Texto abreviado no centro
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '4');
        text.setAttribute('class', `fruto-svg-texto ${desbloqueado ? '' : 'bloqueado'}`);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('pointer-events', 'none');
        text.setAttribute('font-size', '7');
        text.setAttribute('font-weight', '600');
        text.textContent = abreviacao;
        grupo.appendChild(text);
        
        // Porcentagem abaixo do texto
        const percentual = this.getPercentualFruto(index);
        const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        percentText.setAttribute('x', '0');
        percentText.setAttribute('y', '12');
        percentText.setAttribute('class', `fruto-svg-percentual ${desbloqueado ? '' : 'bloqueado'}`);
        percentText.setAttribute('text-anchor', 'middle');
        percentText.setAttribute('pointer-events', 'none');
        percentText.setAttribute('font-size', '5');
        percentText.setAttribute('font-weight', '500');
        percentText.textContent = `${percentual}/100`;
        grupo.appendChild(percentText);
        
        container.appendChild(grupo);
      });
      
      // Ajustar posições após o DOM ser atualizado
      setTimeout(() => this.ajustarPosicoesFrutos(), 300);
    },
    
    ajustarPosicoesFrutos() {
      // Posições fixas definidas em getPosicaoLabelFruto — nenhum ajuste dinâmico necessário.
    },

    isObraAtiva(index) {
      // No modo demo, simular algumas obras ativas (para demonstração)
      // Em produção, isso viria do progresso do usuário
      return false; // Por padrão, nenhuma obra está ativa
    },
    
    getPercentualObra(index) {
      // Retorna porcentagem da obra (0-100)
      // No modo demo, simular progresso variado
      // Obras ativas têm porcentagem maior
      const ativa = this.isObraAtiva(index);
      if (ativa) {
        return Math.min(50 + (index * 5), 100);
      }
      // Obras inativas têm porcentagem menor
      return Math.min(20 + (index * 3), 50);
    },

    getIconeObra(index) {
      // Ícones temáticos para cada uma das 9 obras agrupadas
      const icones = [
        'bi-fire',            // Imoralidade
        'bi-diamond-half',    // Idolatria
        'bi-eye-fill',        // Feitiçaria
        'bi-x-octagon-fill',  // Ódio
        'bi-arrow-repeat',    // Inveja
        'bi-lightning-fill',  // Ira
        'bi-exclamation-triangle-fill', // Discórdia
        'bi-people-fill',     // Sectarismo
        'bi-cup-fill',        // Excessos
      ];
      return 'bi ' + (icones[index] || 'bi-exclamation-circle-fill');
    },

    getPosicaoObraSVG(index) {
      // 9 obras distribuídas em círculo dentro do coração grande (viewBox 512x512)
      const centroX = 256;
      const centroY = 256;
      const raio = 60;
      const anguloInicial = -Math.PI / 2;
      const anguloPorItem = (2 * Math.PI) / 9; // 9 obras
      const angulo = anguloInicial + (index * anguloPorItem);
      return { x: centroX + raio * Math.cos(angulo), y: centroY + raio * Math.sin(angulo) };
    },

    getPosicaoLabelObra(index) {
      // Posições fixas calibradas para o formato do coração SVG (viewBox 512×512).
      // Distribuição: 2 + 3 + 2 + 2 = 9 itens, sem sobreposição.
      // Valores em % relativos ao .obras-svg-wrapper (quadrado, mesmo tamanho do SVG).
      // O CSS aplica transform: translate(-50%, -50%) para centralizar cada label.
      const posicoes = [
        // Fileira 1 — topo, lobos do coração (2 itens)
        [30, 22], [70, 22],
        // Fileira 2 — meio superior, mais larga (3 itens)
        [16, 38], [50, 38], [84, 38],
        // Fileira 3 — meio inferior (2 itens)
        [28, 56], [72, 56],
        // Fileira 4 — afunilando até a ponta (2 itens)
        [38, 72], [62, 72],
      ];
      const [left, top] = posicoes[index] || [50, 50];
      return `left: ${left}%; top: ${top}%;`;
    },

    renderizarObrasSVG() {
      // Não renderiza corações pequenos - apenas o coração grande centralizado é usado
      // Esta função agora apenas limpa o container, mantendo apenas os labels HTML
      const container = document.getElementById('obras-coracoes-container');
      if (!container) return;
      
      // Limpa o container - não renderiza corações pequenos
      container.innerHTML = '';
      
      // Ajustar posições após o DOM ser atualizado
      setTimeout(() => this.ajustarPosicoesObras(), 300);
    },
    
    ajustarPosicoesObras() {
      // Posições fixas definidas em getPosicaoLabelObra — nenhum ajuste dinâmico necessário.
    },

    // ── Modal "Saiba mais" — lista completa ───────────────────────────────
    abrirInfoListEsp(tipo, index = null) {
      this.infoListEsp.tipo = tipo;
      this.infoListEsp.expandido = index;
      this.infoListEsp.aberto = true;
      // Se um item específico foi solicitado, rola até ele após o Alpine renderizar
      if (index !== null) {
        this.$nextTick(() => {
          const el = document.querySelector('.tesp-acord--aberto');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    fecharInfoListEsp() {
      this.infoListEsp.aberto = false;
      this.infoListEsp.tipo = null;
      this.infoListEsp.expandido = null;
    },
    toggleInfoListItem(index) {
      this.infoListEsp.expandido = this.infoListEsp.expandido === index ? null : index;
    },
    getInfoListDados() {
      return this.infoListEsp.tipo === 'fruto' ? this.TOOLTIPS_FRUTO : this.TOOLTIPS_OBRA;
    },

    // ── Tooltips informativos — Fruto e Obras ──────────────────────────────
    abrirTooltipEsp(tipo, index) {
      const dados = tipo === 'fruto'
        ? this.TOOLTIPS_FRUTO[index]
        : this.TOOLTIPS_OBRA[index];
      if (!dados) return;
      this.tooltipEsp = { aberto: true, tipo, dados };
      document.body.style.overflow = 'hidden';
    },
    fecharTooltipEsp() {
      this.tooltipEsp = { aberto: false, tipo: null, dados: null };
      document.body.style.overflow = '';
    },

    toggleObraInfo(index) {
      const obra = this.OBRAS_DA_CARNE[index];
      const ativa = this.isObraAtiva(index);
      console.log(`${obra} - ${ativa ? 'Ativa' : 'Inativa'}`);
    },

    // ── Seleção customizada com pinos arrastáveis ─────────────────────────

    // Retorna um Range no caret a partir das coordenadas de viewport
    _caretRangeFromXY(x, y) {
      if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
      if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(x, y);
        if (!pos) return null;
        const r = document.createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse(true);
        return r;
      }
      return null;
    },

    // Aplica os endpoints armazenados ao browser e recalcula posições dos pinos.
    // Esta é a única função que constrói a seleção — nunca lê a seleção atual
    // para descobrir o "outro" endpoint.
    _aplicarEAtualizar() {
      const s = this.bibleSelecaoCustom;
      if (!s.sNode || !s.eNode) return;
      try {
        const range = document.createRange();
        // Tenta ordem normal; se eNode vier antes de sNode (pinos cruzados), inverte
        try {
          range.setStart(s.sNode, s.sOff);
          range.setEnd(s.eNode, s.eOff);
        } catch (_) {
          range.setStart(s.eNode, s.eOff);
          range.setEnd(s.sNode, s.sOff);
        }
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (_) { /* nó pode ter sido removido do DOM */ }
      this._recalcularPins();
    },

    // Recalcula apenas as posições visuais dos pinos (lê rects da seleção atual)
    _recalcularPins() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const rects = Array.from(range.getClientRects()).filter(r => r.width > 0);
      if (!rects.length) return;

      const container = document.querySelector('.conteudo-leitura-biblia');
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const st    = container.scrollTop;
      const first = rects[0];
      const last  = rects[rects.length - 1];

      this.bibleSelecaoCustom.pinE.x = first.left - cRect.left;
      this.bibleSelecaoCustom.pinE.y = first.top  - cRect.top + st - 22;
      this.bibleSelecaoCustom.pinE.h = first.height;

      this.bibleSelecaoCustom.pinD.x = last.right - cRect.left;
      this.bibleSelecaoCustom.pinD.y = last.top   - cRect.top + st;
      this.bibleSelecaoCustom.pinD.h = last.height;

      this.bibleSelecaoCustom.ativo = true;
      const pendente = this._extrairSelecaoBiblia();
      if (pendente) this.bibleContextMenu.pendente = pendente;
    },

    // Mantido para compatibilidade com outros fluxos (long-press, right-click)
    _atualizarPinsFromSelection() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        // Não desativa durante arraste — o endpoint está armazenado
        if (!this.bibleSelecaoCustom.arrastando) this.bibleSelecaoCustom.ativo = false;
        return;
      }
      const range = sel.getRangeAt(0);
      // Armazena os endpoints para uso futuro nos drags
      this.bibleSelecaoCustom.sNode = range.startContainer;
      this.bibleSelecaoCustom.sOff  = range.startOffset;
      this.bibleSelecaoCustom.eNode = range.endContainer;
      this.bibleSelecaoCustom.eOff  = range.endOffset;
      this._recalcularPins();
    },

    // Toque/clique no texto → seleciona a palavra e exibe pinos
    iniciarSelecaoBiblia(ev) {
      if (ev.target.closest?.('.nota-link')) { this.onClickConteudoLeitura(ev); return; }

      const point = ev.touches ? ev.touches[0] : ev;
      const cr = this._caretRangeFromXY(point.clientX, point.clientY);
      if (!cr) return;

      const node = cr.startContainer;
      const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      if (!el?.closest?.('.verso-texto')) { this.cancelarSelecaoBiblia(); return; }

      // Expande para a palavra inteira
      const txt = cr.startContainer.textContent || '';
      let s = cr.startOffset, e = cr.startOffset;
      while (s > 0 && !/[\s,.;:!?()"""'']/u.test(txt[s - 1])) s--;
      while (e < txt.length && !/[\s,.;:!?()"""'']/u.test(txt[e])) e++;
      if (s >= e) e = Math.min(s + 1, txt.length);

      // Armazena endpoints ANTES de criar a seleção no browser
      const sc = this.bibleSelecaoCustom;
      sc.sNode = cr.startContainer; sc.sOff = s;
      sc.eNode = cr.startContainer; sc.eOff = e;
      this._aplicarEAtualizar();
    },

    // Inicia o arraste de um pino.
    // Usa window-level listeners (não perde evento fora do elemento transformado).
    // Reaplica imediatamente a seleção armazenada, pois o touchstart pode tê-la limpo.
    onArrastePinStart(tipo, ev) {
      ev.preventDefault();
      ev.stopPropagation();
      this.bibleSelecaoCustom.arrastando = tipo;

      // Garante que a seleção visual ainda aparece mesmo se o browser a limpou no touchstart
      this._aplicarEAtualizar();

      const onMove = (e) => {
        e.preventDefault();
        const p = e.touches ? e.touches[0] : e;
        this._moverPin(tipo, p.clientX, p.clientY);
      };
      const onEnd = () => {
        this.bibleSelecaoCustom.arrastando = null;
        window.removeEventListener('touchmove', onMove, { capture: true });
        window.removeEventListener('touchend',  onEnd);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onEnd);
      };
      window.addEventListener('touchmove', onMove, { passive: false, capture: true });
      window.addEventListener('touchend',  onEnd);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onEnd);
    },

    // Move um pino usando os endpoints ARMAZENADOS — nunca consulta o outro endpoint via browser.
    _moverPin(tipo, clientX, clientY) {
      const cr = this._caretRangeFromXY(clientX, clientY);
      if (!cr) return;

      const node = cr.startContainer;
      const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      if (!el?.closest?.('.conteudo-leitura-biblia')) return;

      const sc = this.bibleSelecaoCustom;
      if (tipo === 'E') {
        sc.sNode = cr.startContainer;
        sc.sOff  = cr.startOffset;
      } else {
        sc.eNode = cr.startContainer;
        sc.eOff  = cr.startOffset;
      }
      // Aplica a seleção com ambos os endpoints (o que foi movido + o que ficou parado)
      this._aplicarEAtualizar();
    },

    // Confirma a seleção e abre o menu de anotação.
    // Usa o `pendente` já armazenado (setado a cada _recalcularPins) para não
    // depender do window.getSelection que pode ter sido limpo ao tocar no botão OK.
    confirmarSelecaoBiblia() {
      // 1) Tenta usar o pendente já armazenado durante o drag/seleção
      let pendente = this.bibleContextMenu.pendente;

      // 2) Fallback: reaplica a seleção dos endpoints armazenados e extrai
      if (!pendente) {
        this._aplicarEAtualizar();
        pendente = this._extrairSelecaoBiblia();
      }

      if (!pendente) { this.cancelarSelecaoBiblia(); return; }
      this.bibleContextMenu.pendente = pendente;

      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        this._mostrarMenuBiblia(0, 0, true);
      } else {
        // Desktop: posiciona próximo ao pin direito
        const container = document.querySelector('.conteudo-leitura-biblia');
        if (container) {
          const cRect = container.getBoundingClientRect();
          const px = cRect.left + this.bibleSelecaoCustom.pinD.x;
          const py = cRect.top  + this.bibleSelecaoCustom.pinD.y
                     - container.scrollTop + this.bibleSelecaoCustom.pinD.h + 8;
          this._mostrarMenuBiblia(px, py, false);
        } else {
          this._mostrarMenuBiblia(window.innerWidth / 2, window.innerHeight / 2, false);
        }
      }
    },

    // Cancela a seleção e fecha tudo
    cancelarSelecaoBiblia() {
      window.getSelection()?.removeAllRanges();
      const sc = this.bibleSelecaoCustom;
      sc.ativo = false; sc.arrastando = null;
      sc.sNode = null;  sc.sOff = 0;
      sc.eNode = null;  sc.eOff = 0;
      this.fecharMenuBiblia();
    },

    // Seleciona todo o texto do capítulo carregado
    selecionarTudoBiblia() {
      const container = document.querySelector('.conteudo-leitura-biblia');
      if (!container) return;
      const range = document.createRange();
      range.selectNodeContents(container);
      // Armazena endpoints independentes
      const sc = this.bibleSelecaoCustom;
      sc.sNode = range.startContainer; sc.sOff = range.startOffset;
      sc.eNode = range.endContainer;   sc.eOff = range.endOffset;
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      this._atualizarPinsFromSelection();
      if (this.bibleContextMenu.aberto) {
        const p = this._extrairSelecaoBiblia();
        if (p) this.bibleContextMenu.pendente = p;
      }
    },

    // Copia o texto selecionado para a área de transferência
    copiarSelecao() {
      const p = this.bibleContextMenu.pendente;
      if (!p) return;
      navigator.clipboard?.writeText(p.text).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = p.text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      });
      this.fecharMenuBiblia();
      this.cancelarSelecaoBiblia();
    },

    // ── Tamanho da fonte da Bíblia ────────────────────────────────────────
    aumentarFonte() {
      this.fonteTamanhoBiblia = Math.min(2.0, parseFloat((this.fonteTamanhoBiblia + 0.15).toFixed(2)));
      localStorage.setItem('biblia_fonte', this.fonteTamanhoBiblia);
    },
    diminuirFonte() {
      this.fonteTamanhoBiblia = Math.max(0.7, parseFloat((this.fonteTamanhoBiblia - 0.15).toFixed(2)));
      localStorage.setItem('biblia_fonte', this.fonteTamanhoBiblia);
    },

    // ── Velocidade de narração ────────────────────────────────────────────
    aumentarVelocidade() {
      this.velocidadeNarracao = Math.min(3.0, parseFloat((this.velocidadeNarracao + 0.25).toFixed(2)));
      localStorage.setItem('biblia_velocidade', this.velocidadeNarracao);
      if (this.narrando) { const i = this._narracaoIdx; this.pararNarracao(); this.narrarCapitulo(i); }
    },
    diminuirVelocidade() {
      this.velocidadeNarracao = Math.max(0.25, parseFloat((this.velocidadeNarracao - 0.25).toFixed(2)));
      localStorage.setItem('biblia_velocidade', this.velocidadeNarracao);
      if (this.narrando) { const i = this._narracaoIdx; this.pararNarracao(); this.narrarCapitulo(i); }
    },

    // ── VLibras ───────────────────────────────────────────────────────────
    ativarVLibras() {
      const btn = document.querySelector('[vw-access-button]');
      if (btn) btn.click();
    },
    // ─────────────────────────────────────────────────────────────────────

    // ── Zoom / Pan ─────────────────────────────────────────────────────────
    _z(tipo) { return tipo === 'obras' ? this.obrasZoom : this.frutoZoom; },

    getZoomStyle(tipo) {
      const z = this._z(tipo);
      const cursor = z.dragging ? 'grabbing' : (z.scale > 1 ? 'grab' : 'default');
      return `transform: translate(${z.tx}px, ${z.ty}px) scale(${z.scale}); transform-origin: center; cursor: ${cursor};`;
    },

    zoomIn(tipo) {
      const z = this._z(tipo);
      z.scale = Math.min(4, parseFloat((z.scale + 0.35).toFixed(2)));
    },

    zoomOut(tipo) {
      const z = this._z(tipo);
      z.scale = Math.max(0.75, parseFloat((z.scale - 0.35).toFixed(2)));
      if (z.scale <= 1) { z.scale = 1; z.tx = 0; z.ty = 0; }
    },

    resetZoom(tipo) {
      const z = this._z(tipo);
      z.scale = 1; z.tx = 0; z.ty = 0;
    },

    startDrag(tipo, e) {
      if (e.button !== 0) return;
      const z = this._z(tipo);
      z.dragging = true;
      z.startX = e.clientX - z.tx;
      z.startY = e.clientY - z.ty;
      e.preventDefault();

      // Listeners no window para capturar drag mesmo fora do elemento transformado
      const onMove = (ev) => {
        if (!z.dragging) return;
        z.tx = ev.clientX - z.startX;
        z.ty = ev.clientY - z.startY;
      };
      const onUp = () => {
        z.dragging = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },

    onDrag(tipo, e) {
      // Mantido para compatibilidade; drag real é tratado pelo window listener em startDrag
      const z = this._z(tipo);
      if (!z.dragging) return;
      z.tx = e.clientX - z.startX;
      z.ty = e.clientY - z.startY;
    },

    stopDrag(tipo) {
      this._z(tipo).dragging = false;
    },

    onWheelZoom(tipo, e) {
      const z = this._z(tipo);
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      z.scale = Math.max(0.75, Math.min(4, parseFloat((z.scale + delta).toFixed(2))));
      if (z.scale <= 1) { z.scale = 1; z.tx = 0; z.ty = 0; }
    },
    // ───────────────────────────────────────────────────────────────────────

    // ═══════════════════════════════════════════════════════════════════════
    // NÍVEIS DE ACESSO
    // ═══════════════════════════════════════════════════════════════════════

    isAdmin() {
      return this.modoAdmin || this.perfil?.role === 'admin';
    },

    // Autenticação do admin
    autenticarAdmin() {
      if (this.adminSenha === 'iddqd') {
        this.adminAutenticado = true;
        this.adminSenha = '';
        this.adminSenhaErro = '';
        this.modoAdmin = true;
        if (this.perfil) {
          this.perfil = { ...this.perfil, role: 'admin', nome: this.perfil?.nome || 'Admin' };
        }
      } else {
        this.adminSenhaErro = 'Senha incorreta';
        this.adminSenha = '';
        setTimeout(() => (this.adminSenhaErro = ''), 3000);
      }
    },

    // Entra em modo admin demo (mantido para compatibilidade)
    entrarModoAdminDemo() {
      this.adminAutenticado = true;
      this.modoAdmin = true;
      this.perfil = { ...this.perfil, role: 'admin', nome: this.perfil?.nome || 'Admin Demo' };
      window.location.hash = 'admin';
    },

    sairModoAdmin() {
      this.adminAutenticado = false;
      this.modoAdmin = false;
      this.adminSenha = '';
      this.adminSenhaErro = '';
      if (this.perfil) this.perfil = { ...this.perfil, role: 'user' };
      window.location.hash = 'home';
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIRMAÇÃO UNIVERSAL
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Abre o modal de confirmação.
     * @param {object} opts
     *   titulo, msg, detalhe?, tipo ('perigo'|'aviso'|'info'|'sucesso'),
     *   icone?, labelOk?, labelCancelar?, acao (função callback)
     */
    pedirConfirmacao(opts) {
      const defaults = {
        tipo: 'perigo',
        icone: 'bi-exclamation-triangle-fill',
        labelOk: 'Sim, confirmar',
        labelCancelar: 'Cancelar',
        detalhe: '',
      };
      // Ícone padrão por tipo
      if (!opts.icone) {
        opts.icone = {
          perigo: 'bi-exclamation-triangle-fill',
          aviso: 'bi-exclamation-circle-fill',
          info: 'bi-info-circle-fill',
          sucesso: 'bi-check-circle-fill',
        }[opts.tipo] || 'bi-question-circle-fill';
      }
      this.modalConfirm = {
        ...defaults,
        ...opts,
        aberto: true,
        _acao: opts.acao || null,
      };
    },

    /** Executa a ação confirmada e fecha o modal. */
    executarConfirmacao() {
      const fn = this.modalConfirm._acao;
      this.modalConfirm = { ...this.modalConfirm, aberto: false, _acao: null };
      if (typeof fn === 'function') fn();
    },

    /** Fecha sem executar. */
    cancelarConfirmacao() {
      this.modalConfirm = { ...this.modalConfirm, aberto: false, _acao: null };
    },

    // ═══════════════════════════════════════════════════════════════════════
    // EXCLUIR CONTA
    // ═══════════════════════════════════════════════════════════════════════

    async excluirConta() {
      if (this.modoDemo) {
        // Demo: limpa localStorage e retorna à tela de login
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('demo_') || k.startsWith('progresso') || k.startsWith('notas_') || k.startsWith('marcacoes_')) {
            localStorage.removeItem(k);
          }
        });
        this.modoDemo = false;
        this.modoAdmin = false;
        this.usuario = null;
        this.perfil = null;
        this.nivel = null;
        this.moeda = null;
        this.inventario = [];
        this.feedPosts = [];
        this.modalExcluirConta = { aberto: false };
        window.location.hash = 'login';
        return;
      }
      // Modo real — limpa todos os dados do usuário no Supabase
      try {
        this.carregando = true;
        // Aqui chamaríamos a API para deletar a conta — implementar com Supabase
        await sair();
        window.location.hash = 'login';
      } catch (e) {
        this.erro = 'Não foi possível excluir a conta. Tente novamente.';
      } finally {
        this.carregando = false;
        this.modalExcluirConta = { aberto: false };
      }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CONQUISTAS — Persistência e Toast
    // ═══════════════════════════════════════════════════════════════════════

    _carregarConquistasNotificadas() {
      try {
        const raw = localStorage.getItem('conquistas_notificadas');
        this.conquistasNotificadas = raw ? JSON.parse(raw) : [];
      } catch { this.conquistasNotificadas = []; }
    },

    verificarNovasConquistas() {
      this._carregarConquistasNotificadas();
      const todas = this.conquistas();
      const novas = todas.filter(c => c.conquistado && !this.conquistasNotificadas.includes(c.titulo));
      if (novas.length === 0) return;
      // Notificar a primeira nova
      const nova = novas[0];
      this.toastConquista = nova;
      this.conquistasNotificadas = [...this.conquistasNotificadas, nova.titulo];
      try { localStorage.setItem('conquistas_notificadas', JSON.stringify(this.conquistasNotificadas)); } catch {}
      // Recompensar com XP e ouro
      if (this.modoDemo) {
        this.nivel = { ...this.nivel, xp_total: (this.nivel?.xp_total || 0) + 50 };
        this.moeda = { ...this.moeda, ouro: (this.moeda?.ouro || 0) + 10 };
      }
      // Dispensar após 4s
      setTimeout(() => { this.toastConquista = null; }, 4000);
      // Verificar próxima após 5s
      if (novas.length > 1) setTimeout(() => this.verificarNovasConquistas(), 5000);
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN — Helpers e CRUD
    // ═══════════════════════════════════════════════════════════════════════

    adminGetItens() {
      const busca = this.adminBusca.toLowerCase();
      return (this.itensLoja || []).filter(i =>
        !busca || (i.nome || '').toLowerCase().includes(busca) || (i.tipo || '').includes(busca)
      );
    },

    adminGetMissoes() {
      const busca = this.adminBusca.toLowerCase();
      return (this.modelosMissoes || []).filter(m =>
        !busca || (m.titulo || '').toLowerCase().includes(busca)
      );
    },

    adminGetUsuarios() {
      // Demo: array com o usuário atual
      const u = [
        {
          id: this.usuario?.id || 'demo',
          nome: (this.perfil?.nome || 'Demo') + ' ' + (this.perfil?.sobrenome || ''),
          email: this.usuario?.email || 'demo@biblia.app',
          nivel: this.nivel?.nivel || 1,
          xp: this.nivel?.xp_total || 0,
          ouro: this.moeda?.ouro || 0,
          role: this.perfil?.role || 'user',
          criado_em: '2026-01-01'
        }
      ];
      return u;
    },

    _camposItem() {
      return [
        { key: 'id',              label: 'ID',            tipo: 'text',   required: true  },
        { key: 'nome',            label: 'Nome',          tipo: 'text',   required: true  },
        { key: 'descricao',       label: 'Descrição',     tipo: 'text',   required: false },
        { key: 'tipo',            label: 'Tipo',          tipo: 'select', required: true,
          opcoes: ['consumivel','permanente','armadura'] },
        { key: 'raridade',        label: 'Raridade',      tipo: 'select', required: true,
          opcoes: ['comum','raro','epico','lendario']   },
        { key: 'slot',            label: 'Slot (armadura)',tipo:'text',   required: false },
        { key: 'icone',           label: 'Ícone Bootstrap',tipo:'text',  required: false },
        { key: 'preco_ouro',      label: 'Preço (ouro)',  tipo: 'number', required: true  },
        { key: 'nivel_requerido', label: 'Nível mínimo',  tipo: 'number', required: false },
        { key: 'duracao_minutos', label: 'Duração (min)', tipo: 'number', required: false },
      ];
    },

    _camposMissao() {
      return [
        { key: 'id',               label: 'ID',          tipo: 'text',   required: true  },
        { key: 'titulo',           label: 'Título',      tipo: 'text',   required: true  },
        { key: 'subtitulo',        label: 'Subtítulo',   tipo: 'text',   required: false },
        { key: 'tipo',             label: 'Tipo',        tipo: 'select', required: true,
          opcoes: ['diaria','semanal','unica','cooperativa'] },
        { key: 'recompensa_xp',    label: 'Recompensa XP',  tipo: 'number', required: true  },
        { key: 'recompensa_ouro',  label: 'Recompensa Ouro',tipo: 'number', required: true  },
        { key: 'prazo_dias',       label: 'Prazo (dias)',    tipo: 'number', required: false },
        { key: 'descricao',        label: 'Descrição',   tipo: 'text',   required: false },
      ];
    },

    adminAbrirModal(tipo, modo, dadosIniciais) {
      const campos = tipo === 'item' ? this._camposItem() : this._camposMissao();
      const dados = { ...dadosIniciais };
      this.adminModal = { aberto: true, modo, tipo, dados, campos };
    },

    adminFecharModal() {
      this.adminModal = { aberto: false, modo: 'add', tipo: null, dados: {}, campos: [] };
    },

    adminSalvarRegistro() {
      const { tipo, modo, dados } = this.adminModal;
      if (tipo === 'item') {
        const item = {
          ...dados,
          preco_ouro: Number(dados.preco_ouro) || 0,
          nivel_requerido: Number(dados.nivel_requerido) || 1,
          duracao_minutos: dados.duracao_minutos ? Number(dados.duracao_minutos) : undefined,
        };
        if (modo === 'add') {
          this.itensLoja = [...(this.itensLoja || []), item];
        } else {
          this.itensLoja = (this.itensLoja || []).map(i => i.id === item.id ? item : i);
        }
        if (this.modoDemo) {
          try { localStorage.setItem('admin_itens', JSON.stringify(this.itensLoja)); } catch {}
        }
      } else if (tipo === 'missao') {
        const missao = {
          ...dados,
          recompensa_xp: Number(dados.recompensa_xp) || 0,
          recompensa_ouro: Number(dados.recompensa_ouro) || 0,
        };
        if (modo === 'add') {
          this.modelosMissoes = [...(this.modelosMissoes || []), missao];
        } else {
          this.modelosMissoes = (this.modelosMissoes || []).map(m => m.id === missao.id ? missao : m);
        }
        if (this.modoDemo) {
          try { localStorage.setItem('admin_missoes', JSON.stringify(this.modelosMissoes)); } catch {}
        }
      }
      this.adminFecharModal();
      this.sucesso = 'Registro salvo com sucesso!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    adminIniciarDelete(tipo, id, nome) {
      // Usa o modal de confirmação universal para maior consistência
      this.adminDelConfirm = { aberto: false, tipo, id, nome };
      this.pedirConfirmacao({
        titulo: 'Excluir registro?',
        msg: 'Esta ação não pode ser desfeita. O item será removido permanentemente.',
        detalhe: nome,
        tipo: 'perigo',
        icone: 'bi-trash3-fill',
        labelOk: 'Excluir permanentemente',
        labelCancelar: 'Cancelar',
        acao: () => this.adminConfirmarDelete(),
      });
    },

    adminConfirmarDelete() {
      const { tipo, id } = this.adminDelConfirm || {};
      if (tipo === 'item') {
        this.itensLoja = (this.itensLoja || []).filter(i => i.id !== id);
        if (this.modoDemo) {
          try { localStorage.setItem('admin_itens', JSON.stringify(this.itensLoja)); } catch {}
        }
      } else if (tipo === 'missao') {
        this.modelosMissoes = (this.modelosMissoes || []).filter(m => m.id !== id);
        if (this.modoDemo) {
          try { localStorage.setItem('admin_missoes', JSON.stringify(this.modelosMissoes)); } catch {}
        }
      }
      this.adminDelConfirm = { aberto: false, tipo: null, id: null, nome: '' };
      this.sucesso = 'Excluído com sucesso!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    // Export JSON
    adminExportarJSON(tipo) {
      let dados, nomeArq;
      if (tipo === 'itens')   { dados = this.itensLoja || [];        nomeArq = 'itens_loja.json'; }
      else if (tipo === 'missoes') { dados = this.modelosMissoes || []; nomeArq = 'missoes.json'; }
      else if (tipo === 'conquistas') {
        dados = (this.conquistas ? this.conquistas() : []).map(c => ({
          titulo: c.titulo, desc: c.desc, icone: c.icone, cor: c.cor, conquistado: c.conquistado
        }));
        nomeArq = 'conquistas.json';
      } else if (tipo === 'usuarios') { dados = this.adminGetUsuarios(); nomeArq = 'usuarios.json'; }
      else return;
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nomeArq; a.click();
      URL.revokeObjectURL(url);
    },

    // Export CSV
    adminExportarCSV(tipo) {
      let dados = [];
      let nomeArq = 'export.csv';
      if (tipo === 'itens')        { dados = this.itensLoja || [];          nomeArq = 'itens_loja.csv'; }
      else if (tipo === 'missoes') { dados = this.modelosMissoes || [];      nomeArq = 'missoes.csv'; }
      else if (tipo === 'usuarios'){ dados = this.adminGetUsuarios();         nomeArq = 'usuarios.csv'; }
      if (!dados.length) return;
      const cabecalho = Object.keys(dados[0]).join(';');
      const linhas    = dados.map(r => Object.values(r).map(v =>
        typeof v === 'string' && v.includes(';') ? `"${v}"` : (v ?? '')
      ).join(';'));
      const csv = [cabecalho, ...linhas].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = nomeArq; a.click();
      URL.revokeObjectURL(url);
    },

    // Template CSV download
    adminBaixarTemplateCSV(tipo) {
      const templates = {
        itens: 'id;nome;descricao;tipo;raridade;slot;icone;preco_ouro;nivel_requerido\nexemplo-id;Bíblia;A Palavra de Deus;permanente;epico;;bi-book-fill;50;1',
        missoes: 'id;titulo;subtitulo;tipo;recompensa_xp;recompensa_ouro;prazo_dias\nexemplo-missao;Ler João 1;Novo Testamento;diaria;30;5;1',
      };
      const conteudo = templates[tipo] || '';
      const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `template_${tipo}.csv`; a.click();
      URL.revokeObjectURL(url);
    },

    // Import JSON ou CSV
    adminImportar(tipo, evento) {
      this.adminImportErro = '';
      const file = evento.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const conteudo = e.target.result;
        try {
          let dados;
          if (file.name.endsWith('.json')) {
            dados = JSON.parse(conteudo);
            if (!Array.isArray(dados)) throw new Error('JSON deve ser um array.');
          } else {
            // CSV parsing simples
            const linhas = conteudo.split('\n').filter(l => l.trim());
            if (linhas.length < 2) throw new Error('CSV precisa de pelo menos 1 linha de dados.');
            const cabecalho = linhas[0].split(';').map(c => c.trim().replace(/^\uFEFF/, ''));
            dados = linhas.slice(1).map(linha => {
              const vals = linha.split(';');
              const obj = {};
              cabecalho.forEach((k, i) => { obj[k] = vals[i]?.trim() || ''; });
              return obj;
            });
          }
          if (tipo === 'itens') {
            this.itensLoja = [...(this.itensLoja || []), ...dados];
            if (this.modoDemo) { try { localStorage.setItem('admin_itens', JSON.stringify(this.itensLoja)); } catch {} }
          } else if (tipo === 'missoes') {
            this.modelosMissoes = [...(this.modelosMissoes || []), ...dados];
            if (this.modoDemo) { try { localStorage.setItem('admin_missoes', JSON.stringify(this.modelosMissoes)); } catch {} }
          }
          this.sucesso = `${dados.length} registro(s) importado(s)!`;
          setTimeout(() => (this.sucesso = ''), 3000);
        } catch (err) {
          this.adminImportErro = 'Erro na importação: ' + err.message;
        }
      };
      reader.readAsText(file, 'UTF-8');
      evento.target.value = ''; // reset input
    },

    // ═══════════════════════════════════════════════════════════════════════
    // FEED / COMUNIDADE
    // ═══════════════════════════════════════════════════════════════════════

    carregarFeed() {
      if (this.feedCarregando) return;
      this.feedCarregando = true;
      try {
        const raw = localStorage.getItem('feed_posts');
        const salvos = raw ? JSON.parse(raw) : [];
        if (!salvos.length) {
          // Posts de exemplo para demo
          this.feedPosts = [
            {
              id: 'post-1', autor: 'Maria S.', avatar: '',
              versiculos: [{ label: 'Filipenses 4.13', livro: 'PHP', cap: 4, ver: 13 }],
              versiculo: 'Fl 4.13',
              comentarios: [
                { id: 'cmt-1', autor: 'Pedro A.', avatar: '', texto: 'Amém! Que Deus continue te abençoando!', data: new Date(Date.now() - 600000).toISOString() }
              ],
              texto: 'Tudo posso naquele que me fortalece! Que dia abençoado hoje.',
              curtidas: 12, curtidoPor: [], compartilhamentos: 1, data: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 'post-2', autor: 'João P.', avatar: '',
              versiculos: [{ label: 'Salmos 23.1', livro: 'PSA', cap: 23, ver: 1 }],
              versiculo: 'Sl 23.1',
              comentarios: [],
              texto: 'O SENHOR é o meu pastor; nada me faltará. Meditando nisso hoje pela manhã.',
              curtidas: 8, curtidoPor: [], compartilhamentos: 0, data: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 'post-3', autor: 'Ana L.', avatar: '',
              versiculos: [{ label: 'João 3.16', livro: 'JHN', cap: 3, ver: 16 }],
              versiculo: 'Jo 3.16',
              comentarios: [],
              texto: 'Porque Deus amou o mundo de tal maneira... Que amor incomparável!',
              curtidas: 24, curtidoPor: [], compartilhamentos: 2, data: new Date(Date.now() - 86400000).toISOString()
            },
          ];
        } else {
          this.feedPosts = salvos;
        }
      } catch { this.feedPosts = []; }
      this.feedCarregando = false;
    },

    // ── Abre o modal de publicar, opcionalmente pré-preenchendo versículos
    abrirFeedModal(opts = {}) {
      this.feedRascunho = {
        texto: opts.texto || '',
        versiculos: opts.versiculos ? [...opts.versiculos] : [],
      };
      this.feedVersSel = { livro: opts.livro || (this.livroSelecionado || ''), cap: opts.cap || (this.capituloSelecionado || 1), ver: opts.ver || 1 };
      this.feedModalAberto = true;
    },

    // ── Adiciona um versículo ao rascunho
    feedAdicionarVersiculo() {
      const { livro, cap, ver } = this.feedVersSel;
      if (!livro) return;
      const livroObj = (this.livrosBiblia || []).find(l => l.codigo === livro);
      const nomeLivro = livroObj?.nome || livro;
      const label = `${nomeLivro} ${cap}.${ver}`;
      // Evita duplicata
      if (this.feedRascunho.versiculos.some(v => v.label === label)) return;
      this.feedRascunho = {
        ...this.feedRascunho,
        versiculos: [...this.feedRascunho.versiculos, { label, livro, cap, ver }],
      };
    },

    // ── Remove um versículo do rascunho
    feedRemoverVersiculo(label) {
      this.feedRascunho = {
        ...this.feedRascunho,
        versiculos: this.feedRascunho.versiculos.filter(v => v.label !== label),
      };
    },

    // ── Publica o devocional
    publicarNoFeed() {
      const texto = (this.feedRascunho?.texto || '').trim();
      if (!texto) return;
      const autorNome = ((this.perfil?.nome || 'Usuário') + ' ' + (this.perfil?.sobrenome || '')).trim();
      const post = {
        id: 'post-' + Date.now(),
        autor: autorNome,
        avatar: this.perfil?.config_avatar?.emoji || '',
        versiculos: [...(this.feedRascunho.versiculos || [])],
        versiculo: (this.feedRascunho.versiculos || []).map(v => v.label).join(' · '), // compat
        texto,
        curtidas: 0,
        curtidoPor: [],
        comentarios: [],
        data: new Date().toISOString(),
        compartilhamentos: 0,
      };
      this.feedPosts = [post, ...this.feedPosts];
      this.feedRascunho = { texto: '', versiculos: [] };
      this.feedModalAberto = false;
      try { localStorage.setItem('feed_posts', JSON.stringify(this.feedPosts)); } catch {}
    },

    // ── Compartilhar versículo selecionado como devocional
    compartilharVersiculoComoDevocional() {
      const pendente = this.bibleContextMenu?.pendente;
      if (!pendente) return;
      const livroObj = (this.livrosBiblia || []).find(l => l.codigo === this.livroSelecionado);
      const nomeLivro = livroObj?.nome || this.livroSelecionado;
      const label = `${nomeLivro} ${this.capituloSelecionado}.${pendente.verse || 1}`;
      const textoVers = (pendente.text || '').trim();
      // Limpar seleção antes de navegar
      this.fecharMenuBiblia();
      this.bibleSelecaoCustom.ativo = false;
      if (window.getSelection) window.getSelection().removeAllRanges();
      this.abrirFeedModal({
        texto: `"${textoVers}"`,
        versiculos: [{ label, livro: this.livroSelecionado, cap: this.capituloSelecionado, ver: pendente.verse || 1 }],
        livro: this.livroSelecionado,
        cap: this.capituloSelecionado,
        ver: pendente.verse || 1,
      });
      window.location.hash = 'feed';
    },

    curtirPost(postId) {
      const uid = this.usuario?.id || 'demo';
      this.feedPosts = this.feedPosts.map(p => {
        if (p.id !== postId) return p;
        const jaCurtiu = (p.curtidoPor || []).includes(uid);
        return {
          ...p,
          curtidas: jaCurtiu ? p.curtidas - 1 : p.curtidas + 1,
          curtidoPor: jaCurtiu
            ? p.curtidoPor.filter(u => u !== uid)
            : [...(p.curtidoPor || []), uid]
        };
      });
      try { localStorage.setItem('feed_posts', JSON.stringify(this.feedPosts)); } catch {}
    },

    // ── Toggle da seção de comentários
    toggleComentarios(postId) {
      this.feedComentariosAbertos = {
        ...this.feedComentariosAbertos,
        [postId]: !this.feedComentariosAbertos[postId],
      };
    },

    // ── Publicar comentário
    publicarComentario(postId) {
      const texto = (this.feedNovoComentario[postId] || '').trim();
      if (!texto) return;
      const autorNome = ((this.perfil?.nome || 'Usuário') + ' ' + (this.perfil?.sobrenome || '')).trim();
      const comentario = {
        id: 'cmt-' + Date.now(),
        autor: autorNome,
        avatar: this.perfil?.config_avatar?.emoji || '',
        texto,
        data: new Date().toISOString(),
      };
      this.feedPosts = this.feedPosts.map(p => {
        if (p.id !== postId) return p;
        return { ...p, comentarios: [...(p.comentarios || []), comentario] };
      });
      this.feedNovoComentario = { ...this.feedNovoComentario, [postId]: '' };
      try { localStorage.setItem('feed_posts', JSON.stringify(this.feedPosts)); } catch {}
    },

    // ═══════════════════════════════════════════════════════════════════════
    // APOLOGÉTICA
    // ═══════════════════════════════════════════════════════════════════════

    carregarProgressoApologetica() {
      try {
        const raw = localStorage.getItem('apol_progresso');
        if (raw) {
          this.apolPerguntasEstudadas = JSON.parse(raw);
        } else {
          this.apolPerguntasEstudadas = [];
        }
        this.atualizarProgressoApologetica();
      } catch (err) {
        console.error('Erro ao carregar progresso de apologética:', err);
        this.apolPerguntasEstudadas = [];
      }
    },

    atualizarProgressoApologetica() {
      const progresso = {};
      CATEGORIAS_APOLOGETICA.forEach(cat => {
        const perguntasCat = PERGUNTAS_APOLOGETICA.filter(p => p.categoria === cat.id);
        const estudadas = perguntasCat.filter(p => this.apolPerguntasEstudadas.includes(p.id));
        progresso[cat.id] = {
          total: perguntasCat.length,
          estudadas: estudadas.length,
          percentual: perguntasCat.length > 0 ? Math.round((estudadas.length / perguntasCat.length) * 100) : 0,
        };
      });
      this.apolProgresso = progresso;
    },

    marcarPerguntaEstudada(perguntaId) {
      if (!this.apolPerguntasEstudadas.includes(perguntaId)) {
        this.apolPerguntasEstudadas.push(perguntaId);
        try {
          localStorage.setItem('apol_progresso', JSON.stringify(this.apolPerguntasEstudadas));
        } catch {}
        this.atualizarProgressoApologetica();
        // Nota: XP pode ser adicionado via sistema de missões ou outras atividades
      }
    },

    perguntasFiltradas() {
      let filtradas = PERGUNTAS_APOLOGETICA;
      // Filtro por categoria
      if (this.apolCategoriaSelecionada) {
        filtradas = filtradas.filter(p => p.categoria === this.apolCategoriaSelecionada);
      }
      // Filtro por busca
      if (this.apolBusca.trim()) {
        const busca = this.apolBusca.toLowerCase();
        filtradas = filtradas.filter(p =>
          p.pergunta.toLowerCase().includes(busca) ||
          p.resposta.toLowerCase().includes(busca) ||
          (p.pontosChave || []).some(pc => pc.toLowerCase().includes(busca))
        );
      }
      return filtradas;
    },

    togglePergunta(perguntaId) {
      if (this.apolPerguntaAberta === perguntaId) {
        this.apolPerguntaAberta = null;
      } else {
        this.apolPerguntaAberta = perguntaId;
        this.marcarPerguntaEstudada(perguntaId);
      }
    },

    selecionarCategoria(categoriaId) {
      this.apolCategoriaSelecionada = this.apolCategoriaSelecionada === categoriaId ? null : categoriaId;
      this.apolPerguntaAberta = null; // Fechar pergunta ao trocar categoria
    },

    // ═══════════════════════════════════════════════════════════════════════
    // AMIGOS / COMUNIDADE
    // ═══════════════════════════════════════════════════════════════════════

    carregarAmigos() {
      if (this.amigosCarregando) return;
      this.amigosCarregando = true;
      try {
        const raw = localStorage.getItem('amigos_lista');
        if (raw) {
          this.amigos = JSON.parse(raw);
        } else {
          // Amigos de exemplo para demo
          this.amigos = [
            { id: 'amigo-1', nome: 'Maria S.', sobrenome: '', avatar: '', nivel: 5, online: true, ultimaVez: new Date().toISOString() },
            { id: 'amigo-2', nome: 'Pedro A.', sobrenome: '', avatar: '', nivel: 3, online: false, ultimaVez: new Date(Date.now() - 3600000).toISOString() },
            { id: 'amigo-3', nome: 'Ana C.', sobrenome: '', avatar: '', nivel: 7, online: true, ultimaVez: new Date().toISOString() },
          ];
          localStorage.setItem('amigos_lista', JSON.stringify(this.amigos));
        }
        this.carregarConvites();
        this.carregarMensagens();
      } catch (err) {
        console.error('Erro ao carregar amigos:', err);
        this.amigos = [];
      } finally {
        this.amigosCarregando = false;
      }
    },

    carregarConvites() {
      try {
        const raw = localStorage.getItem('convites_pendentes');
        this.convitesPendentes = raw ? JSON.parse(raw) : [];
        const rawEnviados = localStorage.getItem('convites_enviados');
        this.convitesEnviados = rawEnviados ? JSON.parse(rawEnviados) : [];
      } catch (err) {
        this.convitesPendentes = [];
        this.convitesEnviados = [];
      }
    },

    carregarMensagens() {
      try {
        const raw = localStorage.getItem('chat_mensagens');
        this.chatMensagens = raw ? JSON.parse(raw) : {};
      } catch (err) {
        this.chatMensagens = {};
      }
    },

    buscarAmigos() {
      // Em produção, buscar no banco de dados
      // Por enquanto, mostra lista de exemplo para demo
      this.amigosBusca = 'buscar';
      // Em produção, fazer busca real e mostrar resultados
    },

    enviarConviteAmizade(usuarioId, nomeUsuario) {
      // Verificar se já é amigo
      if (this.amigos.some(a => a.id === usuarioId)) {
        this.erro = 'Este usuário já é seu amigo';
        setTimeout(() => (this.erro = ''), 2000);
        return;
      }
      // Verificar se já enviou convite
      if (this.convitesEnviados.some(c => c.para === usuarioId)) {
        this.erro = 'Convite já enviado para este usuário';
        setTimeout(() => (this.erro = ''), 2000);
        return;
      }
      const convite = {
        id: 'conv-' + Date.now(),
        de: this.usuario?.id || 'demo',
        para: usuarioId,
        nomePara: nomeUsuario,
        data: new Date().toISOString(),
        status: 'pendente',
      };
      this.convitesEnviados.push(convite);
      try {
        localStorage.setItem('convites_enviados', JSON.stringify(this.convitesEnviados));
      } catch {}
      this.sucesso = 'Convite enviado!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    aceitarConvite(conviteId) {
      const convite = this.convitesPendentes.find(c => c.id === conviteId);
      if (!convite) return;
      
      // Adicionar como amigo
      const novoAmigo = {
        id: convite.de,
        nome: convite.nomeDe || 'Usuário',
        sobrenome: '',
        avatar: '',
        nivel: 1,
        online: false,
        ultimaVez: new Date().toISOString(),
      };
      this.amigos.push(novoAmigo);
      
      // Remover convite
      this.convitesPendentes = this.convitesPendentes.filter(c => c.id !== conviteId);
      
      try {
        localStorage.setItem('amigos_lista', JSON.stringify(this.amigos));
        localStorage.setItem('convites_pendentes', JSON.stringify(this.convitesPendentes));
      } catch {}
      
      this.sucesso = 'Amizade aceita!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    recusarConvite(conviteId) {
      this.convitesPendentes = this.convitesPendentes.filter(c => c.id !== conviteId);
      try {
        localStorage.setItem('convites_pendentes', JSON.stringify(this.convitesPendentes));
      } catch {}
    },

    removerAmigo(amigoId) {
      this.pedirConfirmacao({
        titulo: 'Remover amigo?',
        msg: 'Esta ação não pode ser desfeita.',
        detalhe: 'Você perderá o acesso ao chat e às missões compartilhadas com este amigo.',
        tipo: 'perigo',
        icone: 'bi-person-x-fill',
        labelOk: 'Remover',
        acao: () => {
          this.amigos = this.amigos.filter(a => a.id !== amigoId);
          // Fechar chat se estiver aberto
          if (this.chatAberto === amigoId) {
            this.chatAberto = null;
          }
          if (this.chatRapidoAmigo?.id === amigoId) {
            this.chatRapidoAberto = false;
            this.chatRapidoAmigo = null;
          }
          try {
            localStorage.setItem('amigos_lista', JSON.stringify(this.amigos));
            // Remover mensagens do chat
            delete this.chatMensagens[amigoId];
            localStorage.setItem('chat_mensagens', JSON.stringify(this.chatMensagens));
          } catch {}
          this.sucesso = 'Amigo removido';
          setTimeout(() => (this.sucesso = ''), 2000);
        },
      });
    },

    abrirChat(amigoId) {
      this.chatAberto = amigoId;
      if (!this.chatMensagens[amigoId]) {
        this.chatMensagens[amigoId] = [];
      }
      // Scroll para última mensagem
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-mensagens-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    },

    abrirChatRapido(amigo) {
      this.chatRapidoAberto = true;
      this.chatRapidoAmigo = amigo;
      if (!this.chatMensagens[amigo.id]) {
        this.chatMensagens[amigo.id] = [];
      }
    },

    fecharChatRapido() {
      this.chatRapidoAberto = false;
      this.chatRapidoAmigo = null;
    },

    enviarMensagem(amigoId) {
      if (!this.chatNovaMensagem.trim()) return;
      
      const mensagem = {
        id: 'msg-' + Date.now(),
        de: this.usuario?.id || 'demo',
        para: amigoId,
        texto: this.chatNovaMensagem.trim(),
        data: new Date().toISOString(),
        lida: false,
      };
      
      if (!this.chatMensagens[amigoId]) {
        this.chatMensagens[amigoId] = [];
      }
      this.chatMensagens[amigoId].push(mensagem);
      
      const textoEnviado = this.chatNovaMensagem.trim();
      this.chatNovaMensagem = '';
      
      try {
        localStorage.setItem('chat_mensagens', JSON.stringify(this.chatMensagens));
      } catch {}
      
      // Scroll para última mensagem (chat completo ou rápido)
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-mensagens-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        const chatRapido = document.querySelector('.chat-rapido-mensagens');
        if (chatRapido) {
          chatRapido.scrollTop = chatRapido.scrollHeight;
        }
      }, 100);
    },

    abrirModalConvidarMissao(missao) {
      this.modalConvidarMissao = {
        aberto: true,
        missao: missao,
        amigosSelecionados: [],
      };
    },

    toggleAmigoSelecionado(amigoId) {
      const idx = this.modalConvidarMissao.amigosSelecionados.indexOf(amigoId);
      if (idx >= 0) {
        this.modalConvidarMissao.amigosSelecionados.splice(idx, 1);
      } else {
        this.modalConvidarMissao.amigosSelecionados.push(amigoId);
      }
    },

    enviarConviteMissao() {
      if (this.modalConvidarMissao.amigosSelecionados.length === 0) {
        this.erro = 'Selecione pelo menos um amigo';
        setTimeout(() => (this.erro = ''), 2000);
        return;
      }
      
      // Em produção, criar missão cooperativa
      // Por enquanto, apenas notificação
      this.sucesso = `Convite enviado para ${this.modalConvidarMissao.amigosSelecionados.length} amigo(s)!`;
      this.modalConvidarMissao = { aberto: false, missao: null, amigosSelecionados: [] };
      setTimeout(() => (this.sucesso = ''), 3000);
    },

    amigosFiltrados() {
      if (!this.amigosBusca.trim()) return this.amigos;
      const busca = this.amigosBusca.toLowerCase();
      return this.amigos.filter(a =>
        (a.nome + ' ' + (a.sobrenome || '')).toLowerCase().includes(busca)
      );
    },

    // ── Recompartilhar (repost simples)
    recompartilharPost(post) {
      const autorNome = ((this.perfil?.nome || 'Usuário') + ' ' + (this.perfil?.sobrenome || '')).trim();
      const novoPost = {
        id: 'post-' + Date.now(),
        autor: autorNome,
        avatar: this.perfil?.config_avatar?.emoji || '',
        versiculos: post.versiculos || [],
        versiculo: post.versiculo || '',
        texto: post.texto,
        curtidas: 0,
        curtidoPor: [],
        comentarios: [],
        compartilhamentos: 0,
        repostDe: { autor: post.autor, data: post.data },
        data: new Date().toISOString(),
      };
      this.feedPosts = [novoPost, ...this.feedPosts];
      try { localStorage.setItem('feed_posts', JSON.stringify(this.feedPosts)); } catch {}
      this.sucesso = 'Recompartilhado!';
      setTimeout(() => (this.sucesso = ''), 2000);
    },

    deletarPost(postId) {
      this.feedPosts = this.feedPosts.filter(p => p.id !== postId);
      try { localStorage.setItem('feed_posts', JSON.stringify(this.feedPosts)); } catch {}
    },

    tempoRelativo(isoString) {
      if (!isoString) return '';
      const diff = Date.now() - new Date(isoString).getTime();
      if (diff < 60000)     return 'agora mesmo';
      if (diff < 3600000)   return Math.floor(diff / 60000) + ' min atrás';
      if (diff < 86400000)  return Math.floor(diff / 3600000) + 'h atrás';
      return Math.floor(diff / 86400000) + 'd atrás';
    },

    VERSAO_TERMOS
  }));
});
