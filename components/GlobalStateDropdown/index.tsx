import { Population, ScenarioGroup } from '@prisma/client';
import { FC, useCallback, useEffect, useReducer } from 'react';
import { getPopulationsOnUserFromAPI, getScenarioGroupsFromAPI } from '../../lib/api-calls';
import { GetAllPopulationsResponse, GetScenarioGroupsResponse } from '../../lib/types';
import { FormInput } from '../../lib/types-frontend';
import { useForm, useToast } from '../../lib/utils-frontend';
import {
  createPopulationTAction,
  deletePopulationTAction,
  editPopulationTAction,
  getPopulationTAction,
} from '../../store/actions/population-actions';
import {
  createScenarioGroupTAction,
  deleteScenarioGroupTAction,
  editScenarioGroupTAction,
  getScenarioGroupTAction,
} from '../../store/actions/scenario-group-actions';
import { useAppDispatch, useAppSelector } from '../../store/index';
import { setPopulationAction } from '../../store/reducers/population';
import { successesActions } from '../../store/reducers/scenario-group';
import Dropdown from '../Dropdown/index';
import FormTemplate from '../FormTemplate/index';
import Popup from '../Popup/index';

type GlobalStateDropdownProps = {
  type: 'population' | 'successes';
  className?: string;
};

type ThisState = {
  populations: Population[];
  currentName: string;
  scenarioGroups: ScenarioGroup[];
  openPopup: boolean;
  popupState: 'Add' | 'Edit';
};

enum THIS_ACTION {
  FIELD = 'FIELD',
  FIELDS = 'FIELDS',
}

type ThisAction = {
  type: THIS_ACTION;
  payload: any;
};

const setField = (field: keyof ThisState, value: ThisState[typeof field]) => {
  return {
    type: THIS_ACTION.FIELD,
    payload: {
      field,
      value,
    },
  };
};

const setFields = (
  fields: [keyof ThisState, keyof ThisState],
  values: [ThisState[typeof fields[0]], ThisState[typeof fields[1]]],
) => {
  return {
    type: THIS_ACTION.FIELDS,
    payload: {
      fields,
      values,
    },
  };
};

const thisStateReducer = (state: ThisState, action: ThisAction) => {
  switch (action.type) {
    case THIS_ACTION.FIELD:
      const field = action.payload.field;
      return {
        ...state,
        [field]: action.payload.value,
      };
    case THIS_ACTION.FIELDS:
      return {
        ...state,
        [action.payload.fields[0]]: action.payload.values[0],
        [action.payload.fields[1]]: action.payload.values[1],
      };
    default:
      return state;
  }
};

const initialState: ThisState = {
  populations: [],
  scenarioGroups: [],
  currentName: '',
  openPopup: false,
  popupState: 'Add',
};

const initialNameForm: FormInput[][] = [[{ value: '', label: 'Name', type: 'string' }]];

/**
 * Conponent that handles setting of and creating populations and scenario groups as the global state.
 * @param props
 */
const GlobalStateDropdown: FC<GlobalStateDropdownProps> = (props) => {
  const toast = useToast();
  const [formState, formDispatch] = useForm(initialNameForm);
  const populationState = useAppSelector((state) => state.population);
  const successesState = useAppSelector((state) => state.successes);
  const appDispatch = useAppDispatch();
  const [thisState, thisDispatch] = useReducer(thisStateReducer, initialState);
  const usedLabel = props.type === 'population' ? 'deck' : 'combos';
  const relevantList =
    props.type === 'population' ? thisState.populations : thisState.scenarioGroups;
  // TODO: Add if statement os relevant global also can be successes
  // const relevantGlobal =
  //   props.type === 'population' ? populationState.population : successesState.scenarioGroup;
  const setRelevantGlobal = (newValue: any) => {
    if (props.type === 'population') return appDispatch(setPopulationAction(newValue));
    else return appDispatch(successesActions.setScenarioGroup(newValue));
  };

  // Find the correct get api call depending on type
  const relevantGetFromAPI = useCallback(() => {
    if (props.type === 'population') return getPopulationsOnUserFromAPI();
    else return getScenarioGroupsFromAPI(populationState.population.populationId, 'successes');
  }, [props.type]);

  const relevantGetDataFromAPI = useCallback(() => {
    if (props.type === 'population') return appDispatch(getPopulationTAction());
    else return appDispatch(getScenarioGroupTAction());
  }, [props.type]);

  // Update the global population to the popualtion with name as currentPopulationName
  // when currentPopulationName changes.
  useEffect(() => {
    if (relevantList.length > 0) {
      // if (populationState.population.name === thisState.currentName && thisState.currentName !== "" && populationState.population.name !== "") return;
      const globalWithName = (relevantList as (Population | ScenarioGroup)[]).find(
        (el: Population | ScenarioGroup) => el.name === thisState.currentName,
      );
      if (globalWithName === undefined) return;

      // Set currentName to the name of that global
      setRelevantGlobal(globalWithName);
      // Get population elements.
      // If currentName is an empty string, the global state is the null object and there is nothing to get.
      if (thisState.currentName === '') return;
      // TODO: Add if statement if type='successes' as well
      // Make the request to get elements/scenarios and throw a message if it fails.
      relevantGetDataFromAPI().then((res) => {
        if (!res.ok)
          return toast({
            title: 'Unable to retrieve cards or scenarios, try again later',
            description: `Error getting data from the server: ${res.status}.`,
            type: 'alert',
            color: 'error',
          });
      });
    }
  }, [thisState.currentName]);

  // Find user populations on page load
  useEffect(() => {
    // Only fetch data when the popup is closed
    if (thisState.openPopup) return;
    // if (populationState.loading) return;

    relevantGetFromAPI().then((res) => {
      if (!res.ok) {
        return toast({
          title: 'Unable to retrieve data from server.',
          description: `Error getting data from the server: ${res.status}.`,
          type: 'alert',
          color: 'error',
        });
      }
      // Else update the appropriate state and set the correct name.
      if (props.type === 'population') {
        // Set the currentName and populations state at the same time to avoid the
        // Dropdown being confused (as it need both values at the same time).
        thisDispatch(
          setFields(
            ['currentName', 'populations'],
            [
              populationState.population.name,
              (res.data as GetAllPopulationsResponse).allUserPopulations,
            ],
          ),
        );
        return;
      } else {
        // If props.type is 'successes'
        thisDispatch(
          setFields(
            ['currentName', 'scenarioGroups'],
            [
              successesState.scenarioGroup.name,
              (res.data as GetScenarioGroupsResponse).scenarioGroups,
            ],
          ),
        );
        return;
      }
    });
  }, [thisState.openPopup]);

  return (
    <div className={props.className}>
      <Popup
        title={`${thisState.popupState} ${usedLabel}`}
        open={thisState.openPopup}
        onClose={() => thisDispatch(setField('openPopup', false))}
      >
        <FormTemplate
          formState={formState}
          formDispatch={formDispatch}
          onConfirm={async () => {
            const name = formState.findValue('Name');
            if (!name) return {};
            let response;
            if (thisState.popupState === 'Add' && props.type === 'population')
              response = await appDispatch(createPopulationTAction(name));
            else if (thisState.popupState === 'Edit' && props.type === 'population')
              response = await appDispatch(editPopulationTAction({ newName: name }));
            else if (thisState.popupState === 'Add' && props.type === 'successes')
              response = await appDispatch(createScenarioGroupTAction({ name, type: 'SUCCESSES' }));
            // Else thisState.popupState is 'Add' and props.type is 'successes'
            else response = await appDispatch(editScenarioGroupTAction({ newName: name }));
            thisDispatch(setField('openPopup', false));
            return response.data;
          }}
          onSecondButtonClick={
            thisState.popupState !== 'Edit'
              ? undefined
              : async () => {
                  let response;
                  if (props.type === 'population')
                    response = await appDispatch(deletePopulationTAction());
                  // Else props.type is 'successes'
                  else response = await appDispatch(deleteScenarioGroupTAction());
                  thisDispatch(setField('openPopup', false));
                  return response.data;
                }
          }
        />
      </Popup>
      <Dropdown
        itemList={relevantList.map((el) => el.name)}
        value={thisState.currentName}
        setValue={(value) => thisDispatch(setField('currentName', value))}
        inputLabel={usedLabel}
        addButtonOnClick={() => {
          thisDispatch(setField('popupState', 'Add'));
          thisDispatch(setField('openPopup', true));
          formDispatch(formState.setValueAction('Name', ''));
        }}
        editButtonOnClick={() => {
          thisDispatch(setField('popupState', 'Edit'));
          thisDispatch(setField('openPopup', true));
          formDispatch(formState.setValueAction('Name', thisState.currentName));
        }}
      />
    </div>
  );
};

export default GlobalStateDropdown;
