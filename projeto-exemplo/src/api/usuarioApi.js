const key = 'awydkuy9tx3zksd7kkh2g5xchnwv4qy3';

/**
 * Retorna a URL base para chamada da API.
 * @param {string} region 'us' para Americas ou 'eu' para Europa
 */
export const getAPI = (region) => {
  return 'https://' + region + '.api.battle.net/wow';
};

/**
 * Consegue os dados do personagem pedido e retorna estes dados como um json.
 * @param {string} region 'us' para Americas ou 'eu' para Europa
 * @param {string} realmName
 * @param {string} toonName
 */
export const getToon = (region, realmName, toonName, tries) => {
  console.log(toonName + '-' + realmName);
  tries--;
  return fetch(`${getAPI('us')}/character/${realmName}/${toonName}?fields=reputation,statistics,items,quests,achievements,audit,progression,feed,professions,talents&?locale=pt_BR&apikey=${key}`, {
    method: 'GET'
  }).then(res => res.json()).catch(function(error) {
    if (tries <= 0) throw error;
    return getToon(region, realmName, toonName, tries);
  })
  .then(data => data).catch(function(error) {
    if (tries <= 0) throw error;
    return getToon(region, realmName, toonName, tries);
  });
}

/**
 * Retorna o ilvl (média do nível dos itens) do personagem.
 * @param {Object} toon
 */
export const getToonIlvl = (toon) => {
  return toon.items.averageItemLevel;
};

export const getItemSlotIlvl = (slot) => {
  if (slot) {
    return slot.itemLevel;
  }
  return '';
};

/**
 * Retorna o ilvl de cada item do personagem, dentro de um vetor, na seguinte ordem:
 * Cabeça, Colar, Ombros, Manto, Peitoral, Pulsos, Mãos, Cintura, Pernas, Pés, Anel 1, Anel 2, Berloque 1, Berloque 2, Arma Principal, Arma Secundária.
 *
 * Obs.: Algumas especializações não usam Arma Secundária, desta forma é normal que este campo venha vazio em alguns personagens.
 * @param {Object} toon
 */
export const getToonIlvlAllItems = (toon) => {
  if (toon.items) {
    return [getItemSlotIlvl(toon.items.head),
      getItemSlotIlvl(toon.items.neck),
      getItemSlotIlvl(toon.items.shoulder),
      getItemSlotIlvl(toon.items.back),
      getItemSlotIlvl(toon.items.chest),
      getItemSlotIlvl(toon.items.wrist),
      getItemSlotIlvl(toon.items.hands),
      getItemSlotIlvl(toon.items.waist),
      getItemSlotIlvl(toon.items.legs),
      getItemSlotIlvl(toon.items.feet),
      getItemSlotIlvl(toon.items.finger1),
      getItemSlotIlvl(toon.items.finger2),
      getItemSlotIlvl(toon.items.trinket1),
      getItemSlotIlvl(toon.items.trinket2),
      getItemSlotIlvl(toon.items.mainHand),
      getItemSlotIlvl(toon.items.offHand)];
  }
  return ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
};

/**
 * Retorna o nome da classe do personagem.
 * @param {Object} toon
 */
export const getToonClass = (toon) => {
  let toonClass = '';
  switch (toon.class) {
  case 1:
    toonClass = 'Guerreiro';
    break;
  case 2:
    toonClass = 'Paladino';
    break;
  case 3:
    toonClass = 'Caçador';
    break;
  case 4:
    toonClass = 'Ladino';
    break;
  case 5:
    toonClass = 'Sacerdote';
    break;
  case 6:
    toonClass = 'Cavaleiro da Morte';
    break;
  case 7:
    toonClass = 'Xamã';
    break;
  case 8:
    toonClass = 'Mago';
    break;
  case 9:
    toonClass = 'Bruxo';
    break;
  case 10:
    toonClass = 'Monge';
    break;
  case 11:
    toonClass = 'Druida';
    break;
  case 12:
    toonClass = 'Caçador de Demônios';
    break;
  default:
    toonClass = '?';
  }
  return toonClass;
};

/**
 * Retorna o nome da spec/especialização do personagem.
 * @param {Object} toon
 */
export const getSpecializationName = (toon) => {
  let mainspec = 'none';
  let i = 0;
  for (i = 0; i < 4; i++) {
    if (toon.talents[i].selected === true) {
      mainspec = toon.talents[i].spec.name;
    }
  }
  return mainspec;
};

/**
 * Retorna a URL onde se encontra a imagem 'thumbnail' do personagem.
 * @param {Object} toon
 * @param {string} region 'us' para Americas ou 'eu' para Europa
 */
export const getToonImageURL = (toonThumb, region) => {
  return `http://render-${'us'}.worldofwarcraft.com/character/${toonThumb}`
};

/**
 * Retorna a cor padrão para se colorir uma célula de nível de item (Cabeça, Colar, etc.) de acordo com seu valor.
 * A cor retornada está no padrão HEX. Exemplo: '#ff1000' é vermelho.
 * @param {Integer} itemLevel
 */
export const getDefaultColor = (itemLevel) => {
  if (itemLevel >= 370)
    return '#6617f9';

  else if (itemLevel >= 340)
    return '#1437ff';

  else if (itemLevel >= 325)
    return '#14c0ff';  

  return '#18f942';
};

/**
 * Retorna a função desempenhada pela especialização do personagem.
 * @param {string} specName Nome da especialização (em inglês).
 * @param {string} className Nome da classe (inglês ou português).
 */
export const getRole = (specName, className) => {
  const tank = 'Tank';
  const heal = 'Healer';
  const mdps = 'Melee';
  const rdps = 'Range';

  // Existem duas specs com o nome Frost, mas uma é de DK (Melee) e outra é de Mago (Range)
  // A condicional abaixo resolve este problema.
  if (className === 'Cavaleiro da Morte' || className === 'Death Knight') {
    if (specName !== 'Blood') {
      return mdps;
    }
  }

  switch (specName) {
  // TANKS
  case 'Blood':
    return tank;
  case 'Protection':
    return tank;
  case 'Guardian':
    return tank;
  case 'Vengeance':
    return tank;
  case 'Brewmaster':
    return tank;
  // HEALER
  case 'Restoration':
    return heal;
  case 'Mistweaver':
    return heal;
  case 'Holy':
    return heal;
  case 'Discipline':
    return heal;
  // RDPS
  case 'Balance':
    return rdps;
  case 'Beast Mastery':
    return rdps;
  case 'Marksmanship':
    return rdps;
  case 'Arcane':
    return rdps;
  case 'Fire':
    return rdps;
  case 'Frost':
    return rdps;
  case 'Shadow':
    return rdps;
  case 'Elemental':
    return rdps;
  case 'Affliction':
    return rdps;
  case 'Demonology':
    return rdps;
  case 'Destruction':
    return rdps;
  // MDPS
  case 'Unholy':
    return mdps;
  case 'Havoc':
    return mdps;
  case 'Feral':
    return mdps;
  case 'Survival':
    return mdps;
  case 'Windwalker':
    return mdps;
  case 'Retribution':
    return mdps;
  case 'Assassination':
    return mdps;
  case 'Outlaw':
    return mdps;
  case 'Subtlety':
    return mdps;
  case 'Enhancement':
    return mdps;
  case 'Arms':
    return mdps;
  case 'Fury':
    return mdps;

  default:
    return specName;
  }
};