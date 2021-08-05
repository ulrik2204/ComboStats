import { Population, ScenarioGroup } from '@prisma/client';
import { FC, useCallback, useEffect, useReducer } from 'react';
import { getPopulationsOnUserFromAPI, getScenarioGroupsFromAPI } from '../../lib/api-calls';
import { GetAllPopulationsResponse } from '../../lib/types';
import { InputForm } from '../../lib/types-frontend';
import { useForm, useToast } from '../../lib/utils-frontend';
import {
  createPopulationTAction,
  deletePopulationTAction,
  editPopulationTAction,
  getPopulationTAction,
} from '../../store/actions/population-actions';
import { useAppDispatch, useAppSelector } from '../../store/index';
import { setPopulationAction } from '../../store/reducers/population';
import Dropdown from '../Dropdown/index';
import FormTemplate from '../FormTemplate/index';
import Popup from '../Popup/index';

type GlobalStateDropdownProps = {
  type: 'Population' | 'Successes';
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

const initialNameForm: InputForm[][] = [[{ value: '', label: 'Name' }]];

/**
 * Conponent that handles setting of and creating populations and scenario groups as the global state.
 * @param props
 */
const GlobalStateDropdown: FC<GlobalStateDropdownProps> = (props) => {
  const toast = useToast();
  const [nameFormState, formDispatch] = useForm(initialNameForm);
  const populationState = useAppSelector((state) => state.population);
  const appDispatch = useAppDispatch();
  const [thisState, thisDispatch] = useReducer(thisStateReducer, initialState);
  const usedLabel = props.type === 'Population' ? 'Deck' : 'Combos';
  const relevantList =
    props.type === 'Population' ? thisState.populations : thisState.scenarioGroups;
  // TODO: Add if statement os relevant global also can be successes
  const relevantGlobal = populationState.population;
  const setRelevantGlobal = (newValue: any) => {
    if (props.type === 'Population') return appDispatch(setPopulationAction(newValue));
    // TODO: CHANGE WHEN SCENARIO GROUP REDUCER IS CREATED
    else return appDispatch(setPopulationAction(newValue));
  };

  // Find the correct get api call depending on type
  const chooseGet = useCallback(() => {
    if (props.type === 'Population') return getPopulationsOnUserFromAPI();
    else
      return getScenarioGroupsFromAPI({
        populationId: populationState.population.populationId,
        type: 'SUCCESSES',
      });
  }, [props.type]);

  // Update the global population to the popualtion with name as currentPopulationName
  // when currentPopulationName changes.
  useEffect(() => {
    if (relevantList.length > 0) {
      console.log('thisState currentName change', thisState.currentName);

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
      appDispatch(getPopulationTAction()).then((res) => {
        if (!res.ok)
          return toast({
            title: 'Unable to retrieve cards, try again later',
            description: `Error getting data from the server: ${res.status}.`,
            type: 'alert',
            color: 'error',
          });
        console.log(res);
      });
    }
  }, [thisState.currentName]);

  // Find user populations on page load
  useEffect(() => {
    // Only fetch data when the popup is closed
    if (thisState.openPopup) return;
    // if (populationState.loading) return;

    chooseGet().then((res) => {
      if (!res.ok) {
        return toast({
          title: 'Unable to retrieve data from server.',
          description: `Error getting data from the server: ${res.status}.`,
          type: 'alert',
          color: 'error',
        });
      }
      // Else update the appropriate state and set the correct name.
      if (props.type === 'Population') {
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
      } else if (props.type === 'Successes') {
        // TODO: Set currentName and scenarioGroups to the name of the successesState
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
          formState={nameFormState}
          formDispatch={formDispatch}
          onConfirm={async () => {
            const name = nameFormState.findValue('Name');
            if (!name) return {};
            let response;
            if (thisState.popupState === 'Add')
              response = await appDispatch(createPopulationTAction(name));
            else response = await appDispatch(editPopulationTAction({ newName: name }));
            thisDispatch(setField('openPopup', false));
            return response.data;
          }}
          onSecondButtonClick={
            thisState.popupState !== 'Edit'
              ? undefined
              : async () => {
                  const response = await appDispatch(deletePopulationTAction());
                  thisDispatch(setField('openPopup', false));
                  return response.data;
                }
          }
        />
      </Popup>
      <Dropdown
        itemList={relevantList.map((el) => el.name)}
        value={thisState.currentName}
        setValue={(s) => thisDispatch(setField('currentName', s))}
        inputLabel={usedLabel}
        addButtonOnClick={() => {
          thisDispatch(setField('popupState', 'Add'));
          thisDispatch(setField('openPopup', true));
          formDispatch(nameFormState.setValueAction('Name', ''));
        }}
        editButtonOnClick={() => {
          thisDispatch(setField('popupState', 'Edit'));
          thisDispatch(setField('openPopup', true));
          formDispatch(nameFormState.setValueAction('Name', thisState.currentName));
        }}
      />
    </div>
  );
};

export default GlobalStateDropdown;
