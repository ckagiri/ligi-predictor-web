import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadMatches } from './redux';

const mapDispatchToProps = {
  loadMatches
};

const mapStateToProps = state => {
};

class Matches extends Component {
  componentDidMount() {
    this.props.loadMatches();
  }

  render() {
    return (<div>Ligi Predictor Matches</div>);
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Matches);