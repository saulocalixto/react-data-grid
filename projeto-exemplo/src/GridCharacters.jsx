import React, { Component } from 'react'
import ReactDataGrid from 'react-data-grid-wow'
import { Toolbar, Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import { Button } from 'semantic-ui-react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import * as Map from "./Maps.js";

const { DropDownEditor } = Editors;

const regioes = ['us', 'eu'];

class GridCharacters extends Component {

    state = {
        columns: [
            { 
                key: 'reino',
                name: 'Reino', 
                editable: true,   
            },
            { 
                key: 'nome', 
                name: 'Nome',
                editable: true,  
            },
            { 
                key: 'regiao',
                name: 'Regiao',
                editable: true,  
                editor: <DropDownEditor options={regioes}/>,
             },
        ],
        rows: []
      };

      componentDidMount = () => {
      }

      handleClick = () =>  {
        this.props.EnviaPersonagens(this.state.rows);  
        this.props.history.push("/wow");
      }

      createRows = (regiao, reino, nome) => {
        let rows = this.state.rows;
    
        rows.push({
        reino: reino,
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
  
    render() {
      return (
          <div>
                <ReactDataGrid
                ref={ node => this.grid = node }
                    enableCellSelect={true}
                    columns={this.state.columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    enableRowSelect={true}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
                    minHeight={450} />

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