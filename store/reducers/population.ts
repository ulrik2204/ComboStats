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

export const loading = createAction('loading');
export const failure = createAction<ErrorResponse>('failure');
export const cuSuccess = createAction<CUDPopulationResponse>('cuSuccess');
export const addElementSuccess = createAction<CUDElementResponse>('addElementSuccess');
export const editElementSuccess = createAction<CUDElementResponse>('editElementSuccess');
export const deleteElementSuccess = createAction<CUDElementResponse>('deleteElementSuccess');
export const getSuccess = createAction<GetPopulationElementsResponse>('getSuccess');
export const setPopulationAction = createAction<Population>('setPopulation');
export const deleteSuccess = createAction('deletePopulation');

export const populationReducer = createReducer(NULL_POPULATION_STATE, (builder) => {
  builder
    .addCase(loading, (state, action) => {
      state.loading = true;
      state.errorMsg = undefined;
    })
    .addCase(failure, (state, action) => {
      state.loading = false;
      state.errorMsg = action.payload.errorMsg;
    })
    .addCase(cuSuccess, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = { ...action.payload.population, elements: [] };
    })
    .addCase(addElementSuccess, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = {
        ...state.population,
        elements: sortElements([...state.population.elements, action.payload.element]),
      };
    })
    .addCase(editElementSuccess, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      // Remove the element that was edited (with the same id) from the array, and push the new one.
      const editedEl = action.payload.element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== editedEl.elementId,
      );
      state.population.elements = newElements;
    })
    .addCase(deleteElementSuccess, (state, action) => {
      // Remove the element that was deleted (with the same id) from the array
      state.loading = false;
      state.errorMsg = undefined;
      const deletedEl = action.payload.element;
      const newElements = state.population.elements.filter(
        (el) => el.elementId !== deletedEl.elementId,
      );
      state.population.elements = newElements;
    })
    .addCase(getSuccess, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = action.payload.population;
    })
    .addCase(setPopulationAction, (state, action) => {
      state.loading = false;
      state.errorMsg = undefined;
      state.population = { ...action.payload, elements: [] };
    })
    .addCase(deleteSuccess, (state, action) => {
      state = NULL_POPULATION_STATE;
    });
});

// export const populationsReducer: Reducer<PopulationState, PopulationAction<object>> = (
//   state: PopulationState = NULL_POPULATION_STATE,
//   action: PopulationActionTypes<CUDPopulationResponse | ErrorResponse>,
// ) => {
//   switch (action.type) {
//     case POPULATION_ACTIONS.LOADING:
//       return {
//         ...state,
//         loading: true,
//         errorMsg: undefined,
//       } as PopulationState;
//     case POPULATION_ACTIONS.FAILURE:
//       return {
//         ...state,
//         loading: false,
//         errorMsg: (action.payload as ErrorResponse).errorMsg,
//       } as PopulationState;
//     case POPULATION_ACTIONS.CU_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...(action.payload as CUDPopulationResponse).population,
//           elements: [],
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.ADD_ELEMENT_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...state.population,
//           elements: sortElements([
//             ...state.population.elements,
//             (action.payload as CUDElementResponse).element,
//           ]),
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.EDIT_ELEMENT_SUCCESS:
//       // Remove the element that was edited (with the same id) from the array, and push the new one.
//       const editedEl = (action.payload as CUDElementResponse).element;
//       const newElements = state.population.elements.filter(
//         (el) => el.elementId !== editedEl.elementId,
//       );
//       newElements.push(editedEl);
//       return {
//         ...state,
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...state.population,
//           elements: sortElements(newElements),
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.DELETE_ELEMENT_SUCCESS:
//       // Remove the element that was deleted (with the same id) from the array
//       const deletedEl = (action.payload as CUDElementResponse).element;
//       const newEls = state.population.elements.filter((el) => el.elementId !== deletedEl.elementId);
//       return {
//         ...state,
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...state.population,
//           elements: sortElements(newEls),
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.GET_SUCCESS:
//       return {
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...(action.payload as GetPopulationElementsResponse).population,
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.SET_POPULATION:
//       return {
//         loading: false,
//         errorMsg: undefined,
//         population: {
//           ...state.population,
//           ...(action.payload as Population),
//           elements: [],
//         },
//       } as PopulationState;
//     case POPULATION_ACTIONS.DELETE_SUCCESS:
//       return NULL_POPULATION_STATE;
//     default:
//       return state;
//   }
// };
