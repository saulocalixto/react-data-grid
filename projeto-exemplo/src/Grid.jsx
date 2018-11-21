import * as warcraftAPI from './api/usuarioApi';
import ReactDataGrid from 'react-data-grid'
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react'
import { Formatters, Toolbar } from 'react-data-grid-addons';
import GridSettings from "./GridSettings";
import update from 'immutability-helper';
import { Icon } from 'semantic-ui-react';

const {
  DraggableHeader: { DraggableContainer }
} = require('react-data-grid-addons');


class Grid extends Component {
  constructor(props, context) {
    super(props, context);

    let delay = 0;
    this.props.personagens.forEach(personagem => {
      const { reino, nome, regiao } = personagem;

      // Cria as linhas fazendo cada requisição com um delay de uma para outra
      // para não afogar o serviço, fazendo com que a API não pare de responder
      // ao mandar uma grande quantidade de personagens de uma só vez.
      this.regiao = regiao;
      createRow(reino, nome, regiao, delay, this);
      delay += 50;
    });

    this.columns = [
      { key: 'reino', name: 'Reino', width: 170, draggable: true, editable: true },
      { key: 'nome', name: 'Nome', width: 170, sortable: true, draggable: true, editable: true },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter, draggable: true },
      { key: 'classe', name: 'Classe', width: 150, sortable: true, draggable: true },
      { key: 'spec', name: 'Especialização', width: 150, sortable: true, draggable: true },
      { key: 'ilvl', name: 'Item Level', width: 120, sortable: true, draggable: true },
      { key: 'cabeca', name: 'Cabeça', sortable: true, draggable: true },
      { key: 'colar', name: 'Colar', sortable: true, draggable: true },
      { key: 'ombros', name: 'Ombros', sortable: true, draggable: true },
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
      { key: 'reino', name: 'Reino', width: 170, draggable: true, editable: true },
      { key: 'nome', name: 'Nome', width: 170, sortable: true, draggable: true, editable: true },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter, draggable: true },
      { key: 'classe', name: 'Classe', sortable: true, draggable: true },
      { key: 'spec', name: 'Especialização', width: 150, sortable: true, draggable: true },
      { key: 'ilvl', name: 'Item Level', sortable: true, draggable: true },
      { key: 'cabeca', name: 'Cabeça', sortable: true, draggable: true },
      { key: 'colar', name: 'Colar', sortable: true, draggable: true },
      { key: 'ombros', name: 'Ombros', sortable: true, draggable: true },
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

  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
        value: newRowIndex,
        reino: '',
        nome: '',
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
    let rows = this.state.rows;

    // Por algum motivo o createRolls está sendo chamado sem enviar nenhum parâmetro. A condicional abaixo resolve exceções quando allIlvl é null, ou seja, não é enviado.
    let allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    if (!ilvlItems) {
      allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
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
        ombros: allItemIlvl[2],
        peitoral: allItemIlvl[3],
        manto: allItemIlvl[4],
        pulsos: allItemIlvl[5],
        maos: allItemIlvl[6],
        cintura: allItemIlvl[7],
        pernas: allItemIlvl[8],
        pes: allItemIlvl[9],
        anel1: allItemIlvl[10],
        anel2: allItemIlvl[11],
        berloque1: allItemIlvl[12],
        berloque2: allItemIlvl[13],
        armaPrincipal: allItemIlvl[14],
        armaSecundaria: allItemIlvl[15]
      });
    }
    
    this.setState({ rows });
    let originalRows = rows;
    this.setState({ originalRows });
    let columns = this.columns;
    this.setState({ columns });
  };

  crieLinha = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
    // Por algum motivo o createRolls está sendo chamado sem enviar nenhum parâmetro. A condicional abaixo resolve exceções quando allIlvl é null, ou seja, não é enviado.
    let allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    if (!ilvlItems) {
      allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    }else {
      allItemIlvl = ilvlItems;
    }

      let row = {
        reino: reino,
        avatar: warcraftAPI.getToonImageURL(thumbnail, regiao),
        nome: nome,
        classe: classe,
        spec: spec,
        ilvl: ilvl,
        cabeca: allItemIlvl[0],
        colar: allItemIlvl[1],
        ombros: allItemIlvl[2],
        peitoral: allItemIlvl[3],
        manto: allItemIlvl[4],
        pulsos: allItemIlvl[5],
        maos: allItemIlvl[6],
        cintura: allItemIlvl[7],
        pernas: allItemIlvl[8],
        pes: allItemIlvl[9],
        anel1: allItemIlvl[10],
        anel2: allItemIlvl[11],
        berloque1: allItemIlvl[12],
        berloque2: allItemIlvl[13],
        armaPrincipal: allItemIlvl[14],
        armaSecundaria: allItemIlvl[15]
      };
    
    return row;
  };

  reloadRows = (rows) => {
    for(let i = 0; i < rows.length; i++) {
      this.updateRow(rows[i], this.regiao, rows[i].reino, rows[i].nome);
    }
  };

  updateRow = (row, regiao, reino, nome) => {
    warcraftAPI.getToon(regiao, reino, nome, 3).then((resultado) => {
      if(resultado.status !== "nok") {
        row.classe = warcraftAPI.getToonClass(resultado);
        row.spec = warcraftAPI.getSpecializationName(resultado);
        row.avatar = warcraftAPI.getToonImageURL(resultado.thumbnail, this.regiao);

        let allItemIlvl = warcraftAPI.getToonIlvlAllItems(resultado);
        row.ilvl = warcraftAPI.getToonIlvl(resultado);
        row.cabeca = allItemIlvl[0];
        row.colar = allItemIlvl[1];
        row.ombros = allItemIlvl[2];
        row.peitoral = allItemIlvl[3];
        row.manto = allItemIlvl[4];
        row.pulsos = allItemIlvl[5];
        row.maos = allItemIlvl[6];
        row.cintura = allItemIlvl[7];
        row.pernas = allItemIlvl[8];
        row.pes = allItemIlvl[9];
        row.anel1 = allItemIlvl[10];
        row.anel2 = allItemIlvl[11];
        row.berloque1 = allItemIlvl[12];
        row.berloque2 = allItemIlvl[13];
        row.armaPrincipal = allItemIlvl[14];
        row.armaSecundaria = allItemIlvl[15];
      }
    });
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

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});

      if(updatedRow.nome && updatedRow.reino) {
        updatedRow = atualizaLinha(updatedRow.reino, updatedRow.nome, 'us', 3, this, i, rows);
      }

      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  excluirLinha(column, row) {
    let rows = this.state ? this.state.rows : [];
    rows = rows.filter(x => x.nome !== row.nome);
    let _this = this;
    if(column.key === 'nome') {
      return [
        {
          icon: <Icon name='remove'></Icon>,
          callback: () => { _this.setState({ rows }); }
        },
      ];
    }  
  }

  render() {
    return  (
      <div>
      <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          enableCellSelect={true}
          onGridSort={this.handleGridSort}
          columns={this.state.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500} 
          onGridRowsUpdated={this.handleGridRowsUpdated}
          getCellActions={ (column, row) => this.excluirLinha(column, row) }
          toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
          />
      </DraggableContainer>
      <Button
        onClick={ () => this.props.history.push("/") } 
        secondary style={{ marginTop: 10 }}>
            Voltar
      </Button>
      <Button
        onClick={ () => this.reloadRows(this.state.rows) } 
        secondary style={{ marginTop: 10 }}>
            Atualizar
      </Button>
      <GridSettings />
      </div>
    );
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createRow(reino, nome, regiao, delay, grid) {
  await sleep(delay);
  warcraftAPI.getToon(regiao, reino, nome, 3).then((resultado) => {
    if(resultado.status !== "nok") {
      let ilvl = warcraftAPI.getToonIlvl(resultado);
      let classe = warcraftAPI.getToonClass(resultado);
      let spec = warcraftAPI.getSpecializationName(resultado);
      let ilvlItems = warcraftAPI.getToonIlvlAllItems(resultado);
      let thumbnail = resultado.thumbnail;
      grid.createRows(classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao);
    }
  });
}

async function atualizaLinha(reino, nome, regiao, delay, grid, i, rows) {
  await sleep(delay);
  warcraftAPI.getToon(regiao, reino, nome, 3).then((resultado) => {
    if(resultado.status !== "nok") {
      let ilvl = warcraftAPI.getToonIlvl(resultado);
      let classe = warcraftAPI.getToonClass(resultado);
      let spec = warcraftAPI.getSpecializationName(resultado);
      let ilvlItems = warcraftAPI.getToonIlvlAllItems(resultado);
      let thumbnail = resultado.thumbnail;

      rows[i] = grid.crieLinha(classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao);;

      grid.setState({ rows }); 
    }
  });
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(Grid));