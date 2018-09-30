import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navbar } from 'react-bootstrap';

import {
  clickOnLogo
} from './redux';

const mapStateToProps = () => ({});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clickOnLogo
    },
    dispatch
  );
};

function FCCNav(props) {
  const {
    clickOnLogo
  } = props;
  const withNavProps = Component => (
    <Component
      clickOnLogo={ clickOnLogo }
      key={ Component.displayName }
    />
  );
  return (
    <Navbar
    className='nav-height'
    id='navbar'
    staticTop={ true }
    >
   <p>Something</p>
  </Navbar>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FCCNav);
