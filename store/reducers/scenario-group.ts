import { Element } from '.prisma/client';
import { AnyAction, Reducer } from 'redux';

const scenarioGroupReducer: Reducer = (state: Element[][], action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const successesReducer: Reducer = (state: Element[][] = [], action: AnyAction) => {
  return scenarioGroupReducer(state, action);
};

export const failuresReducer: Reducer = (state: Element[][] = [], action: AnyAction) => {
  return scenarioGroupReducer(state, action);
};
