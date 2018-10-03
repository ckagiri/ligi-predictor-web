import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NotFound } from './NotFound';
import { mainRouteSelector } from './routes/redux';
import Settings from './routes/Settings';
import Home from './routes/Home';

import logo from './logo.svg';
import './App.css';

import ns from './ns.json';
import {
  appMounted,
  fetchUser,

  isSignedInSelector
} from './redux';

const mapDispatchToProps = {
  appMounted,
  fetchUser
};

const mapStateToProps = state => {
  const isSignedIn = isSignedInSelector(state);
  const route = mainRouteSelector(state);
  return {
    toast: state.app.toast,
    isSignedIn,
    route
  };
};

const routes = {
  settings: Settings,
  home: Home
};

class IgilPredictor extends Component {
  componentDidMount() {
    //this.props.appMounted();
    this.props.fetchUser();
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