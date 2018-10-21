import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getNS, loadRoute, seasonFixturesSelector, roundFixturesSelector } from '../redux';
import { createSelector } from 'reselect';

const mapDispatchToProps = {
  
};

const mapStateToProps = state => {
  const sfixtures = seasonFixturesSelector(state);
  const fixtures = roundFixturesSelector(state);
  return {
    sfixtures,
    fixtures
  };
};

class MatchList extends Component {
  render() {
    return (<div>Ligi Predictor MatchList</div>);
  }
}

export default connect(
  mapStateToProps,
  null
)(MatchList);