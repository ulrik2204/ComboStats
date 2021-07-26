import { AnyAction, Reducer } from 'redux';
import { NULL_FAILURES_STATE, NULL_SUCCESSES_STATE } from '../../lib/constants-frontend';
import { ScenarioGroupState } from '../../lib/types-frontend';

const scenarioGroupReducer: Reducer = (state: ScenarioGroupState, action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const successesReducer: Reducer = (
  state: ScenarioGroupState = NULL_SUCCESSES_STATE,
  action: AnyAction,
) => {
  return scenarioGroupReducer(state, action);
};

export const failuresReducer: Reducer = (
  state: ScenarioGroupState = NULL_FAILURES_STATE,
  action: AnyAction,
) => {
  return scenarioGroupReducer(state, action);
};
