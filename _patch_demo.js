const fs = require('fs');
const demo = JSON.parse(fs.readFileSync('assets/dados/demo.json', 'utf8'));

// ── 1. Adicionar itens ao inventário (se ainda não existirem) ──
const novosInv = [
  {
    id: 'inv-demo-7',
    item_id: 'item-espada',
    quantidade: 1,
    equipado: false,
    itens: {
      nome: 'Espada do Espírito',
      tipo: 'permanente',
      icone: 'bi-sword',
      raridade: 'lendario',
      descricao: 'A Palavra de Deus como arma ofensiva (Ef 6.17).',
      preco_ouro: 100,
      nivel_requerido: 10,
      efeito_bonus: 'Acesso ao Estudo do Evangelho'
    }
  },
  {
    id: 'inv-demo-8',
    item_id: 'item-harpa',
    quantidade: 1,
    equipado: false,
    itens: {
      nome: 'Harpa Cristã',
      tipo: 'permanente',
      icone: 'bi-music-note-beamed',
      raridade: 'raro',
      descricao: 'Cantai ao Senhor um cântico novo (Sl 96.1).',
      preco_ouro: 30,
      nivel_requerido: 1,
      efeito_bonus: 'Acesso à Harpa Cristã'
    }
  }
];

const existeIds = new Set(demo.inventario.map(i => i.item_id));
for (const item of novosInv) {
  if (!existeIds.has(item.item_id)) {
    demo.inventario.push(item);
    console.log('Adicionado ao inventário:', item.itens.nome);
  }
}

// ── 2. Adicionar itens à loja (itensLoja) se ainda não existirem ──
const novosLoja = [
  {
    id: 'item-biblia',
    nome: 'Bíblia Sagrada',
    descricao: 'A Palavra de Deus. Equipar desbloqueia a seção de Leitura Bíblica (Sl 119.105).',
    preco_ouro: 50,
    tipo: 'permanente',
    raridade: 'epico',
    nivel_requerido: 1,
    icone: 'bi-book-fill',
    categoria: 'Relíquia',
    efeito_bonus: 'Acesso à Leitura Bíblica'
  },
  {
    id: 'item-harpa',
    nome: 'Harpa Cristã',
    descricao: 'Instrumento de louvor. Equipar desbloqueia a Harpa Cristã (Sl 96.1).',
    preco_ouro: 30,
    tipo: 'permanente',
    raridade: 'raro',
    nivel_requerido: 1,
    icone: 'bi-music-note-beamed',
    categoria: 'Instrumento',
    efeito_bonus: 'Acesso à Harpa Cristã'
  }
];

const existeLojaIds = new Set(demo.itensLoja.map(i => i.id));
for (const item of novosLoja) {
  if (!existeLojaIds.has(item.id)) {
    demo.itensLoja.push(item);
    console.log('Adicionado à loja:', item.nome);
  }
}

fs.writeFileSync('assets/dados/demo.json', JSON.stringify(demo, null, 2), 'utf8');
console.log('demo.json atualizado com sucesso!');
