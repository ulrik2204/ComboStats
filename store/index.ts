import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import rootReducer from './reducers/index';

const composeEnhancers =
  (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type GetRootState = typeof store.getState;
export type AppDispatch = ThunkDispatch<RootState, unknown, any>; // was: typeof store.dispatch

// Use throughout app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
