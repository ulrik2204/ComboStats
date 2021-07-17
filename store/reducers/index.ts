import { combineReducers } from 'redux';
import { populationReducer } from './population';
import { failuresReducer, successesReducer } from './scenario-group';

const rootReducer = combineReducers({
  population: populationReducer,
  successes: successesReducer,
  failures: failuresReducer,
});

export default rootReducer;
