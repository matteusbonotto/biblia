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

export { OPCOES_AVATAAARS };
