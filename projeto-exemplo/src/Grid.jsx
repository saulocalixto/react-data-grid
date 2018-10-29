import * as warcraftAPI from './api/usuarioApi';
import ReactDataGrid from 'react-data-grid'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";
import { connect } from "react-redux";



class Grid extends Component {
  constructor(props, context) {
    super(props, context);

    this.props.personagens.forEach(personagem => {
      const { reino, nome, regiao } = personagem;

      warcraftAPI.getToon(regiao, reino, nome).then((resultado) => {
        if(resultado.status !== "nok") {
          let ilvl = warcraftAPI.getToonIlvl(resultado);
          let classe = warcraftAPI.getToonClass(resultado);
          let spec = warcraftAPI.getSpecializationName(resultado);
          let ilvlItems = warcraftAPI.getToonIlvlAllItems(resultado);
          this.createRows(classe, spec, ilvl, ilvlItems, nome, reino);
        }
      });
    });

    this._columns = [
      { key: 'reino', name: 'Reino' },
      { key: 'nome', name: 'Nome' },
      { key: 'classe', name: 'Classe' },
      { key: 'spec', name: 'Especialização' },
      { key: 'ilvl', name: 'Item Level' },
      { key: 'item0', name: 'Cabeça' },
      { key: 'item1', name: 'Colar' },
      { key: 'item2', name: 'Peitoral' },
      { key: 'item3', name: 'Manto' },
      { key: 'item4', name: 'Peitoral' },
      { key: 'item5', name: 'Pulsos' },
      { key: 'item6', name: 'Mãos' },
      { key: 'item7', name: 'Cintura' },
      { key: 'item8', name: 'Pernas' },
      { key: 'item9', name: 'Pés' },
      { key: 'item10', name: 'Anel 1' },
      { key: 'item11', name: 'Anel 2' },
      { key: 'item12', name: 'Berloque 1' },
      { key: 'item13', name: 'Berloque 2' },
      { key: 'item14', name: 'Arma Principal' },
      { key: 'item15', name: 'Arma Secundária' }];
  }

  state = {
    rows: []
  };

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino) => {
    let rows = this.state.rows;

    // Por algum motivo o createRolls está sendo chamado sem enviar nenhum parâmetro. A condicional abaixo resolve exceções quando allIlvl é null, ou seja, não é enviado.
    let allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    if (!ilvlItems) {
      allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    }else {
      allItemIlvl = ilvlItems;
    }

    for (let i = 1; i < 2; i++) {
      rows.push({
        reino: reino,
        nome: nome,
        classe: classe,
        spec: spec,
        ilvl: ilvl,
        item0: allItemIlvl[0],
        item1: allItemIlvl[1],
        item2: allItemIlvl[2],
        item3: allItemIlvl[3],
        item4: allItemIlvl[4],
        item5: allItemIlvl[5],
        item6: allItemIlvl[6],
        item7: allItemIlvl[7],
        item8: allItemIlvl[8],
        item9: allItemIlvl[9],
        item10: allItemIlvl[10],
        item11: allItemIlvl[11],
        item12: allItemIlvl[12],
        item13: allItemIlvl[13],
        item14: allItemIlvl[14],
        item15: allItemIlvl[15]
      });
    }
    this.setState({ rows });
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500} />);
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(Grid));