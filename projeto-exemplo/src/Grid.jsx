import * as warcraftAPI from './api/usuarioApi';
import ReactDataGrid from 'react-data-grid'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react'
import { Formatters } from 'react-data-grid-addons';
import GridSettings from "./GridSettings";
const {
  DraggableHeader: { DraggableContainer }
} = require('react-data-grid-addons');


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

    this.columns = [
      { key: 'reino', name: 'Reino', draggable: true },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter, draggable: true },
      { key: 'nome', name: 'Nome', sortable: true, draggable: true },
      { key: 'classe', name: 'Classe', sortable: true, draggable: true },
      { key: 'spec', name: 'Especialização', width: 150, sortable: true, draggable: true },
      { key: 'ilvl', name: 'Item Level', sortable: true, draggable: true },
      { key: 'cabeca', name: 'Cabeça', sortable: true, draggable: true },
      { key: 'colar', name: 'Colar', sortable: true, draggable: true },
      { key: 'peitoral', name: 'Peitoral', sortable: true, draggable: true },
      { key: 'manto', name: 'Manto', sortable: true, draggable: true },
      { key: 'pulsos', name: 'Pulsos', sortable: true, draggable: true },
      { key: 'maos', name: 'Mãos', sortable: true, draggable: true },
      { key: 'cintura', name: 'Cintura', sortable: true, draggable: true },
      { key: 'pernas', name: 'Pernas', sortable: true, draggable: true },
      { key: 'pes', name: 'Pés', sortable: true, draggable: true },
      { key: 'anel1', name: 'Anel 1', sortable: true, draggable: true },
      { key: 'anel2', name: 'Anel 2', sortable: true, draggable: true },
      { key: 'berloque1', name: 'Berloque 1', width: 100, sortable: true, draggable: true },
      { key: 'berloque2', name: 'Berloque 2', width: 100, sortable: true, draggable: true },
      { key: 'armaPrincipal', name: 'Arma Principal', width: 140, sortable: true, draggable: true },
      { key: 'armaSecundaria', name: 'Arma Secundária', width: 140, sortable: true, draggable: true }];
  }

  state = {
    rows: [],
    columns: [
      { key: 'reino', name: 'Reino', draggable: true },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter, draggable: true },
      { key: 'nome', name: 'Nome', sortable: true, draggable: true },
      { key: 'classe', name: 'Classe', sortable: true, draggable: true },
      { key: 'spec', name: 'Especialização', width: 150, sortable: true, draggable: true },
      { key: 'ilvl', name: 'Item Level', sortable: true, draggable: true },
      { key: 'cabeca', name: 'Cabeça', sortable: true, draggable: true },
      { key: 'colar', name: 'Colar', sortable: true, draggable: true },
      { key: 'peitoral', name: 'Peitoral', sortable: true, draggable: true },
      { key: 'manto', name: 'Manto', sortable: true, draggable: true },
      { key: 'pulsos', name: 'Pulsos', sortable: true, draggable: true },
      { key: 'maos', name: 'Mãos', sortable: true, draggable: true },
      { key: 'cintura', name: 'Cintura', sortable: true, draggable: true },
      { key: 'pernas', name: 'Pernas', sortable: true, draggable: true },
      { key: 'pes', name: 'Pés', sortable: true, draggable: true },
      { key: 'anel1', name: 'Anel 1', sortable: true, draggable: true },
      { key: 'anel2', name: 'Anel 2', sortable: true, draggable: true },
      { key: 'berloque1', name: 'Berloque 1', width: 100, sortable: true, draggable: true },
      { key: 'berloque2', name: 'Berloque 2', width: 100, sortable: true, draggable: true },
      { key: 'armaPrincipal', name: 'Arma Principal', width: 140, sortable: true, draggable: true },
      { key: 'armaSecundaria', name: 'Arma Secundária', width: 140, sortable: true, draggable: true }
    ],
    originalRows: []
  };

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
    let rows = this.state.rows;

    // Por algum motivo o createRolls está sendo chamado sem enviar nenhum parâmetro. A condicional abaixo resolve exceções quando allIlvl é null, ou seja, não é enviado.
    let allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
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
        cabeca: allItemIlvl[0],
        colar: allItemIlvl[1],
        peitoral: allItemIlvl[2],
        manto: allItemIlvl[3],
        pulsos: allItemIlvl[4],
        maos: allItemIlvl[5],
        cintura: allItemIlvl[6],
        pernas: allItemIlvl[7],
        pes: allItemIlvl[8],
        anel1: allItemIlvl[9],
        anel2: allItemIlvl[10],
        berloque1: allItemIlvl[11],
        berloque2: allItemIlvl[12],
        armaPrincipal: allItemIlvl[13],
        armasecundaria: allItemIlvl[14]
      });
    }
    
    this.setState({ rows });
    let originalRows = rows;
    this.setState({ originalRows });
    let columns = this.columns;
    this.setState({ columns });
  };

  onHeaderDrop = (source, target) => {
    const stateCopy = Object.assign({}, this.state);

    const columnSourceIndex = this.state.columns.findIndex(
      i => i.key === source
    );
    const columnTargetIndex = this.state.columns.findIndex(
      i => i.key === target
    );

    stateCopy.columns.splice(
      columnTargetIndex,
      0,
      stateCopy.columns.splice(columnSourceIndex, 1)[0]
    );

    const emptyColumns = Object.assign({},this.state, { columns: [] });
    this.setState(
      emptyColumns
    );

    const reorderedColumns = Object.assign({},this.state, { columns: stateCopy.columns });
    this.setState(
      reorderedColumns
    );
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
      <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          onGridSort={this.handleGridSort}
          columns={this.state.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500} 
          />
      </DraggableContainer>
      <Button
        onClick={ () => this.props.history.push("/") } 
        secondary style={{ marginTop: 10 }}>
            Voltar
      </Button>
      <GridSettings />
      </div>
    );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(Grid));