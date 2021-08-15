import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Element } from '@prisma/client';
import React, { useMemo } from 'react';
import { NULL_ELEMENT } from '../../lib/constants-frontend';
import { fixRoles } from '../../lib/core';
import { APIResponse, CUScenarioResponse, RequiredElement, RequiredRole } from '../../lib/types';
import { FormInput, InputArrayItem } from '../../lib/types-frontend';
import { useForm } from '../../lib/utils-frontend';
import {
  createScenarioTAction,
  deleteScenarioTAction,
  editScenarioTAction,
} from '../../store/actions/scenario-group-actions';
import { useAppDispatch, useAppSelector } from '../../store/index';
import FormTemplate from '../FormTemplate/index';

type ScenarioFormCommonProps = {
  defaultScenarioName: string;
  defaultRequiredElements: RequiredElement[];
  defaultRequiredRoles: RequiredRole[];
  afterConfirm?: () => void;
  afterDelete?: () => void;
};

type ScenarioFormTypeProps = { type: 'add' } | { type: 'edit'; scenarioId: string };

type ScenarioFormProps = ScenarioFormCommonProps & ScenarioFormTypeProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    elNameDiv: {
      display: 'inline',
    },
    inputCount: {
      width: '5em',
      alignSelf: 'flex-end',
    },
    elementAutocomplete: {
      width: '12em',
      marginRight: '2em',
    },
    chooseElementDiv: {},
    requiredElementDiv: {},
    requiredElement: {},
  }),
);

type RequiredElementInput = { element: Element | null; minCount: number | null };

// Form label constants
const scenarioNameLabel = 'Scenario name';
const requiredElementsLabel = 'Required Elements';
const requiredElementPlaceholder = 'Required Element';
const minCountPlaceholder = 'Min. Count';
const requiredRolesLabel = 'Required Roles';
const requiredRolePlaceholder = 'Required Role';

/**
 * Component handling the form structure and submit of adding and editing a scenario.
 */
function ScenarioForm(props: ScenarioFormProps) {
  const classes = useStyles();
  const appDispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.population.population.elements);
  const elementOptions = [NULL_ELEMENT, ...elements];
  const roles = useMemo(
    () => fixRoles(elements.reduce((roles: string[], el) => [...roles, ...el.roles], [])),
    [elements],
  );
  const roleOptions = useMemo(() => ['', ...roles], [elements]);

  // The form object
  const initialFormState: FormInput[][] = [
    [
      {
        label: scenarioNameLabel,
        value: '',
        type: 'string',
      },
    ],
    [
      {
        label: requiredElementsLabel,
        value: [],
        type: 'inputarray',
        // className: classes.requiredElement,
        inputRow: [
          { type: 'string', placeholder: requiredElementPlaceholder },
          { type: 'number', placeholder: minCountPlaceholder },
        ],
        inputRender: (inputArray, label, index) => {
          return (
            <>
              <Autocomplete
                options={elementOptions}
                autoSelect
                disableClearable
                getOptionLabel={(option) => option.name}
                defaultValue={NULL_ELEMENT}
                value={elements.find((el) => el.elementId === inputArray[0].value) ?? NULL_ELEMENT}
                className={classes.elementAutocomplete}
                onChange={(_e, newValue) => {
                  const newArray = [
                    ...formState.findValue(requiredElementsLabel),
                  ] as InputArrayItem[][];
                  newArray[index][0].value = newValue?.elementId ?? NULL_ELEMENT;
                  formDispatch(formState.setValueAction(requiredElementsLabel, newArray));
                }}
                renderInput={(params) => (
                  <TextField {...params} label={`Required Element ${index + 1}`} />
                )}
              />
              <TextField
                type="number"
                label={inputArray[1].placeholder}
                value={inputArray[1].value}
                className={classes.inputCount}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newArray = [
                    ...formState.findValue(requiredElementsLabel),
                  ] as InputArrayItem[][];
                  newArray[index][1].value = newValue !== '' ? parseInt(newValue) : '';
                  formDispatch(formState.setValueAction(requiredElementsLabel, newArray));
                }}
              />
            </>
          );
        },
      },
    ],
    [
      {
        label: requiredRolesLabel,
        value: [],
        inputRow: [
          { type: 'string', placeholder: requiredRolePlaceholder },
          { type: 'number', placeholder: minCountPlaceholder },
        ],
        type: 'inputarray',
        inputRender: (inputArray, label, index) => {
          return (
            <>
              <Autocomplete
                options={roleOptions}
                autoSelect
                disableClearable
                getOptionLabel={(option) => option}
                defaultValue={''}
                value={inputArray[0].value as string}
                className={classes.elementAutocomplete}
                onChange={(_e, newValue) => {
                  const newArray = [
                    ...formState.findValue(requiredRolesLabel),
                  ] as InputArrayItem[][];
                  newArray[index][0].value = newValue;
                  formDispatch(formState.setValueAction(requiredRolesLabel, newArray));
                }}
                renderInput={(params) => (
                  <TextField {...params} label={`Required Role ${index + 1}`} />
                )}
              />
              <TextField
                type="number"
                label={inputArray[1].placeholder}
                value={inputArray[1].value}
                className={classes.inputCount}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newArray = [
                    ...formState.findValue(requiredRolesLabel),
                  ] as InputArrayItem[][];
                  newArray[index][1].value = newValue !== '' ? parseInt(newValue) : '';
                  formDispatch(formState.setValueAction(requiredRolesLabel, newArray));
                }}
              />
            </>
          );
        },
      },
    ],
  ];
  const [formState, formDispatch] = useForm(initialFormState);

  // The component render
  return (
    <FormTemplate
      formState={formState}
      formDispatch={formDispatch}
      onConfirm={async () => {
        // Retrieve the form data
        const requiredElementsFromForm = formState.findValue(
          requiredElementsLabel,
        ) as InputArrayItem[][];
        const requiredRolesFromForm = formState.findValue(requiredRolesLabel) as InputArrayItem[][];
        const scenarioName = formState.findValue(scenarioNameLabel) as string;

        // Format the data to be readable
        const requiredElements: RequiredElement[] = requiredElementsFromForm.reduce(
          (reqEls: RequiredElement[], inputArray) => {
            return [
              ...reqEls,
              {
                elementId: inputArray[0].value as string,
                minCount: inputArray[1].value as number,
              },
            ];
          },
          [] as RequiredElement[],
        );
        const requiredRoles: RequiredRole[] = requiredRolesFromForm.reduce(
          (reqRoles, inputArray) => {
            return [
              ...reqRoles,
              {
                requiredRole: inputArray[0].value as string,
                minCount: inputArray[1].value as number,
              },
            ];
          },
          [] as RequiredRole[],
        );

        // Validate data
        if (scenarioName === '') return { errorMsg: 'No name was provided.' };
        console.log('Required stuff', scenarioName, requiredElements, requiredRoles);
        // If any requiredRole or elementId in requiredElement is empty, send error.
        const invalidRequiredElement = requiredElements.find(
          (reqEl) => reqEl.elementId === '' || reqEl.minCount === 0,
        );
        if (invalidRequiredElement) return { errorMsg: 'No name or Min. Count of 0 was provided.' };
        const invalidRequiredRole = requiredRoles.find(
          (reqRole) => reqRole.requiredRole === '' || reqRole.minCount === 0,
        );
        if (invalidRequiredRole)
          return { errorMsg: 'An invalid role or Min. Count of 0 was provided ' };

        // Check if the Min. Count of a requiredElement exceeds the count of the element in the deck.
        const invalidRequiredElementMinCount = requiredElements.find((reqEl) => {
          const element = elements.find((el) => el.elementId === reqEl.elementId);
          // If the element with the given id is not found, something is wrong and return true.
          if (!element) return true;
          return reqEl.minCount > element.count;
        });
        if (invalidRequiredElementMinCount)
          return {
            errorMsg:
              'It is impossible to draw the provided Min. Count of a given card as it is greater than the count of the card in the deck.',
          };

        // The form data is now valid. Submit the form.
        let res: APIResponse<CUScenarioResponse>;
        if (props.type === 'add')
          res = await appDispatch(
            createScenarioTAction({ scenarioName, requiredElements, requiredRoles }),
          );
        else
          res = await appDispatch(
            editScenarioTAction(props.scenarioId, {
              newScenarioName: scenarioName,
              newRequiredElements: requiredElements,
              newRequiredRoles: requiredRoles,
            }),
          );
        // Do something afterwards if appropriate.
        props.afterConfirm?.();

        return res.data;
      }}
      toastOnSecondButtonClick={{
        title: 'Delete scenario?',
        description: 'This action is irreversible.',
        type: 'confirm',
      }}
      onSecondButtonClick={
        props.type !== 'edit'
          ? undefined
          : async () => {
              // Delete the scenario
              const res = await appDispatch(deleteScenarioTAction(props.scenarioId));
              props.afterDelete?.();
              return res.data;
            }
      }
    />
  );
}

export default ScenarioForm;
