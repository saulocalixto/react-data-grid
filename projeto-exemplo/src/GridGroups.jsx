import React, { Component } from 'react'
import ReactDataGrid from 'react-data-grid'
import { Toolbar, Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import { Button } from 'semantic-ui-react'
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
      rows: []
  };

  componentDidMount = () => {
    let rows = this.state.rows;

    rows.push({
      id: '001',
      nome_do_grupo: 'Grupo 1',
      regiao: 'us',
    });

    rows.push({
      id: '002',
      nome_do_grupo: 'Grupo 2',
      regiao: 'us',
    });

    rows.push({
      id: '003',
      nome_do_grupo: 'Grupo 3',
      regiao: 'us',
    });

    this.setState({ rows });
  }

  handleClick = () =>  {
    this.props.EnviaPersonagens(this.state.rows);  
    this.props.history.push("/wow");
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
    return this.state.rows.length > 0 ? this.state.rows[i] : null;
  };

  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
        value: newRowIndex,
        reino: '',
        nome: '',
        classe: '',
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  irParaGrupo(column, row) {
    let _this = this;
    if(column.key === 'nome_do_grupo') {
      return [
        {
          icon: <Icon name='external alternate'></Icon>,
          callback: () => {
            _this.props.history.push("/wow");
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
                rowsCount={this.state.rows.length}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
                minHeight={450} 
                //getCellActions={this.getCellActions}
                getCellActions={ (column, row) => this.irParaGrupo(column, row) }
              />

              <Button
                  onClick={this.handleClick} 
                  secondary style={{ marginTop: 10 }}>
                      Continue
              </Button>

              </div>
    );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(GridCharacters));