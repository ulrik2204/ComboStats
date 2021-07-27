import { Population } from '@prisma/client';
import { Reducer } from 'redux';
import { NULL_POPULATION_STATE } from '../../lib/constants-frontend';
import { sortElements } from '../../lib/core';
import {
  CUDElementResponse,
  CUDPopulationResponse,
  ErrorResponse,
  GetPopulationElementsResponse,
} from '../../lib/types';
import { PopulationState } from '../../lib/types-frontend';
import { PopulationAction, PopulationDispatch, POPULATION_ACTIONS } from '../actions/action-types';

export const populationReducer: Reducer<PopulationState, PopulationAction<object>> = (
  state: PopulationState = NULL_POPULATION_STATE,
  action: PopulationDispatch<CUDPopulationResponse | ErrorResponse>,
) => {
  switch (action.type) {
    case POPULATION_ACTIONS.LOADING:
      return {
        ...state,
        loading: true,
        errorMsg: undefined,
      } as PopulationState;
    case POPULATION_ACTIONS.FAILURE:
      return {
        ...state,
        loading: false,
        errorMsg: (action.payload as ErrorResponse).errorMsg,
      } as PopulationState;
    case POPULATION_ACTIONS.EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMsg: undefined,
        population: {
          ...(action.payload as CUDPopulationResponse).population,
        },
      } as PopulationState;
    case POPULATION_ACTIONS.ADD_ELEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements([
            ...state.population.elements,
            (action.payload as CUDElementResponse).element,
          ]),
        },
      } as PopulationState;
    case POPULATION_ACTIONS.EDIT_ELEMENT_SUCCESS:
      // Remove the element that was edited (with the same id) from the array, and push the new one.
      const editedEl = (action.payload as CUDElementResponse).element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== editedEl.elementId,
      );
      newElements.push(editedEl);
      return {
        ...state,
        loading: false,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements(newElements),
        },
      } as PopulationState;
    case POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS:
      // Remove the element that was deleted (with the same id) from the array
      const deletedEl = (action.payload as CUDElementResponse).element;
      const newEls = state.population.elements.filter((el) => el.elementId !== deletedEl.elementId);
      return {
        ...state,
        loading: false,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements(newEls),
        },
      } as PopulationState;
    case POPULATION_ACTIONS.GET_SUCCESS:
      return {
        loading: false,
        errorMsg: undefined,
        population: {
          ...(action.payload as GetPopulationElementsResponse).population,
        },
      } as PopulationState;
    case POPULATION_ACTIONS.SET_POPULATION:
      return {
        loading: false,
        errorMsg: undefined,
        population: {
          ...state.population,
          ...(action.payload as Population),
          elements: [],
        },
      } as PopulationState;
    case POPULATION_ACTIONS.DELETE_SUCCESS:
      return NULL_POPULATION_STATE;
    default:
      return state;
  }
};
