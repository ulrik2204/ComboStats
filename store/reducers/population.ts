import { Element } from '@prisma/client';
import { AnyAction, Reducer } from 'redux';

export const populationReducer: Reducer = (state: Element[] = [], action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
