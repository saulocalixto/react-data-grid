import React, { Component } from 'react';
import './App.css';
import Grid from './Grid'
import { Header } from 'semantic-ui-react'
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import * as Map from "./Maps.js";
import GridGroups from './GridGroups';

class App extends Component {

  render() {
    return (
      <div className="App" style={{ padding: 10 }}>
      <Route
                exact
                path="/:groupId"
                render={({match}) => (
                  <div>
                    {match.params.groupId}
                    <Grid /> 
                  </div>                  
                )}
              />

        <Route
                exact
                path="/"
                render={() => (
                  <div>
                    <Header as='h3'>Meus grupos</Header>
                    <GridGroups />
                  </div>
                )}
              />
      </div>
    );
  }
}

export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(App));
