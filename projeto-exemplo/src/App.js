import React, { Component } from 'react';
import './App.css';
import Grid from './Grid'
import GridCharacters from './GridCharacters'
import { Header } from 'semantic-ui-react'
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";

class App extends Component {

  render() {
    return (
      <div className="App" style={{ padding: 10 }}>
      <Route
                exact
                path="/wow"
                render={() => (
                  <Grid /> 
                )}
              />

        <Route
                exact
                path="/"
                render={() => (
                  <div>
                    <Header as='h1'>Adicione os personagens que deseja ver...</Header>
                    <GridCharacters />
                  </div>
                )}
              />
      </div>
    );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(App));
