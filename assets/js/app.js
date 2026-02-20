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
import { LIVROS_BIBLIA, obterLivrosAntigoTestamento, obterLivrosNovoTestamento } from './dados/livrosBiblia.js';
import { OPCOES_AVATAAARS } from './dados/opcoesAvataaars.js';
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
import { TRILHAS_ESTUDO, ARMADURA_DEUS_SLOTS, REFS_BIBLICAS, OBRAS_DA_CARNE, FRUTO_DO_ESPIRITO } from './dados/estudoEvangelho.js';

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
    estadoCivilCadastro: '',
    configAvatarCadastro: { ...CONFIG_AVATAR_PADRAO },
    opcoesAvataaars: OPCOES_AVATAAARS,

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
    notaPopup: { aberto: false, id: null, conteudo: '', textoRef: '' },
    narrando: false,

    CORES_MARCADOR: [
      { nome: 'Amarelo', valor: '#fef08a' },
      { nome: 'Laranja', valor: '#fdba74' },
      { nome: 'Verde', valor: '#bbf7d0' },
      { nome: 'Azul', valor: '#bfdbfe' }
    ],

    // Ranking
    ranking: [],
    // Loja
    itensLoja: [],
    filtroLoja: null,
    viewLoja: 'grid',
    modalItemDetalhes: false,
    itemSelecionado: null,

    // Estudo do evangelho
    TRILHAS_ESTUDO,
    ARMADURA_DEUS_SLOTS,
    REFS_BIBLICAS,
    OBRAS_DA_CARNE,
    FRUTO_DO_ESPIRITO,
    viewEstudo: 'trilhas',
    trilhaSelecionadaEstudo: null,
    aulaSelecionadaEstudo: null,
    progressoEstudo: {}, // { [aulaId]: { concluido, quizAprovado }, modulos: { [trilhaId]: true } }
    aulaAtualMarcadaLida: false, // estado reativo do botão toggle (sincronizado ao abrir e ao marcar/desmarcar)
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
      this.pagina = r;
      if (r === 'estudo') {
        this.viewEstudo = 'trilhas';
        this.trilhaSelecionadaEstudo = null;
        this.aulaSelecionadaEstudo = null;
        this.quizEstudoEnviado = false;
        this.quizEstudoNota = null;
        this.carregarProgressoEstudoDemo();
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
        this.consumirCoracao();
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
          this.progressoEstudo[id] = { ...(this.progressoEstudo[id] || {}), quizAprovado: true };
        } else if (this.quizEstudoTipo === 'modulo' && this.trilhaSelecionadaEstudo) {
          this.progressoEstudo.modulos = this.progressoEstudo.modulos || {};
          this.progressoEstudo.modulos[this.trilhaSelecionadaEstudo.id] = true;
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
      this.viewEstudo = 'trilhas';
      this.trilhaSelecionadaEstudo = null;
      this.aulaSelecionadaEstudo = null;
    },
    selecionarAulaEstudo(aula) {
      this.aulaSelecionadaEstudo = aula;
      this.aulaAtualMarcadaLida = !!(aula && this.progressoEstudo[aula.id]?.concluido);
      this.viewEstudo = 'aula';
      this.quizEstudoEnviado = false;
      this.quizEstudoNota = null;
    },
    voltarEstudoAulas() {
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
        this.perfil = dados.perfil || { nome: 'Demo', sobrenome: 'Usuário', config_avatar: { ...CONFIG_AVATAR_PADRAO } };
        this.nivel = dados.nivel || { nivel: 1, xp_total: 50, dias_sequencia: 3 };
        this.moeda = dados.moeda || { ouro: 100 };
        this.coracoes = dados.coracoes || { atual: 5, maximo: 5, proxima_regeneracao: null, tempo_regeneracao_horas: 4 };
        this.efeitosAtivos = dados.efeitosAtivos || [];
        this.inventario = dados.inventario || [];
        this.modelosMissoes = dados.modelosMissoes || [];
        this.itensLoja = dados.itensLoja || [];
        this.ranking = dados.ranking || [];
        this.progressoLeitura = [];
        this.livrosAprovadosQuiz = [];
        // Inicializar variáveis de missões - usar apenas todasMissoes (missoesAtivas foi removido)
        this.todasMissoes = dados.todasMissoes || [];
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
        
        // Inicializar timers após carregar dados do demo
        setTimeout(() => {
          this.reinicializarTimersMissoes();
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

    avancarCadastro() {
      if (this.passoCadastro === 0 && !this.aceiteTermos) {
        this.erro = 'É necessário aceitar os Termos de Uso para continuar.';
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
      this.configAvatarCadastro[campo] = valor;
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
      // Carregar modelos de missões disponíveis (só se não houver filtro de status ou se for null)
      if (this.filtroMissaoStatus === null) {
        this.modelosMissoes = await listarModelosMissoes();
        // Filtrar modelos que o usuário ainda não iniciou
        this.modelosMissoesFiltrados = this.modelosMissoes.filter(mod => {
          if (this.filtroMissaoTipo && mod.tipo !== this.filtroMissaoTipo) return false;
          return true;
        });
      } else {
        this.modelosMissoes = [];
        this.modelosMissoesFiltrados = [];
      }
      // Carregar missões do usuário
      let statusFiltro = this.filtroMissaoStatus;
      if (this.filtroMissaoStatus === 'nao_concluidas') {
        statusFiltro = null; // Buscar todas para filtrar depois
      }
      
      // Para filtro de ativas, garantir que buscamos todas para contar corretamente
      if (this.filtroMissaoStatus === 'ativa') {
        // Primeiro buscar todas as ativas para contar o total
        const { missoes: todasAtivas, total: totalAtivas } = await listarTodasMissoes(
          this.usuario.id,
          'ativa',
          this.filtroMissaoTipo,
          9999,
          0
        );
        this.totalMissoes = totalAtivas || (todasAtivas || []).filter(m => m.status === 'ativa').length;
        
        // Aplicar paginação localmente
        const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
        const fim = inicio + this.limiteMissoes;
        this.missoesFiltradas = (todasAtivas || []).filter(m => m.status === 'ativa').slice(inicio, fim);
        this.todasMissoes = todasAtivas || [];
      } else {
        const { missoes, total } = await listarTodasMissoes(
          this.usuario.id,
          statusFiltro,
          this.filtroMissaoTipo,
          this.limiteMissoes,
          (this.paginaMissoes - 1) * this.limiteMissoes
        );
        this.todasMissoes = missoes || [];
        this.totalMissoes = total || 0;
        
        // Filtrar missões por status se necessário
        if (this.filtroMissaoStatus === 'nao_concluidas') {
          this.missoesFiltradas = this.todasMissoes.filter(m => 
            m.status === 'abandonada' || m.status === 'expirada'
          );
          // Recontar total para paginação - buscar todas e filtrar
          const { missoes: todas } = await listarTodasMissoes(
            this.usuario.id,
            null,
            this.filtroMissaoTipo,
            9999,
            0
          );
          this.totalMissoes = (todas || []).filter(m => 
            m.status === 'abandonada' || m.status === 'expirada'
          ).length;
        } else {
          this.missoesFiltradas = this.todasMissoes;
        }
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
        // FORÇAR: Garantir que todasMissoes está inicializado - se estiver vazio, recarregar do demo
        if (!this.todasMissoes || this.todasMissoes.length === 0) {
          // Tentar recarregar dados do demo se disponível
          if (this.missoesAtivas && this.missoesAtivas.length > 0) {
            this.todasMissoes = this.missoesAtivas;
          } else {
            this.modelosMissoesFiltrados = [];
            this.missoesFiltradas = [];
            this.totalMissoes = 0;
            return;
          }
        }
        
        // Debug: verificar quantas missões existem
        console.log('atualizarFiltrosMissoes - Total missões:', this.todasMissoes.length, 'Filtro status:', this.filtroMissaoStatus, 'Filtro tipo:', this.filtroMissaoTipo);
        console.log('Status das missões:', this.todasMissoes.map(m => ({ id: m.id, status: m.status })));
        
        // Filtrar modelos
        let modelosFiltrados = (this.modelosMissoes || []).filter(mod => {
          if (this.filtroMissaoTipo && mod.tipo !== this.filtroMissaoTipo) return false;
          return true;
        });
        
        // Filtrar missões - sempre usar uma cópia do array original
        // IMPORTANTE: Quando filtro é null (Todos), incluir TODAS as missões sem filtrar por status
        let todasMissoesFiltradas = [...(this.todasMissoes || [])];
        
        // Aplicar filtro de status (apenas se não for null - quando null, mostra todas)
        if (this.filtroMissaoStatus === 'ativa') {
          // Filtrar apenas missões com status 'ativa' - FORÇAR exibição no modo demo
          todasMissoesFiltradas = todasMissoesFiltradas.filter(m => {
            if (!m) return false;
            // No modo demo, sempre mostrar missões com status 'ativa', mesmo que tenham expirado
            return m.status === 'ativa';
          });
          
          // Se não encontrou nenhuma, tentar usar missoesAtivas como fallback
          if (todasMissoesFiltradas.length === 0 && this.missoesAtivas && this.missoesAtivas.length > 0) {
            todasMissoesFiltradas = [...this.missoesAtivas];
          }
          
          // Não mostrar modelos quando filtrando por ativas
          modelosFiltrados = [];
        } else if (this.filtroMissaoStatus === 'concluida') {
          todasMissoesFiltradas = todasMissoesFiltradas.filter(m => m && m.status === 'concluida');
          modelosFiltrados = [];
        } else if (this.filtroMissaoStatus === 'nao_concluidas') {
          todasMissoesFiltradas = todasMissoesFiltradas.filter(m => m && (m.status === 'abandonada' || m.status === 'expirada'));
          modelosFiltrados = [];
        }
        // Se filtroMissaoStatus === null, não filtrar por status - mostrar TODAS as missões
        
        // Aplicar filtro de tipo (sempre, mesmo quando filtro de status é null)
        if (this.filtroMissaoTipo) {
          todasMissoesFiltradas = todasMissoesFiltradas.filter(m => m && m.modelos_missao?.tipo === this.filtroMissaoTipo);
        }
        
        // Quando sem filtro de status: combinar modelos + missões e paginar tudo junto
        if (this.filtroMissaoStatus === null) {
          // IMPORTANTE: Garantir que todas as missões estão incluídas (sem filtro de status)
          // todasMissoesFiltradas já foi filtrada por tipo acima (se necessário), mas não por status
          // Combinar todos os itens (modelos + missões)
          const todosItens = [...modelosFiltrados.map(m => ({ ...m, _tipo: 'modelo' })), ...todasMissoesFiltradas.map(m => ({ ...m, _tipo: 'missao' }))];
          this.totalMissoes = todosItens.length;
          
          // Debug: verificar combinação e paginação
          console.log('Filtro Todos - Modelos:', modelosFiltrados.length, 'Missões:', todasMissoesFiltradas.length, 'Total itens:', todosItens.length);
          console.log('Página:', this.paginaMissoes, 'Limite:', this.limiteMissoes, 'Total páginas:', this.totalPaginasMissoes);
          
          // Aplicar paginação
          const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
          const fim = inicio + this.limiteMissoes;
          const itensPaginados = todosItens.slice(inicio, fim);
          
          console.log('Itens paginados:', itensPaginados.length, 'De', inicio, 'até', fim, 'de', todosItens.length);
          
          // Separar modelos e missões para exibição
          this.modelosMissoesFiltrados = itensPaginados.filter(i => i._tipo === 'modelo').map(i => {
            const { _tipo, ...rest } = i;
            return rest;
          });
          this.missoesFiltradas = itensPaginados.filter(i => i._tipo === 'missao').map(i => {
            const { _tipo, ...rest } = i;
            return rest;
          });
          
          console.log('Exibindo - Modelos:', this.modelosMissoesFiltrados.length, 'Missões:', this.missoesFiltradas.length);
        } else {
          // Com filtro de status: só missões, paginadas normalmente
          this.modelosMissoesFiltrados = [];
          this.totalMissoes = todasMissoesFiltradas.length;
          const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
          const fim = inicio + this.limiteMissoes;
          // FORÇAR: Garantir que pelo menos as missões sejam atribuídas
          this.missoesFiltradas = todasMissoesFiltradas.slice(inicio, fim);
        }
        
        // FORÇAR: Garantir que missoesFiltradas é um array válido e não está vazio quando deveria ter conteúdo
        if (!Array.isArray(this.missoesFiltradas)) {
          this.missoesFiltradas = [];
        }
        
        // FORÇAR: Se o filtro é 'ativa' e não há missões, tentar usar missoesAtivas diretamente
        if (this.filtroMissaoStatus === 'ativa' && this.missoesFiltradas.length === 0) {
          // Tentar todas as fontes possíveis
          let missoesAtivasParaExibir = [];
          
          // 1. Tentar de todasMissoes filtradas
          if (this.todasMissoes && this.todasMissoes.length > 0) {
            missoesAtivasParaExibir = this.todasMissoes.filter(m => m && m.status === 'ativa');
          }
          
          // 2. Se ainda vazio, tentar de missoesAtivas
          if (missoesAtivasParaExibir.length === 0 && this.missoesAtivas && this.missoesAtivas.length > 0) {
            missoesAtivasParaExibir = this.missoesAtivas;
          }
          
          // 3. Se encontrou, aplicar paginação e exibir
          if (missoesAtivasParaExibir.length > 0) {
            const inicio = (this.paginaMissoes - 1) * this.limiteMissoes;
            const fim = inicio + this.limiteMissoes;
            this.missoesFiltradas = missoesAtivasParaExibir.slice(inicio, fim);
            this.totalMissoes = missoesAtivasParaExibir.length;
            this.modelosMissoesFiltrados = [];
          }
        }
        
        // Reinicializar timers após atualizar filtros (modo demo)
        // Usar $nextTick do Alpine.js para garantir que o DOM foi atualizado antes de reinicializar timers
        this.$nextTick(() => {
          setTimeout(() => {
            this.reinicializarTimersMissoes();
          }, 500);
        });
      } else {
        this.carregarMissoes();
      }
    },

    async carregarCapituloBiblia() {
      this.carregandoCapitulo = true;
      this.capituloBiblia = null;
      this.erro = '';
      const dados = await obterCapitulo(this.livroSelecionado, this.capituloSelecionado, 'almeida');
      this.capituloBiblia = dados;
      this.carregandoCapitulo = false;
      this.progressoLeituraScroll = this.percentualCapitulo(this.livroSelecionado, this.capituloSelecionado);
      this.carregarNotacoesCapitulo();
    },

    narrarCapitulo() {
      const verses = (this.capituloBiblia && this.capituloBiblia.verses) || [];
      if (!verses.length || !window.speechSynthesis) return;
      this.narrando = true;
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado);
      const nomeLivro = livro ? livro.nome : this.livroSelecionado;
      const fila = [
        `${nomeLivro} capítulo ${this.capituloSelecionado}.`,
        ...verses.map((v) => `Versículo ${v.verse}. ${v.text || ''}`)
      ];
      let idx = 0;
      const falar = () => {
        if (idx >= fila.length) {
          this.narrando = false;
          return;
        }
        const u = new SpeechSynthesisUtterance(fila[idx]);
        u.lang = 'pt-BR';
        u.rate = 0.9;
        u.onend = () => { idx++; falar(); };
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
      return `notacoes_${uid}_${this.livroSelecionado}_${this.capituloSelecionado}`;
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
      const id = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
      this.notacoesCapitulo.push({ id, type: 'highlight', verse, start, end, text, color });
      this.salvarNotacoesCapitulo();
    },

    adicionarNota(verse, start, end, text, noteContent) {
      const id = 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
      this.notacoesCapitulo.push({ id, type: 'note', verse, start, end, text, noteContent: noteContent || '' });
      this.salvarNotacoesCapitulo();
    },

    removerNotacao(id) {
      this.notacoesCapitulo = this.notacoesCapitulo.filter((n) => n.id !== id);
      this.salvarNotacoesCapitulo();
      this.notaPopup.aberto = false;
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
        else if (n.type === 'note') out += `<span class="nota-link" data-note-id="${esc(n.id)}" tabindex="0" role="button">${segment}</span>`;
        last = n.end;
      }
      if (last < text.length) out += esc(text.slice(last));
      return out;
    },

    onSoltarLeitura(ev) {
      if (this._longPressTimer || this._longPressAcionado) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const elNode = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      const el = elNode && elNode.closest ? elNode.closest('.verso-texto') : null;
      if (!el || !el.contains(range.commonAncestorContainer)) return;
      const verseNum = parseInt(el.getAttribute('data-verse'), 10);
      const pre = range.cloneContents();
      const div = document.createElement('div');
      div.appendChild(pre);
      const selectedText = (div.textContent || '').trim();
      if (!selectedText) return;
      const start = this.offsetEmTexto(el, range.startContainer, range.startOffset);
      const end = this.offsetEmTexto(el, range.endContainer, range.endOffset);
      if (start === undefined || end === undefined) return;
      const [s, e] = start <= end ? [start, end] : [end, start];

      if (this.modoNota) {
        this.modoNota = false;
        this.notaPopup.aberto = true;
        this.notaPopup.id = null;
        this.notaPopup.textoRef = selectedText;
        this.notaPopup.conteudo = '';
        this._pendenteNota = { verse: verseNum, start: s, end: e, text: selectedText };
        sel.removeAllRanges();
        return;
      }

      if (!this.corMarcadorAtiva) return;
      this.adicionarMarcador(verseNum, s, e, selectedText, this.corMarcadorAtiva);
      sel.removeAllRanges();
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
      this._longPressTimer = setTimeout(() => {
        this._longPressTimer = null;
        this._longPressAcionado = true;
        setTimeout(() => (this._longPressAcionado = false), 600);
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        const node = range.commonAncestorContainer;
        const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        const versoEl = el && el.closest ? el.closest('.verso-texto') : null;
        if (!versoEl || !versoEl.contains(range.commonAncestorContainer)) return;
        const verseNum = parseInt(versoEl.getAttribute('data-verse'), 10);
        const div = document.createElement('div');
        div.appendChild(range.cloneContents());
        const selectedText = (div.textContent || '').trim();
        if (!selectedText) return;
        const start = this.offsetEmTexto(versoEl, range.startContainer, range.startOffset);
        const end = this.offsetEmTexto(versoEl, range.endContainer, range.endOffset);
        if (start === undefined || end === undefined) return;
        const [s, e] = start <= end ? [start, end] : [end, start];
        this.notaPopup.aberto = true;
        this.notaPopup.id = null;
        this.notaPopup.textoRef = selectedText;
        this.notaPopup.conteudo = '';
        this._pendenteNota = { verse: verseNum, start: s, end: e, text: selectedText };
      }, 3000);
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
        this.notaPopup.conteudo
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
    },

    fecharNotaPopup() {
      this.notaPopup.aberto = false;
      this.notaPopup.id = null;
      this.notaPopup.conteudo = '';
      this.notaPopup.textoRef = '';
      this._pendenteNota = null;
    },

    salvarEdicaoNota() {
      if (this.notaPopup.id) this.atualizarNota(this.notaPopup.id, this.notaPopup.conteudo);
      else this.salvarNotaPendente();
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
        this.consumirCoracao();
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
      // Mapear slot da armadura para item equipado
      const slotMap = {
        'cinto': 'cintura',
        'peitoral': 'peito',
        'sapato': 'pe',
        'escudo': 'mao',
        'elmo': 'cabeca',
        'espada': 'mao'
      };
      const slotItem = slotMap[slotId] || slotId;
      return (this.inventario || []).find(item => 
        item.equipado && 
        (item.itens?.slot === slotItem || item.itens?.nome?.toLowerCase().includes(slotId))
      )?.itens || null;
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
      // Posições dos labels ajustadas manualmente para evitar TODA sobreposição
      // Espaçamento maior entre badges para garantir visibilidade total
      const posicoes = [
        { top: '60%', left: '65%' },   // Amor - movido para direita
        { top: '68%', right: '22%' },  // Alegria - movido mais para direita
        { top: '59%', left: '36%' },   // Paz - movido para esquerda
        { top: '53%', left: '28%' },   // Longanimidade - movido mais para esquerda
        { top: '70%', left: '20%' },   // Benignidade - movido mais para esquerda
        { top: '43%', left: '42%' },   // Bondade - ajustado
        { top: '33%', left: '34%' },   // Fidelidade - movido para esquerda
        { top: '23%', left: '44%' },   // Mansidão - ajustado
        { top: '28%', left: '49%' }   // Domínio próprio - ajustado
      ];
      const pos = posicoes[index] || { top: '50%', left: '50%' };
      const style = Object.entries(pos).map(([k, v]) => `${k}: ${v}`).join('; ');
      return `${style}; margin: 15px;`;
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
      // Função para evitar sobreposição dos labels dos frutos
      const labels = document.querySelectorAll('.fruto-label-overlay');
      if (labels.length === 0) return;
      
      const padding = 10; // Espaçamento mínimo em pixels
      const labelsArray = Array.from(labels);
      
      labelsArray.forEach((label, index) => {
        let tentativas = 0;
        const maxTentativas = 50;
        let colisao = true;
        
        while (colisao && tentativas < maxTentativas) {
          colisao = false;
          const rect = label.getBoundingClientRect();
          
          labelsArray.forEach((outroLabel, outroIndex) => {
            if (index === outroIndex) return;
            
            const outroRect = outroLabel.getBoundingClientRect();
            
            // Verificar se há sobreposição
            if (!(rect.right + padding < outroRect.left || 
                  rect.left > outroRect.right + padding ||
                  rect.bottom + padding < outroRect.top ||
                  rect.top > outroRect.bottom + padding)) {
              colisao = true;
              
              // Calcular distância e direção
              const dx = outroRect.left - rect.left;
              const dy = outroRect.top - rect.top;
              const distancia = Math.sqrt(dx * dx + dy * dy);
              
              if (distancia < padding * 2) {
                // Mover o label atual para longe
                const container = label.parentElement;
                const containerRect = container.getBoundingClientRect();
                
                const currentTop = parseFloat(label.style.top || '0');
                const currentLeft = parseFloat(label.style.left || '0');
                const currentRight = parseFloat(label.style.right || '0');
                
                // Calcular deslocamento em porcentagem
                const offsetX = (padding * 1.5 / containerRect.width) * 100;
                const offsetY = (padding * 1.5 / containerRect.height) * 100;
                
                // Mover na direção oposta à colisão
                if (Math.abs(dx) > Math.abs(dy)) {
                  // Mover horizontalmente
                  if (label.style.left !== 'auto') {
                    label.style.left = `${Math.max(2, Math.min(98, currentLeft + (dx > 0 ? -offsetX : offsetX)))}%`;
                  } else {
                    label.style.right = `${Math.max(2, Math.min(98, currentRight + (dx > 0 ? offsetX : -offsetX)))}%`;
                  }
                } else {
                  // Mover verticalmente
                  label.style.top = `${Math.max(2, Math.min(98, currentTop + (dy > 0 ? -offsetY : offsetY)))}%`;
                }
              }
            }
          });
          
          tentativas++;
        }
      });
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
      const icones = [
        'bi-x-circle-fill', 'bi-x-circle-fill', 'bi-x-circle-fill',
        'bi-x-circle-fill', 'bi-x-circle-fill', 'bi-x-circle-fill',
        'bi-x-circle-fill', 'bi-x-circle-fill', 'bi-x-circle-fill',
        'bi-x-circle-fill', 'bi-x-circle-fill', 'bi-x-circle-fill',
        'bi-x-circle-fill', 'bi-x-circle-fill', 'bi-x-circle-fill'
      ];
      return 'bi ' + (icones[index] || 'bi-exclamation-circle-fill');
    },

    getPosicaoObraSVG(index) {
      // Posições dos corações centralizados dentro do coração grande (coordenadas no viewBox 512x512)
      // Centro: 256, 256
      // Distribuídos em círculo dentro do coração grande
      const centroX = 256;
      const centroY = 256;
      const raio = 60; // Raio menor para ficar dentro do coração grande
      const anguloInicial = -Math.PI / 2; // Começar do topo
      const anguloPorItem = (2 * Math.PI) / 15; // 15 obras
      
      const angulo = anguloInicial + (index * anguloPorItem);
      const x = centroX + (raio * Math.cos(angulo));
      const y = centroY + (raio * Math.sin(angulo));
      
      return { x, y };
    },

    getPosicaoLabelObra(index) {
      // Posições dos labels ajustadas manualmente para evitar TODA sobreposição
      // Distribuição em múltiplos círculos concêntricos com raios alternados
      const centroX = 50;
      const centroY = 50;
      
      // Usar raios alternados (20, 26, 20, 26...) para criar dois círculos concêntricos
      // Isso garante que labels adjacentes não se sobreponham
      const raioBase = index % 2 === 0 ? 20 : 26;
      const raio = raioBase;
      
      const anguloInicial = -Math.PI / 2;
      const anguloPorItem = (2 * Math.PI) / 15;
      
      // Adicionar pequeno offset para labels do círculo externo
      const offsetAngulo = index % 2 === 1 ? (anguloPorItem / 3) : 0;
      const angulo = anguloInicial + (index * anguloPorItem) + offsetAngulo;
      
      const x = centroX + (raio * Math.cos(angulo));
      const y = centroY + (raio * Math.sin(angulo));
      
      // Converter para posicionamento CSS com limites seguros
      const left = x < 50 ? `${Math.max(x, 3)}%` : 'auto';
      const right = x >= 50 ? `${Math.max(100 - x, 3)}%` : 'auto';
      const top = `${Math.max(Math.min(y, 97), 3)}%`;
      
      return `top: ${top}; ${left !== 'auto' ? `left: ${left}` : `right: ${right}`}; margin: 15px;`;
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
      // Função para evitar sobreposição dos labels das obras
      const labels = document.querySelectorAll('.obra-label-overlay');
      if (labels.length === 0) return;
      
      const padding = 10; // Espaçamento mínimo em pixels
      const labelsArray = Array.from(labels);
      
      labelsArray.forEach((label, index) => {
        let tentativas = 0;
        const maxTentativas = 50;
        let colisao = true;
        
        while (colisao && tentativas < maxTentativas) {
          colisao = false;
          const rect = label.getBoundingClientRect();
          
          labelsArray.forEach((outroLabel, outroIndex) => {
            if (index === outroIndex) return;
            
            const outroRect = outroLabel.getBoundingClientRect();
            
            // Verificar se há sobreposição
            if (!(rect.right + padding < outroRect.left || 
                  rect.left > outroRect.right + padding ||
                  rect.bottom + padding < outroRect.top ||
                  rect.top > outroRect.bottom + padding)) {
              colisao = true;
              
              // Calcular distância e direção
              const dx = outroRect.left - rect.left;
              const dy = outroRect.top - rect.top;
              const distancia = Math.sqrt(dx * dx + dy * dy);
              
              if (distancia < padding * 2) {
                // Mover o label atual para longe
                const container = label.parentElement;
                const containerRect = container.getBoundingClientRect();
                
                const currentTop = parseFloat(label.style.top || '0');
                const currentLeft = parseFloat(label.style.left || '0');
                const currentRight = parseFloat(label.style.right || '0');
                
                // Calcular deslocamento em porcentagem
                const offsetX = (padding * 1.5 / containerRect.width) * 100;
                const offsetY = (padding * 1.5 / containerRect.height) * 100;
                
                // Mover na direção oposta à colisão
                if (Math.abs(dx) > Math.abs(dy)) {
                  // Mover horizontalmente
                  if (label.style.left !== 'auto') {
                    label.style.left = `${Math.max(2, Math.min(98, currentLeft + (dx > 0 ? -offsetX : offsetX)))}%`;
                  } else {
                    label.style.right = `${Math.max(2, Math.min(98, currentRight + (dx > 0 ? offsetX : -offsetX)))}%`;
                  }
                } else {
                  // Mover verticalmente
                  label.style.top = `${Math.max(2, Math.min(98, currentTop + (dy > 0 ? -offsetY : offsetY)))}%`;
                }
              }
            }
          });
          
          tentativas++;
        }
      });
    },

    toggleObraInfo(index) {
      // Pode ser usado para mostrar informações da obra ao clicar
      const obra = this.OBRAS_DA_CARNE[index];
      const ativa = this.isObraAtiva(index);
      console.log(`${obra} - ${ativa ? 'Ativa' : 'Inativa'}`);
    },

    VERSAO_TERMOS
  }));
});
