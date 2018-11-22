import React, { Component } from 'react';
//import { Icon } from 'semantic-ui-react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import * as Map from "./Maps.js";
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import { Checkbox } from 'semantic-ui-react'
class GridSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    
    
    render() {
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
                        <Table.Row>
                            <Table.Cell><Checkbox label='Reino' /></Table.Cell>
                            <Table.Cell><Checkbox label='Nome' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Avatar' /></Table.Cell>
                            <Table.Cell><Checkbox label='Classe' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Especialização' /></Table.Cell>
                            <Table.Cell><Checkbox label='Item Level' /></Table.Cell>
                            
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Cabeça' /></Table.Cell>
                            <Table.Cell><Checkbox label='Colar' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Ombros' /></Table.Cell>
                            <Table.Cell><Checkbox label='Peitoral' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Manto' /></Table.Cell>
                            <Table.Cell><Checkbox label='Pulsos' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Mãos' /></Table.Cell>
                            <Table.Cell><Checkbox label='Cintura' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Checkbox label='Pernas' /></Table.Cell>
                            <Table.Cell><Checkbox label='Pés' /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
        
                    <Table.Footer>
                        <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Menu floated='right' pagination>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron left' />
                            </Menu.Item>
                            <Menu.Item as='a'>1</Menu.Item>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron right' />
                            </Menu.Item>
                            </Menu>
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
