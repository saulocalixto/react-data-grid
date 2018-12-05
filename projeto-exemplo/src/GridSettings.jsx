import React, { Component } from 'react';
//import { Icon } from 'semantic-ui-react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import * as Map from "./Maps.js";
import { Modal } from 'semantic-ui-react'
import { Icon, Button, Table } from 'semantic-ui-react'
import { Checkbox } from 'semantic-ui-react'
class GridSettings extends Component {

    state = {
        colunasMarcadas: this.obtenhaColunasMarcadas
    }

    handleClick = () => console.log("Click")

    componentDidMount = () => {
        let colunasMarcadas = this.obtenhaColunasMarcadas;
        this.setState({colunasMarcadas})
    }

    obtenhaColunasMarcadas = () => {
        let vetor = [];
        this.props.colunas.reduce((result, value, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            console.log(result);
            return  result;
        }, []).map((item) => {
            item.map(x => {
                if (x.visivel === true) {
                    vetor.push(x);
                }
            })
        })
        console.log(vetor);
        return vetor;
    }

    render() {
        console.log("Colunas marcadas: ",this.state);
        return (
            <Modal trigger={<Icon name="setting" size="big"></Icon>}>
                <Modal.Header>Configuração da visibilidade de campos da tabela</Modal.Header>
                <Modal.Content image>
                {/*<Image wrapped size='small' src='http://s1.1zoom.me/big0/867/421812-Kycb.jpg' />*/}
                <Modal.Description>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            
                        </Table.Row>
                    </Table.Header>
        
                    <Table.Body>
                        {
                            this.props.colunas.reduce((result, value, index, array) => {
                                
                                if (index % 2 === 0) {
                                    result.push(array.slice(index, index + 2));
                                }
                                console.log(result);
                                return  result;
                              }, []).map((par) => (
                                
                                <Table.Row>
                                    {
                                        par.map(x => (
                                            <Table.Cell>
                                                <Checkbox key={x.chave} 
                                                        label={x.label} 
                                                        checked={x.visivel}/>
                                            </Table.Cell>
                                        ))   
                                    }
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
        
                    <Table.Footer>
                        <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Button color="green" 
                                    content="Salvar"
                                    onClick={this.obtenhaColunasMarcadas}/>
                            <Button color="red" 
                                    content="Cancelar"/>
                        </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(GridSettings));
