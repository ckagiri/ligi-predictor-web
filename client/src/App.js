import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NotFound } from './NotFound';
import { mainRouteSelector } from './routes/redux';
import Home from './Home';

import ns from './ns.json';
import {
  appMounted,
  loadUser,
} from './redux';

const mapDispatchToProps = {
  appMounted,
  loadUser
};

const mapStateToProps = state => {
  const route = mainRouteSelector(state);
  return {
    route
  };
};

const routes = {
  home: Home
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
    const Child = routes[route] || NotFound;
    return (
      <div className={ `${ns}-container` }>
        <Child />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IgilPredictor);