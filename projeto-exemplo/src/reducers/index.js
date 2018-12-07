import * as Type from '../actions/type.js';
import { combineReducers } from "redux";

export const initialState = {
  personagens: [],
  grupos: [],
};

function wow(state = initialState, action) {
  let personagens;
  let grupos;
  switch (action.type) {
    case Type.ENVIA_PERSONAGENS: {
        personagens = action.personagens;
        return {
            ...state,
            personagens
          }
    }
    case Type.CARREGA_GRUPOS: {
      grupos = action.grupos;
      return {
        ...state,
        grupos
      }
    }
    case Type.ADICIONA_GRUPO: {
      grupos = action.grupos;
      grupos.push(action.grupo);
      return {
          ...state,
          grupos
        }
  }
  case Type.ATUALIZA_GRUPOS: {
    grupos = action.grupos;
    return {
        ...state,
        grupos
      }
}
    default:
      return state;
  }
}

export default combineReducers({
  wow,
});