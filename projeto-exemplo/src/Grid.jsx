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
import jsonFile from 'jsonfile'

const {
  DraggableHeader: { DraggableContainer }
} = require('react-data-grid-addons');

// Formatter das colunas, usado para colorir determinadas células
class ColumnFormatter extends React.Component{

  constructor(props){
    super(props);
    this.opts = this.props.options;
  }

  averageIlvl = 370;

  render(){
    var backgroundColor = "#FFFFFF";
    var textColor = '#000000';
    
    backgroundColor = warcraftAPI.getDefaultColor(this.props.value, this.averageIlvl);

    switch(backgroundColor) {
      default:
        textColor = '#FFFFFF';
        break;
      case '#18f942':
        textColor = '#000000';
        break;
    }

    return (<div style={{backgroundColor:backgroundColor, color: textColor}}>{this.props.value}</div>);
  }
}

class Grid extends Component {

  state = {
    rows: [],
    columns: [
      { key: 'reino',           name: 'Reino',            width: 170,                 draggable: true, visivel: true,   editable: true                                       },
      { key: 'nome',            name: 'Nome',             width: 170, sortable: true, draggable: true, visivel: true,   editable: true                                       },
      { key: 'avatar',          name: 'Avatar',           width: 60,                  draggable: true, visivel: true,                   formatter: Formatters.ImageFormatter },
      { key: 'classe',          name: 'Classe',                       sortable: true, draggable: true, visivel: true,                                                        },
      { key: 'spec',            name: 'Especialização',   width: 150, sortable: true, draggable: true, visivel: true,                                                        },
      { key: 'ilvl',            name: 'Item Level',                   sortable: true, draggable: true, visivel: true,                   formatter: ColumnFormatter           },
      { key: 'cabeca',          name: 'Cabeça',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'colar',           name: 'Colar',                        sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'ombros',          name: 'Ombros',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'peitoral',        name: 'Peitoral',                     sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'manto',           name: 'Manto',                        sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'pulsos',          name: 'Pulsos',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'maos',            name: 'Mãos',                         sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'cintura',         name: 'Cintura',                      sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'pernas',          name: 'Pernas',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'pes',             name: 'Pés',                          sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'anel1',           name: 'Anel 1',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'anel2',           name: 'Anel 2',                       sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'berloque1',       name: 'Berloque 1',       width: 100, sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'berloque2',       name: 'Berloque 2',       width: 100, sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'armaPrincipal',   name: 'Arma Principal',   width: 140, sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           },
      { key: 'armaSecundaria',  name: 'Arma Secundária',  width: 140, sortable: true, draggable: true, visivel: false,                  formatter: ColumnFormatter           }
    ],
    originalRows: [],
    regiao : ''
  };

  componentDidMount = () => {
    let regiao = this.props.grupo ? this.props.grupo.regiao : '';

      let rows = this.props.grupo ? this.props.grupo.personagens : [];

    this.setState({ regiao, rows })
  }

  componentWillUnmount = () => {
    ////this.saveJson();
  }

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

  createRow(personagemId) {
    warcraftAPI.getToon(personagemId.regiao, personagemId.reino, personagemId.nome).then((resultado) => {
      if(resultado.status !== "nok") {
        let ilvl = warcraftAPI.getToonIlvl(resultado);
        let classe = warcraftAPI.getToonClass(resultado);
        let spec = warcraftAPI.getSpecializationName(resultado);
        let ilvlItems = warcraftAPI.getToonIlvlAllItems(resultado);
        let thumbnail = resultado.thumbnail;
        this.createRows(classe, spec, ilvl, ilvlItems, personagemId.nome, personagemId.reino, thumbnail, personagemId.regiao);
      }
    });
  }

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
    let rows = this.state.rows;
    let grupos = this.props.grupos;

    if(this.state.rows.find(x => x.nome === nome && x.reino === reino)) {
      return;
    }

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
    
    let originalRows = rows;
    let grupo = this.props.grupo;
    grupos = grupos.filter(x => x.id !== grupo.id);
    grupo.personagens = rows;
    grupos.push(grupo); 
    this.setState({ originalRows, rows });
    this.props.AtualizaGrupos(grupos);
  };

  saveJson = () => {
    let grupos = this.props.grupos;
    jsonFile.writeFile("./grupos.json", grupos);
  }

  getAverageIlvl = (rows) => {
    var averageIlvl = 0;
    rows.forEach(row => {
      averageIlvl += row.ilvl;
    });
    averageIlvl = averageIlvl / rows.length;
    return averageIlvl;
  }

  reloadRows = (rows) => {
    for(let i = 0; i < rows.length; i++) {
      this.updateRow(rows[i], this.regiao, rows[i].reino, rows[i].nome);
    }
  };

  updateRow = (row, regiao, reino, nome) => {
    warcraftAPI.getToon(regiao, reino, nome).then((resultado) => {
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

    const columnSourceIndex = stateCopy.columns.findIndex(
      i => i.key === source
    );
    const columnTargetIndex = stateCopy.columns.findIndex(
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
      let personagemId = {
        reino: updatedRow.reino,
        nome: updatedRow.nome,
        regiao: this.state.regiao
      }
      if(updatedRow.nome !== "" && updatedRow.reino !== "") {
        let newRows = rows.filter(x => x.value !== updatedRow.value);
        this.setState({ rows: newRows });
        updatedRow = this.createRow(personagemId);
      } else {
        rows[i] = updatedRow;
        this.setState({ rows })
      }
    }
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
        <div className={"controle"} style={{ paddingBottom: 10, float: "right" }}>
          <Button
            onClick={ () => this.props.history.push("/") } 
            secondary>
                Voltar
          </Button>
          <Button
            onClick={ () => this.reloadRows(this.state.rows) } 
            secondary>
                Atualizar
          </Button>
          <GridSettings 
            colunas={ this.state.columns.map(x => { return { chave: x.key, label: x.name, visivel: x.visivel } }) }/>
        </div>
      <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          enableCellSelect={true}
          onGridSort={this.handleGridSort}
          columns={this.state.columns.filter(x => x.visivel)}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500} 
          onGridRowsUpdated={this.handleGridRowsUpdated}
          getCellActions={ (column, row) => this.excluirLinha(column, row) }
          toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
          />
      </DraggableContainer>  
      </div>
    );
  }
} 

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(Grid));