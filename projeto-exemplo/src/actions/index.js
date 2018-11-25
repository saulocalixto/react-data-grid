import * as Type from './type.js';
 
  export const enviaPersonagens = (personagens) => {
    return {
      type: Type.ENVIA_PERSONAGENS,
      personagens
    }
  };

  export const adicionaGrupo = (grupo, grupos) => {
    return {
      type: Type.ADICIONA_GRUPO,
      grupo,
      grupos
    }
  };

  export const atualizaGrupos = (grupos) => {
    return {
      type: Type.ATUALIZA_GRUPOS,
      grupos
    }
  };