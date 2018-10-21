import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadRoute } from './redux';

const mapDispatchToProps = {
  loadRoute
};

const mapStateToProps = state => {
  const matchesLoaded = state.matches.loaded
  return {
    matchesLoaded
  };
};

class Matches extends Component {
  componentDidMount() {
    this.props.loadRoute();
  }

  render() {
    return (<div>Ligi Predictor Matches</div>);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Matches);