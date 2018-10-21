import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MatchList from './MatchList';
import { getNS, loadRoute } from '../redux';

const mapDispatchToProps = {
  loadRoute
};


const mapStateToProps = state => {
  const isLoading = getNS(state).loading;
  const league = getNS(state).selectedLeagueSlug;
  return {
    isLoading,
    league
  };
};

class Matches extends Component {
  componentDidMount() {
    this.props.loadRoute();
  }

  render() {
    const { isLoading, league } = this.props;
    if (isLoading) {
			return <p>Loading...</p>
    }   
    return league && <MatchList />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Matches);