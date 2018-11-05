import * as warcraftAPI from './api/usuarioApi';
import ReactDataGrid from 'react-data-grid'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react'
import { Formatters } from 'react-data-grid-addons';



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
          let thumbnail = resultado.thumbnail;
          this.createRows(classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao);
        }
      });
    });

    this._columns = [
      { key: 'reino', name: 'Reino' },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter },
      { key: 'nome', name: 'Nome', sortable: true },
      { key: 'classe', name: 'Classe', sortable: true },
      { key: 'spec', name: 'Especialização', width: 150, sortable: true },
      { key: 'ilvl', name: 'Item Level', sortable: true },
      { key: 'item0', name: 'Cabeça', sortable: true },
      { key: 'item1', name: 'Colar', sortable: true },
      { key: 'item2', name: 'Peitoral', sortable: true },
      { key: 'item3', name: 'Manto', sortable: true },
      { key: 'item4', name: 'Peitoral', sortable: true },
      { key: 'item5', name: 'Pulsos', sortable: true },
      { key: 'item6', name: 'Mãos', sortable: true },
      { key: 'item7', name: 'Cintura', sortable: true },
      { key: 'item8', name: 'Pernas', sortable: true },
      { key: 'item9', name: 'Pés', sortable: true },
      { key: 'item10', name: 'Anel 1', sortable: true },
      { key: 'item11', name: 'Anel 2', sortable: true },
      { key: 'item12', name: 'Berloque 1', width: 100, sortable: true },
      { key: 'item13', name: 'Berloque 2', width: 100, sortable: true },
      { key: 'item14', name: 'Arma Principal', width: 140, sortable: true },
      { key: 'item15', name: 'Arma Secundária', width: 140, sortable: true }];
  }

  state = {
    rows: []
  };

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
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
        avatar: warcraftAPI.getToonImageURL(thumbnail, regiao),
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

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  render() {
    return  (
      <div>
      <ReactDataGrid
        onGridSort={this.handleGridSort}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500} />
        <Button
          onClick={ () => this.props.history.push("/") } 
          secondary style={{ marginTop: 10 }}>
              Voltar
          </Button>

                </div>
        );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(Grid));