import React from 'react';
import {connect} from 'react-redux'
import { showUpdateEmailViewSelector } from './redux';
import Settings from './Settings';
import UpdateEmail from './routes/update-email';

const mapStateToProps = state => ({
  showUpdateEmailView: showUpdateEmailViewSelector(state)
});

export function ShowSettings({ showUpdateEmailView }) {
  let ChildComponent = Settings;

  if (showUpdateEmailView) {
    ChildComponent = UpdateEmail;
  }

  return (
    <ChildComponent />
  );
}

export default connect(
  mapStateToProps
)(ShowSettings);
