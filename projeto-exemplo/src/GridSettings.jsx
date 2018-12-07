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
        modalOpen: false
    }

    handleClick = () => console.log("Click")

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    getMarkedColumns = () => {
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
        
        return (
            <Modal trigger={<Icon name="setting" size="big"></Icon>} 
                >

                <Modal.Header>Configuração da visibilidade de campos da tabela</Modal.Header>
                <Modal.Content>
                
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
                                        //console.log(result);
                                        return  result;
                                    }, []).map((par) => (
                                        
                                        <Table.Row>
                                            {
                                                par.map(x => (
                                                    <Table.Cell>
                                                        <Checkbox key={x.chave} 
                                                                label={x.label} 
                                                                defaultChecked={x.visivel}/>
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
                                    <Modal.Actions>
                                        <Button color="green" 
                                                content="Salvar"
                                                positive/>
                                        <Button color="red" 
                                                content="Cancelar"
                                                onClick={this.close} negative/>
                                    </Modal.Actions>
                                    
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
