import { combineEpics, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, filter, withLatestFrom, switchMap, merge } from 'rxjs/operators';
import { types } from './';
import { ajax } from 'rxjs/ajax';

import {
  doActionOnError
} from '../../../redux';
import {
  updateUserEmail,
} from '../../../entities';

const updateUserEmailEpic = (action$, state$) => {
  return action$.pipe(
    ofType(types.updateMyEmail),
    withLatestFrom(state$),
    switchMap(([{ payload: email }, state]) => {
      const {
        app: { user: username, csrfToken: _csrf },
        entities: { user: userMap }
      } = state;
      const { email: oldEmail } = userMap[username] || {};
      const body = { _csrf, email };
      const optimisticUpdate = of(
        updateUserEmail(username, email)
      );
      const ajaxUpdate = ajax.post('/update-my-email', body).pipe(
        catchError(doActionOnError(() => oldEmail ?
          updateUserEmail(username, oldEmail) :
          null
        ),
        filter(Boolean)))
      return merge(optimisticUpdate, ajaxUpdate);
    })
  )
};

export default combineEpics(
  updateUserEmailEpic
);
