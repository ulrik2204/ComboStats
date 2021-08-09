import { Population } from '@prisma/client';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { NULL_POPULATION_STATE } from '../../lib/constants-frontend';
import { sortElements } from '../../lib/core';
import {
  CUDElementResponse,
  CUDPopulationResponse,
  ErrorResponse,
  GetPopulationElementsResponse,
} from '../../lib/types';

export const loadingAction = createAction('loading');
export const failureAction = createAction<ErrorResponse>('failure');
export const cuPopulationSuccessAction = createAction<CUDPopulationResponse>('cuSuccess');
export const addElementSuccessAction = createAction<CUDElementResponse>('addElementSuccess');
export const editElementSuccessAction = createAction<CUDElementResponse>('editElementSuccess');
export const deleteElementSuccessAction = createAction<CUDElementResponse>('deleteElementSuccess');
export const getSuccessAction = createAction<GetPopulationElementsResponse>('getSuccess');
export const setPopulationAction = createAction<Population>('setPopulation');
export const deleteSuccessAction = createAction('deletePopulation');

export const populationReducer = createReducer(NULL_POPULATION_STATE, (builder) => {
  builder
    .addCase(loadingAction, (state, action) => {
      state.loading = true;
      state.errorMsg = undefined;
    })
    .addCase(failureAction, (state, action) => {
      state.loading = false;
      state.errorMsg = action.payload.errorMsg;
    })
    .addCase(cuPopulationSuccessAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = { ...action.payload.population, elements: [] };
    })
    .addCase(addElementSuccessAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = {
        ...state.population,
        elements: sortElements([...state.population.elements, action.payload.element]),
      };
    })
    .addCase(editElementSuccessAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      // Remove the element that was edited (with the same id) from the array, and push the new one.
      const editedEl = action.payload.element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== editedEl.elementId,
      );
      newElements.push(editedEl);
      state.population.elements = sortElements(newElements);
    })
    .addCase(deleteElementSuccessAction, (state, action) => {
      // Remove the element that was deleted (with the same id) from the array
      state.loading = false;
      state.errorMsg = undefined;
      const deletedEl = action.payload.element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== deletedEl.elementId,
      );
      state.population.elements = newElements;
    })
    .addCase(getSuccessAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = action.payload.population;
    })
    .addCase(setPopulationAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = { ...action.payload, elements: [] };
    })
    .addCase(deleteSuccessAction, (state, action) => {
      state = NULL_POPULATION_STATE;
    });
});
