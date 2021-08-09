import { ScenarioGroup, ScenarioGroupType } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NULL_FAILURES_STATE, NULL_SUCCESSES_STATE } from '../../lib/constants-frontend';
import { fixScenarios } from '../../lib/core';
import {
  CUDScenarioGroupResponse,
  CUScenarioResponse,
  DeleteScenarioResponse,
  ErrorResponse,
  GetScenarioGroupScenariosResponse,
} from '../../lib/types';

const getInitialState = (type: ScenarioGroupType) =>
  type === 'SUCCESSES' ? NULL_SUCCESSES_STATE : NULL_FAILURES_STATE;

const scenarioGroupSlice = (scenarioGroupType: ScenarioGroupType) =>
  createSlice({
    name: `ScenarioGroup${scenarioGroupType}`, // `ScenarioGroupSlice_${scenarioGroupType}`,
    // TODO: Add a check for actions when that is appicable.
    initialState: getInitialState(scenarioGroupType),
    reducers: {
      loading: (state) => {
        state.loading = true;
        state.errorMsg = undefined;
      },
      failure: (state, action: PayloadAction<ErrorResponse>) => {
        state.loading = false;
        state.errorMsg = action.payload.errorMsg;
      },
      setScenarioGroup: (state, action: PayloadAction<ScenarioGroup>) => {
        state.loading = false;
        state.errorMsg = undefined;
        state.scenarioGroup = { ...action.payload, scenarios: [] };
      },
      cuScenarioGroupSuccess: (state, action: PayloadAction<CUDScenarioGroupResponse>) => {
        state.loading = false;
        state.errorMsg = undefined;
        state.scenarioGroup = { ...action.payload.scenarioGroup, scenarios: [] };
      },
      deleteScenarioGroupSuccess: (state, action: PayloadAction<CUDScenarioGroupResponse>) => {
        state = getInitialState(scenarioGroupType);
      },
      getScenarioGroupSuccess: (
        state,
        action: PayloadAction<GetScenarioGroupScenariosResponse>,
      ) => {
        state.loading = false;
        state.errorMsg = undefined;
        state.scenarioGroup = action.payload.scenarioGroup;
      },
      addScenarioSuccess: (state, action: PayloadAction<CUScenarioResponse>) => {
        state.loading = false;
        state.errorMsg = undefined;
        // Sort and
        state.scenarioGroup.scenarios = fixScenarios([
          ...state.scenarioGroup.scenarios,
          action.payload.scenario,
        ]);
      },
      editScenarioSuccess: (state, action: PayloadAction<CUScenarioResponse>) => {
        state.loading = false;
        state.errorMsg = undefined;
        const editedScenario = action.payload.scenario;
        const newScenarios = state.scenarioGroup.scenarios.filter(
          (scenario) => scenario.scenarioId !== editedScenario.scenarioId,
        );
        newScenarios.push(editedScenario);
        state.scenarioGroup.scenarios = fixScenarios(newScenarios);
      },
      deleteScenarioSuccess: (state, action: PayloadAction<DeleteScenarioResponse>) => {
        state.loading = false;
        state.errorMsg = undefined;
        const deletedScenario = action.payload.scenario;
        const newScenarios = state.scenarioGroup.scenarios.filter(
          (scenario) => scenario.scenarioId !== deletedScenario.scenarioId,
        );
        state.scenarioGroup.scenarios = newScenarios;
      },
    },
  });

const successesSlice = scenarioGroupSlice(ScenarioGroupType.SUCCESSES);

export const successesReducer = successesSlice.reducer;
export const successesActions = successesSlice.actions;

const failuresSlice = scenarioGroupSlice(ScenarioGroupType.FAILURES);

export const failuresReducer = failuresSlice.reducer;
export const failuresActions = failuresSlice.actions;
