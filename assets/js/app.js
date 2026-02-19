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
import { listarModelosMissoes, listarMissoesAtivas, iniciarMissao, concluirMissao, desistirMissao } from './servicos/missoes.js';
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
    efeitosAtivos: [],
    inventario: [],
    missoesAtivas: [],
    modelosMissoes: [],
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

    temaSalvo: 'sistema',
    init() {
      this.temaSalvo = localStorage.getItem('tema') || 'sistema';
      this.aplicarTema(this.temaSalvo);
      this.atualizarPagina();
      window.addEventListener('hashchange', () => this.atualizarPagina());
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
      obterUsuarioAtual().then((u) => {
        this.usuario = u;
        if (u) this.carregarDadosUsuario();
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
      if (r === 'missoes' && this.usuario && this.modelosMissoes.length === 0) {
        listarModelosMissoes().then((data) => (this.modelosMissoes = data || []));
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
      if (this.pagina === 'missoes' && this.modelosMissoes.length === 0) {
        this.modelosMissoes = await listarModelosMissoes();
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

    async comprarItem(item) {
      this.erro = '';
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para comprar itens.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await comprarItemLoja(this.usuario.id, item.id, item.preco_ouro);
      if (r.sucesso) {
        await this.carregarDadosUsuario();
        this.carregarLoja();
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
    submitQuizEstudo() {
      let acertos = 0;
      this.quizEstudoPerguntas.forEach((p, i) => {
        if (Number(this.quizEstudoRespostas[i]) === p.correta) acertos++;
      });
      const total = this.quizEstudoPerguntas.length;
      this.quizEstudoNota = total ? Math.round((acertos / total) * 100) : 0;
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
        this.efeitosAtivos = dados.efeitosAtivos || [];
        this.inventario = dados.inventario || [];
        this.missoesAtivas = dados.missoesAtivas || [];
        this.modelosMissoes = dados.modelosMissoes || [];
        this.itensLoja = dados.itensLoja || [];
        this.ranking = dados.ranking || [];
        this.progressoLeitura = [];
        this.livrosAprovadosQuiz = [];
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
      if (r.sucesso) await this.carregarDadosUsuario();
      else this.erro = r.erro || '';
    },

    async concluirMissao(m) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para concluir missões.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await concluirMissao(this.usuario.id, m.id);
      if (r.sucesso) await this.carregarDadosUsuario();
    },

    async desistirMissao(m) {
      if (this.modoDemo) {
        this.sucesso = 'Modo demonstração: crie uma conta para gerenciar missões.';
        setTimeout(() => (this.sucesso = ''), 3000);
        return;
      }
      const r = await desistirMissao(this.usuario.id, m.id);
      if (r.sucesso) await this.carregarDadosUsuario();
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
      this.quizLivroAtivo = livro;
      this.quizTipo = 'livro';
      this.quizPerguntas = this.gerarPerguntasQuizLivro(livro);
      this.quizRespostas = {};
      this.quizEnviado = false;
      this.quizNota = null;
      this.viewBiblia = 'quiz';
    },

    iniciarQuizCapitulo() {
      if (!this.quizDesbloqueadoCapitulo() || !this.capituloBiblia) return;
      const livro = LIVROS_BIBLIA.find((l) => l.codigo === this.livroSelecionado);
      this.quizLivroAtivo = livro || { nome: this.livroSelecionado, codigo: this.livroSelecionado };
      this.quizTipo = 'capitulo';
      this.quizPerguntas = this.gerarPerguntasQuizCapitulo();
      this.quizRespostas = {};
      this.quizEnviado = false;
      this.quizNota = null;
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

    async enviarQuizLivro() {
      if (!this.quizLivroAtivo) return;
      const total = this.quizPerguntas.length;
      let certas = 0;
      this.quizPerguntas.forEach((q, i) => {
        const resp = this.quizRespostas[i];
        if (resp !== undefined && Number(resp) === q.correta) certas++;
      });
      const nota = total > 0 ? Math.round((certas / total) * 100) : 0;
      this.quizNota = nota;
      this.quizEnviado = true;
      const NOTA_MINIMA = 70;

      if (this.quizTipo === 'capitulo') {
        if (nota >= NOTA_MINIMA) {
          this.sucesso = `Aprovado com ${nota}%! Capítulo concluído.`;
        } else {
          this.erro = `Nota ${nota}%. É preciso pelo menos ${NOTA_MINIMA}% para aprovar. Você pode refazer o quiz.`;
        }
        setTimeout(() => {
          this.sucesso = '';
          this.erro = '';
          this.quizLivroAtivo = null;
          this.quizTipo = null;
          this.voltarBibliaCapitulos();
        }, 2500);
        return;
      }

      if (this.modoDemo) {
        this.sucesso = nota >= NOTA_MINIMA ? `Aprovado com ${nota}%! (Demo)` : `Nota ${nota}%. (Demo)`;
        setTimeout(() => { this.sucesso = ''; this.voltarBibliaCapitulos(); }, 2500);
        return;
      }
      if (nota >= NOTA_MINIMA) {
        await registrarAprovacaoQuizLivro(this.usuario.id, this.quizLivroAtivo.codigo);
        this.livrosAprovadosQuiz = await obterLivrosAprovadosQuiz(this.usuario.id);
        this.sucesso = `Aprovado com ${nota}%! Livro concluído.`;
        setTimeout(() => { this.sucesso = ''; this.voltarBibliaCapitulos(); }, 2500);
      } else {
        await resetarProgressoLivro(this.usuario.id, this.quizLivroAtivo.codigo);
        this.progressoLeitura = await obterProgressoUsuario(this.usuario.id);
        this.erro = `Nota ${nota}%. É preciso pelo menos ${NOTA_MINIMA}% para aprovar. O progresso do livro foi resetado.`;
      }
    },

    fecharQuiz() {
      this.quizLivroAtivo = null;
      this.quizTipo = null;
      this.quizEnviado = false;
      this.quizNota = null;
      this.voltarBibliaCapitulos();
    },

    VERSAO_TERMOS
  }));
});
