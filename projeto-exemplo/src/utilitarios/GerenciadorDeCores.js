/**
 * Retorna a cor que deve ser preenchida a coluna de peitoral de acordo com o level.
 * @param {int} region O level do peitoral.
 */
export const getAPI = (region) => {
    return 'https://' + region + '.api.battle.net/wow';
  };