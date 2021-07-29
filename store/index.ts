import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../lib/types-frontend';
import { populationReducer } from './reducers/population';
import { failuresReducer, successesReducer } from './reducers/scenario-group';

const store = configureStore({
  reducer: {
    population: populationReducer,
    successes: successesReducer,
    failures: failuresReducer,
  },
});
export default store;

// Use throughout app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
