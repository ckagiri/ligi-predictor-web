import { Observable } from 'rx';
import { combineEpics, ofType } from 'redux-epic';
import {
  types
} from './';
import {
  doActionOnError
} from '../../../redux';
import {
  updateUserEmail,
} from '../../../entities';

import { postJSON$ } from '../utils/ajax-stream';

function updateUserEmailEpic(actions, { getState }) {
  return actions::ofType(types.updateMyEmail)
    .flatMap(({ payload: email }) => {
      const {
        app: { user: username, csrfToken: _csrf },
        entities: { user: userMap }
      } = getState();
      const { email: oldEmail } = userMap[username] || {};
      const body = { _csrf, email };
      const optimisticUpdate = Observable.just(
        updateUserEmail(username, email)
      );
      const ajaxUpdate = postJSON$('/update-my-email', body)
        .catch(doActionOnError(() => oldEmail ?
          updateUserEmail(username, oldEmail) :
          null
        ))
        .filter(Boolean);
      return Observable.merge(optimisticUpdate, ajaxUpdate);
    });
}

export default combineEpics(
  updateUserEmailEpic
);
