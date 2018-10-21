import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { onRouteHome } from './redux';

const mapDispatchToProps = {
  onRouteHome
};

const mapStateToProps = state => {
};

class Home extends Component {
  componentDidMount() {
    this.props.onRouteHome();
  }

  render() {
    return (<div>Ligi Predictor Home</div>);
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Home);