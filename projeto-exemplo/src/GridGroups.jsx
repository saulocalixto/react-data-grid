import React, { Component } from 'react'
import ReactDataGrid from 'react-data-grid'
import { Toolbar, Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import * as Map from "./Maps.js";
import { Icon } from 'semantic-ui-react';

const { DropDownEditor } = Editors;

const regioes = ['us', 'eu'];

class GridCharacters extends Component {

  state = {
      columns: [
          { 
              key: 'id', 
              name: 'ID',
              editable: false,  
          }, 
          {
              key: 'nome_do_grupo', 
              name: 'Nome do grupo',
              editable: true,  
          },
          { 
              key: 'regiao',
              name: 'Região',
              editable: true,  
              editor: <DropDownEditor options={regioes}/>,
            }
      ],
      rows: [],
      id : 0
  };

  componentDidMount = () => {
    let rows = this.state.rows;

    this.setState({ rows });
  }

  createRows = (regiao, nome) => {
    let rows = this.state.rows;

    rows.push({
    nome: nome,
    regiao: regiao,
    });

    this.setState({ rows });
  };

  rowGetter = (i) => {
    return this.props.grupos.length > 0 ? this.props.grupos[i] : null;
  };

  handleAddRow = ({ newRowIndex }) => {
    let ids = this.props.grupos.map(x => x.id);
    let id = ids.length > 0 ? Math.max.apply( null, ids ) + 1 : 1;
    this.setState({ id });
    const newRow = {
        value: newRowIndex,
        reino: '',
        nome: '',
        classe: '',
        id,
        personagens: []
    };
    this.props.AdicionaGrupo(newRow, this.props.grupos);  
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.props.grupos.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.props.AtualizaGrupos(rows);
  };

  irParaGrupo(column, row) {
    let _this = this;
    if(column.key === 'nome_do_grupo') {
      return [
        {
          icon: <Icon name='external alternate'></Icon>,
          callback: () => {
            if(row.nome_do_grupo) {
              _this.props.history.push(`/wow/${row.id}`);
            }
          }
        },
      ];
    }  
  }

  render() {
    return (
        <div>
              <ReactDataGrid
                ref={ node => this.grid = node }
                enableCellSelect={true}
                columns={this.state.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.props.grupos.length}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
                minHeight={450} 
                getCellActions={ (column, row) => this.irParaGrupo(column, row) }
              />
        </div>
    );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(GridCharacters));