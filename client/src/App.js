import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NotFound } from './NotFound';

import { nsToComponent } from './routes';
import { mainRouterSelector } from './routes/redux';


import { routesMapSelector } from './Router/redux';
import { paramsSelector } from './Router/redux';
import { querySelector } from './Router/redux';
import { selectLocationState } from 'redux-first-router';


import {
  appMounted,
  loadUser,
} from './redux';

const mapDispatchToProps = {
  appMounted,
  loadUser
};

const mapStateToProps = state => {

  const route = mainRouterSelector(state);
  const params = paramsSelector(state);
  const query = querySelector(state);
  const routesMap = routesMapSelector(state);
  const locatioin = selectLocationState(state);



  return {
    route
  };
};

class IgilPredictor extends Component {
  componentDidMount() {
    this.props.appMounted();
    this.props.loadUser();
  }

  render() {
    const {
      route
    } = this.props;
    const Child = nsToComponent[route] || NotFound;
    return (
      <div className={ `container` }>
        <Child />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IgilPredictor);