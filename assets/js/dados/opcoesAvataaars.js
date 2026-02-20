/**
 * Todas as opções do Avataaars para o editor de personagem
 * Valores aceitos pela API https://avataaars.io/
 * Cores em hex são apenas para exibir os swatches na UI
 */
const OPCOES_AVATAAARS = {
  avatarStyle: [
    { valor: 'Circle', label: 'Círculo' },
    { valor: 'Transparent', label: 'Transparente' }
  ],
  topType: [
    { valor: 'NoHair', label: 'Sem cabelo' },
    { valor: 'LongHairBigHair', label: 'Cabelo grande' },
    { valor: 'LongHairBob', label: 'Bob' },
    { valor: 'LongHairBun', label: 'Coque' },
    { valor: 'LongHairCurly', label: 'Cacheado' },
    { valor: 'LongHairCurvy', label: 'Ondulado' },
    { valor: 'LongHairDreads', label: 'Dreadlocks' },
    { valor: 'LongHairFrida', label: 'Estilo Frida' },
    { valor: 'LongHairFro', label: 'Black power' },
    { valor: 'LongHairFroBand', label: 'Black power com faixa' },
    { valor: 'LongHairMiaWallace', label: 'Mia Wallace' },
    { valor: 'LongHairShavedSides', label: 'Lateral raspada' },
    { valor: 'LongHairStraight', label: 'Liso longo' },
    { valor: 'LongHairStraight2', label: 'Liso longo 2' },
    { valor: 'ShortHairDreads01', label: 'Dread curto 1' },
    { valor: 'ShortHairDreads02', label: 'Dread curto 2' },
    { valor: 'ShortHairFrizzle', label: 'Crespo' },
    { valor: 'ShortHairShaggyMullet', label: 'Mullet' },
    { valor: 'ShortHairShortCurly', label: 'Curto cacheado' },
    { valor: 'ShortHairShortFlat', label: 'Curto liso' },
    { valor: 'ShortHairShortRound', label: 'Curto redondo' },
    { valor: 'ShortHairShortWaved', label: 'Curto ondulado' },
    { valor: 'ShortHairSides', label: 'Lados curtos' },
    { valor: 'ShortHairTheCaesar', label: 'Caesar' },
    { valor: 'ShortHairTheCaesarSidePart', label: 'Caesar com risca' }
  ],
  accessoriesType: [
    { valor: 'Blank', label: 'Nenhum' },
    { valor: 'Kurt', label: 'Kurt' },
    { valor: 'Prescription01', label: 'Óculos receita 1' },
    { valor: 'Prescription02', label: 'Óculos receita 2' },
    { valor: 'Round', label: 'Redondo' },
    { valor: 'Sunglasses', label: 'Óculos de sol' },
    { valor: 'Wayfarers', label: 'Wayfarers' }
  ],
  hairColor: [
    { valor: 'Auburn', label: 'Ruivo', hex: '#a55728' },
    { valor: 'Black', label: 'Preto', hex: '#2c1810' },
    { valor: 'Blonde', label: 'Loiro', hex: '#e5c76b' },
    { valor: 'BlondeGolden', label: 'Loiro dourado', hex: '#f6cf57' },
    { valor: 'Brown', label: 'Castanho', hex: '#5c4033' },
    { valor: 'BrownDark', label: 'Castanho escuro', hex: '#4a3728' },
    { valor: 'PastelPink', label: 'Rosa pastel', hex: '#e8b4b8' },
    { valor: 'Platinum', label: 'Platina', hex: '#e8e4e0' },
    { valor: 'Red', label: 'Vermelho', hex: '#b55239' },
    { valor: 'SilverGray', label: 'Grisalho', hex: '#b2b2b2' }
  ],
  facialHairType: [
    { valor: 'Blank', label: 'Nenhum' },
    { valor: 'BeardLight', label: 'Barba leve' },
    { valor: 'BeardMedium', label: 'Barba média' },
    { valor: 'BeardMajestic', label: 'Barba majestosa' },
    { valor: 'MoustacheFancy', label: 'Bigode fino' },
    { valor: 'MoustacheMagnum', label: 'Bigode magnum' }
  ],
  facialHairColor: [
    { valor: 'Auburn', hex: '#a55728' },
    { valor: 'Black', hex: '#2c1810' },
    { valor: 'Blonde', hex: '#e5c76b' },
    { valor: 'BlondeGolden', hex: '#f6cf57' },
    { valor: 'Brown', hex: '#5c4033' },
    { valor: 'BrownDark', hex: '#4a3728' },
    { valor: 'Platinum', hex: '#e8e4e0' },
    { valor: 'Red', hex: '#b55239' },
    { valor: 'SilverGray', hex: '#b2b2b2' }
  ],
  clotheType: [
    { valor: 'BlazerShirt', label: 'Blazer' },
    { valor: 'BlazerSweater', label: 'Blazer com suéter' },
    { valor: 'CollarSweater', label: 'Suéter com gola' },
    { valor: 'GraphicShirt', label: 'Camiseta estampada' },
    { valor: 'Hoodie', label: 'Moletom' },
    { valor: 'Overall', label: 'Macacão' },
    { valor: 'ShirtCrewNeck', label: 'Camiseta gola redonda' },
    { valor: 'ShirtScoopNeck', label: 'Camiseta gola canoa' },
    { valor: 'ShirtVNeck', label: 'Camiseta gola V' }
  ],
  clotheColor: [
    { valor: 'Black', hex: '#262e33' },
    { valor: 'Blue01', hex: '#65c9ff' },
    { valor: 'Blue02', hex: '#5199e4' },
    { valor: 'Blue03', hex: '#25557c' },
    { valor: 'Gray01', hex: '#e6e6e6' },
    { valor: 'Gray02', hex: '#6d6d6d' },
    { valor: 'Heather', hex: '#c4c4c4' },
    { valor: 'PastelBlue', hex: '#b1e2ff' },
    { valor: 'PastelGreen', hex: '#a7ffc4' },
    { valor: 'PastelOrange', hex: '#ffdeb3' },
    { valor: 'PastelRed', hex: '#ffafb9' },
    { valor: 'PastelYellow', hex: '#ffffb1' },
    { valor: 'Pink', hex: '#ff488e' },
    { valor: 'Red', hex: '#ff5c5c' },
    { valor: 'White', hex: '#ffffff' }
  ],
  eyeType: [
    { valor: 'Close', label: 'Fechados' },
    { valor: 'Cry', label: 'Chorando' },
    { valor: 'Default', label: 'Padrão' },
    { valor: 'Dizzy', label: 'Tonto' },
    { valor: 'EyeRoll', label: 'Revirar' },
    { valor: 'Happy', label: 'Feliz' },
    { valor: 'Hearts', label: 'Corações' },
    { valor: 'Side', label: 'Lateral' },
    { valor: 'Squint', label: 'Apertados' },
    { valor: 'Surprised', label: 'Surpreso' },
    { valor: 'Wink', label: 'Piscadela' },
    { valor: 'WinkWacky', label: 'Piscadela maluca' }
  ],
  eyebrowType: [
    { valor: 'Angry', label: 'Raiva' },
    { valor: 'AngryNatural', label: 'Raiva natural' },
    { valor: 'Default', label: 'Padrão' },
    { valor: 'DefaultNatural', label: 'Padrão natural' },
    { valor: 'FlatNatural', label: 'Reto natural' },
    { valor: 'FrownNatural', label: 'Triste natural' },
    { valor: 'RaisedExcited', label: 'Levantado' },
    { valor: 'RaisedExcitedNatural', label: 'Levantado natural' },
    { valor: 'SadConcerned', label: 'Preocupado' },
    { valor: 'SadConcernedNatural', label: 'Preocupado natural' },
    { valor: 'UnibrowNatural', label: 'Unissex natural' },
    { valor: 'UpDown', label: 'Para cima/baixo' },
    { valor: 'UpDownNatural', label: 'Para cima/baixo natural' }
  ],
  mouthType: [
    { valor: 'Concerned', label: 'Preocupado' },
    { valor: 'Default', label: 'Padrão' },
    { valor: 'Disbelief', label: 'Descrença' },
    { valor: 'Eating', label: 'Comendo' },
    { valor: 'Grimace', label: 'Careta' },
    { valor: 'Sad', label: 'Triste' },
    { valor: 'ScreamOpen', label: 'Grito' },
    { valor: 'Serious', label: 'Sério' },
    { valor: 'Smile', label: 'Sorriso' },
    { valor: 'Tongue', label: 'Língua' },
    { valor: 'Twinkle', label: 'Piscadela' },
    { valor: 'Vomit', label: 'Enjoo' }
  ],
  skinColor: [
    { valor: 'Tanned', label: 'Bronzeado', hex: '#e0b896' },
    { valor: 'Yellow', label: 'Amarelo', hex: '#f8d38c' },
    { valor: 'Pale', label: 'Pálido', hex: '#f2d5b8' },
    { valor: 'Light', label: 'Claro', hex: '#e8beac' },
    { valor: 'Brown', label: 'Moreno', hex: '#c68642' },
    { valor: 'DarkBrown', label: 'Moreno escuro', hex: '#8d5524' },
    { valor: 'Black', label: 'Negro', hex: '#5c3317' }
  ]
};

/**
 * Fundos disponíveis para o avatar do perfil.
 * gradient: string CSS (linear-gradient / radial-gradient)
 * svgPattern: string SVG inline usada como padrão repetido sobre o gradiente
 * preview: hex aproximado para o swatch na UI
 */
const BACKGROUNDS_AVATAR = [
  { valor: 'verde-natural',   label: 'Natureza',     gradient: 'linear-gradient(135deg,#1a6640 0%,#4aaf78 60%,#6ee7a0 100%)',                                    svgPattern: null,          preview: '#4aaf78' },
  { valor: 'azul-safira',     label: 'Safira',       gradient: 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 60%,#93c5fd 100%)',                                    svgPattern: null,          preview: '#3b82f6' },
  { valor: 'roxo-royal',      label: 'Royal',        gradient: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 60%,#c4b5fd 100%)',                                    svgPattern: null,          preview: '#7c3aed' },
  { valor: 'rosa-petala',     label: 'Pétala',       gradient: 'linear-gradient(135deg,#9d174d 0%,#ec4899 60%,#fbcfe8 100%)',                                    svgPattern: null,          preview: '#ec4899' },
  { valor: 'dourado',         label: 'Dourado',      gradient: 'linear-gradient(135deg,#78350f 0%,#d97706 60%,#fde68a 100%)',                                    svgPattern: null,          preview: '#d97706' },
  { valor: 'coral',           label: 'Coral',        gradient: 'linear-gradient(135deg,#9a3412 0%,#f97316 60%,#fed7aa 100%)',                                    svgPattern: null,          preview: '#f97316' },
  { valor: 'aurora',          label: 'Aurora',       gradient: 'linear-gradient(135deg,#064e3b 0%,#5b21b6 50%,#be185d 100%)',                                    svgPattern: null,          preview: '#5b21b6' },
  { valor: 'oceano',          label: 'Oceano',       gradient: 'linear-gradient(135deg,#0c4a6e 0%,#0284c7 55%,#38bdf8 100%)',                                    svgPattern: null,          preview: '#0284c7' },
  { valor: 'cinza',           label: 'Cinza',        gradient: 'linear-gradient(135deg,#374151 0%,#6b7280 55%,#9ca3af 100%)',                                    svgPattern: null,          preview: '#6b7280' },
  { valor: 'claro',           label: 'Claro',        gradient: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',                                                svgPattern: null,          preview: '#e2e8f0' },
  { valor: 'noite',           label: 'Noite',        gradient: 'linear-gradient(135deg,#0f172a 0%,#1e293b 65%,#0f172a 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><circle cx="5" cy="5" r="1.2" fill="rgba(255,255,255,0.7)"/><circle cx="20" cy="12" r="1.5" fill="rgba(255,255,255,0.5)"/><circle cx="40" cy="5" r="0.8" fill="rgba(255,255,255,0.8)"/><circle cx="55" cy="20" r="1.2" fill="rgba(255,255,255,0.6)"/><circle cx="10" cy="35" r="1" fill="rgba(255,255,255,0.5)"/><circle cx="30" cy="45" r="1.5" fill="rgba(255,255,255,0.7)"/><circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.6)"/><circle cx="45" cy="30" r="1.2" fill="rgba(255,255,255,0.4)"/></svg>', preview: '#1e293b' },
  { valor: 'bolhas',          label: 'Bolhas',       gradient: 'linear-gradient(135deg,#0c4a6e 0%,#0284c7 55%,#38bdf8 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><circle cx="12" cy="12" r="8" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><circle cx="45" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><circle cx="20" cy="48" r="6" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><circle cx="52" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/></svg>', preview: '#0ea5e9' },
  { valor: 'pontos',          label: 'Pontos',       gradient: 'linear-gradient(135deg,#1a6640 0%,#4aaf78 60%,#6ee7a0 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="2.2" fill="rgba(255,255,255,0.3)"/></svg>',  preview: '#22c55e' },
  { valor: 'hexagonos',       label: 'Hexágonos',   gradient: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 60%,#c4b5fd 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="26"><polygon points="15,1 29,8 29,22 15,29 1,22 1,8" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/></svg>', preview: '#8b5cf6' },
  { valor: 'linhas',          label: 'Linhas',       gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1e293b 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><line x1="0" y1="12" x2="12" y2="0" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/></svg>', preview: '#2563eb' },
  { valor: 'floral',          label: 'Floral',       gradient: 'linear-gradient(135deg,#9d174d 0%,#ec4899 60%,#fbcfe8 100%)',                                    svgPattern: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="15" cy="6" r="2" fill="rgba(255,255,255,0.2)"/><circle cx="15" cy="24" r="2" fill="rgba(255,255,255,0.2)"/><circle cx="6" cy="15" r="2" fill="rgba(255,255,255,0.2)"/><circle cx="24" cy="15" r="2" fill="rgba(255,255,255,0.2)"/></svg>', preview: '#f472b6' },
];

export { OPCOES_AVATAAARS, BACKGROUNDS_AVATAR };
