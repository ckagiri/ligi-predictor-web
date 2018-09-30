import React from 'react';

import { showUpdateEmailViewSelector } from './redux';
import Settings from './Settings.jsx';
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
