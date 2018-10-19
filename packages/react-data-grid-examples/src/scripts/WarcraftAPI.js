const key = 'awydkuy9tx3zksd7kkh2g5xchnwv4qy3';

export const getToon = (region, realmName, toonName) =>
  fetch(`${getAPI(region)}/character/${realmName}/${toonName}?locale=pt_BR&apikey=${key}`, {
    method: 'GET'
  }).then(res => res.json())
    .then(data => data);

module.exports = {
  getAPI: function getAPI(region) {
    return 'https://' + region + '.api.battle.net/wow';
  },
  toon: function toon(region, realmName, toonName) {
    return getToon(region, realmName, toonName);
  }
};
