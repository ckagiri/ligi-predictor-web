import { combineEpics } from 'redux-observable';
import { getCart } from '../reducers';
import { api } from '../services';
import * as actions from '../actions';
import { of } from 'rxjs';
import { catchError, withLatestFrom, switchMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';

const searchProducts = action$ => action$.pipe(
  ofType(actions.GET_ALL_PRODUCTS),
  switchMap(action => {
    console.log('action', action)
    /*
      * This example uses the same api of the redux-saga example, thus
      * it adapts a Promise to an Observable.
      */
    return api.getProducts().pipe(map(actions.receiveProducts))
  })
);

const checkout = (action$, state$) => {
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

export const rootEpic = combineEpics(
  searchProducts,
  checkout
);




