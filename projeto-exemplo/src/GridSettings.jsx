import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import * as Map from "./Maps.js";

class GridSettings extends Component {

    state = {

    }

    componentDidMount = () => {
        
    }

    handleClick = () =>  {
          
        this.props.history.push("/wow");
    }
    render() {
        return (
            <Icon name="setting"
                  Secondary Style ={{ marginTop: 10}}>
            </Icon>
        );
    }
}
export default withRouter(connect(Map.mapStateToProps, Map.mapDispatchToProps)(GridSettings));
