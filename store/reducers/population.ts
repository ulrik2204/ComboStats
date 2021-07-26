import { Reducer } from 'redux';
import { NULL_POPULATION_STATE } from '../../lib/constants';
import { sortElements } from '../../lib/core';
import {
  CUDElementResponse,
  CUDPopulationResponse,
  ErrorResponse,
  PopulationState,
} from '../../lib/types';
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
      };
    case POPULATION_ACTIONS.FAILURE:
      return {
        ...state,
        loading: false,
        errorMsg: (action.payload as ErrorResponse).errorMsg,
      };
    case POPULATION_ACTIONS.EDIT_SUCCESS:
      return {
        ...state,
        ...(action.payload as CUDPopulationResponse).population,
        loading: false,
        errorMsg: undefined,
      };
    case POPULATION_ACTIONS.ADD_ELEMENT_SUCCESS:
      return {
        ...state,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements([
            ...state.population.elements,
            (action.payload as CUDElementResponse).element,
          ]),
        },
      };
    case POPULATION_ACTIONS.EDIT_ELEMENT_SUCCESS:
      // Remove the element that was edited (with the same id) from the array, and push the new one.
      const editedEl = (action.payload as CUDElementResponse).element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== editedEl.elementId,
      );
      newElements.push(editedEl);
      return {
        ...state,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements(newElements),
        },
      };
    case POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS:
      // Remove the element that was deleted (with the same id) from the array
      const deletedEl = (action.payload as CUDElementResponse).element;
      const newEls = state.population.elements.filter((el) => el.elementId !== deletedEl.elementId);
      return {
        ...state,
        errorMsg: undefined,
        population: {
          ...state.population,
          elements: sortElements(newEls),
        },
      };
    default:
      return state;
  }
};
