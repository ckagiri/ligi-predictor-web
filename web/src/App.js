import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NotFound } from './not-found';

import { nsToComponent } from './routes';
import { mainRouterSelector } from './routes/redux';


import { routesMapSelector } from './router/redux';
import { paramsSelector } from './router/redux';
import { querySelector } from './router/redux';
import { selectLocationState } from 'redux-first-router';

import {
  loadUser,
} from './redux';

const mapDispatchToProps = {
  loadUser
};

const mapStateToProps = state => {

  const route = mainRouterSelector(state);
  const params = paramsSelector(state);
  const query = querySelector(state);
  const routesMap = routesMapSelector(state);
  const location = selectLocationState(state);
  return {
    route
  };
};

class IgilPredictor extends Component {
  componentDidMount() {
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