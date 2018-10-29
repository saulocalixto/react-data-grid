import * as Type from '../actions/type.js';
import { combineReducers } from "redux";

export const initialState = {
  personagens: []
};

function wow(state = initialState, action) {
  let personagens;
  switch (action.type) {
    case Type.ENVIA_PERSONAGENS: {
        personagens = action.personagens;
        return {
            ...state,
            personagens
          }
    }
    default:
      return state;
  }
}

export default combineReducers({
  wow,
});