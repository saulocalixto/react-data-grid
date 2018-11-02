import * as Type from './type.js';
 
  export const enviaPersonagens = (personagens) => {
    return {
      type: Type.ENVIA_PERSONAGENS,
      personagens
    }
  };