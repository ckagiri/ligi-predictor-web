import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  compose,
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { selectLocationState, connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';

import appReducer from './reducer.js';
import routesMap from './routes-map.js';
import epics from './epics.js';
import App from './App';

const rootEpic = combineEpics( ...epics);

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    window: typeof window !== 'undefined' ? window : {},
    location: typeof window !== 'undefined' ? window.location : {},
    document: typeof window !== 'undefined' ? document : {}
  }
});

const history = createHistory();

const {
  reducer: routesReducer,
  middleware: routesMiddleware,
  enhancer: routesEnhancer
} = connectRoutes(history, routesMap);

routesReducer.toString = () => 'location';

const enhancer = compose(
  routesEnhancer,
  applyMiddleware(
    routesMiddleware,
    epicMiddleware
  )
);

const reducer = combineReducers(
  appReducer, routesReducer
);

const defaultState = {};

const createRootKey = () => Math.random();
const rootKey = createRootKey();
const store = reduxCreateStore(reducer, defaultState, enhancer);
const location = selectLocationState(store.getState());

epicMiddleware.run(rootEpic);

render(
  <Provider key={rootKey} store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
