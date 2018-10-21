import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getNS, loadRoute, seasonFixturesSelector, roundFixturesSelector, selectGameRound } from '../redux';
import { createSelector } from 'reselect';

const mapDispatchToProps = {
  selectGameRound
};

const mapStateToProps = state => {
  const fixtures = roundFixturesSelector(state);
  return {
    fixtures
  };
};

class MatchList extends Component {
  render() {
    return (
      <div>Ligi Predictor MatchList 
        <br/>
        <ul>
          { this.props.fixtures.map(f => 
            (<li key={f.id}><span>{f.slug}</span></li>))
          }
        </ul>
        <button onClick={this.props.selectGameRound}>Next</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchList);