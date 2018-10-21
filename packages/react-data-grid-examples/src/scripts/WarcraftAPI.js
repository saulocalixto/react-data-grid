const key = 'awydkuy9tx3zksd7kkh2g5xchnwv4qy3';

export const getAPI = (region) => {
  return 'https://' + region + '.api.battle.net/wow';
};

export const getToon = (region, realmName, toonName) =>
  fetch(`${getAPI(region)}/character/${realmName}/${toonName}?fields=reputation,statistics,items,quests,achievements,audit,progression,feed,professions,talents&?locale=pt_BR&apikey=${key}`, {
    method: 'GET'
  }).then(res => res.json())
  .then(data => data);

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

export const getSpecializationName = (toon) => {
  let mainspec = 'none';
  for (i = 0; i < 4; i++) {
    if (toon.talents[i].selected === true) {
      mainspec = toon.talents[i].spec.name;
    }
  }
  return mainspec;
};

export const getSpecialization = (specName, className) => {
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
