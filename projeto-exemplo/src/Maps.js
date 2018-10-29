import {
    enviaPersonagens
  } from './actions'
  
  export const mapStateToProps = (store) => {
    const personagens = store.wow.personagens;
    return {
        personagens
    }
  }
  
  export const mapDispatchToProps = (dispatch) => {
    return {
      EnviaPersonagens: (personagens) => dispatch(enviaPersonagens(personagens)),
    }
  }