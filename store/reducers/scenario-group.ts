import { Element } from '.prisma/client';
import { AnyAction, Reducer } from 'redux';

const scenarioGroupReducer: Reducer = (state: Element[][], action: AnyAction) => {};

export const successesReducer: Reducer = (state: Element[][], action: AnyAction) => {
  scenarioGroupReducer(state, action);
};

export const failuresReducer: Reducer = (state: Element[][], action: AnyAction) => {
  scenarioGroupReducer(state, action);
};
