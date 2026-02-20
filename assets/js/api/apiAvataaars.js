/**
 * Avataaars - montagem de URL para avatar (CONVENCOES_E_APIS.md)
 */
const CONFIG_AVATAR_PADRAO = {
  avatarStyle: 'Transparent',
  topType: 'LongHairStraight',
  accessoriesType: 'Blank',
  hairColor: 'BrownDark',
  facialHairType: 'Blank',
  facialHairColor: 'BrownDark',
  clotheType: 'Hoodie',
  clotheColor: 'Black',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Default',
  skinColor: 'Light',
  bgAvatar: 'verde-natural'
};

function montarUrlAvataaars(config) {
  const mesclado = { ...CONFIG_AVATAR_PADRAO, ...config };
  const params = new URLSearchParams(mesclado);
  return `https://avataaars.io/?${params.toString()}`;
}

export { montarUrlAvataaars, CONFIG_AVATAR_PADRAO };
