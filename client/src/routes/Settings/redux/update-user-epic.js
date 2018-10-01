import { combineEpics, ofType } from 'redux-observable';
import * as actions from '../../../actions';
import { of } from 'rxjs';
import { catchError, withLatestFrom, switchMap, map } from 'rxjs/operators';
import { getCart } from '../../../reducers';
import { api } from '../../../services';

import {
  doActionOnError
} from '../../../redux';
import {
  updateUserEmail,
} from '../../../entities';

import { ajax } from 'rxjs/ajax';

const updateUserEmailEpic = (action$, state$) => {
  return action$.pipe(
    ofType(actions.CHECKOUT_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      console.log('action', action);
      const cart = getCart(state);
      return api.buyProducts(cart).pipe(
        map(cart => actions.checkoutSuccess(cart)),
        catchError(error => of(actions.checkoutFailure(error)))
      )
    })
  )
};



// const updateUserEmailEpic = action$.pipe(), { getState }) {
//   return actions::ofType(types.updateMyEmail)
//     .flatMap(({ payload: email }) => {
//       const {
//         app: { user: username, csrfToken: _csrf },
//         entities: { user: userMap }
//       } = getState();
//       const { email: oldEmail } = userMap[username] || {};
//       const body = { _csrf, email };
//       const optimisticUpdate = Observable.just(
//         updateUserEmail(username, email)
//       );
//       const ajaxUpdate = postJSON$('/update-my-email', body)
//         .catch(doActionOnError(() => oldEmail ?
//           updateUserEmail(username, oldEmail) :
//           null
//         ))
//         .filter(Boolean);
//       return Observable.merge(optimisticUpdate, ajaxUpdate);
//     });
// }

export default combineEpics(
  updateUserEmailEpic
);
