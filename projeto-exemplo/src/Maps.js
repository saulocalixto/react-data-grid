import {
    enviaPersonagens,
    adicionaGrupo,
    atualizaGrupos,
    carregaGrupos
  } from './actions'
  
  export const mapStateToProps = (store) => {
    const personagens = store.wow.personagens;
    const grupos = store.wow.grupos;
    return {
        personagens,
        grupos
    }
  }
  
  export const mapDispatchToProps = (dispatch) => {
    return {
      EnviaPersonagens: (personagens) => dispatch(enviaPersonagens(personagens)),
      AdicionaGrupo: (grupo, grupos) => dispatch(adicionaGrupo(grupo, grupos)),
      AtualizaGrupos: (grupos) => dispatch(atualizaGrupos(grupos)),
      CarregaGrupos: (grupos) => dispatch(carregaGrupos(grupos))
    }
  }