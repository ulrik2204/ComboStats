import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Element } from '@prisma/client';
import React, { useMemo } from 'react';
import { fixRoles } from '../../lib/core';
import { RequiredElement, RequiredRole } from '../../lib/types';
import { InputArrayItem, FormInput } from '../../lib/types-frontend';
import { useForm } from '../../lib/utils-frontend';
import { useAppSelector } from '../../store/index';
import FormTemplate from '../FormTemplate/index';

type ScenarioFormCommonProps = {
  defaultScenarioName: string;
  defaultRequiredElements: RequiredElement[];
  defaultRequiredRoles: RequiredRole[];
  afterConfirm?: () => void;
  afterDeleteAll?: () => void;
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

function ScenarioForm(props: ScenarioFormProps) {
  const classes = useStyles();
  const elements = useAppSelector((state) => state.population.population.elements);
  const roles = useMemo(
    () => fixRoles(elements.reduce((roles: string[], el) => [...roles, ...el.roles], [])),
    [elements],
  );

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
                options={elements}
                autoSelect
                disableClearable
                getOptionLabel={(option) => option.name}
                defaultValue={elements[0]}
                value={elements.find((el) => el.elementId === inputArray[0].value) ?? elements[0]}
                className={classes.elementAutocomplete}
                onChange={(_e, newValue) => {
                  const newArray = [
                    ...formState.findValue(requiredElementsLabel),
                  ] as InputArrayItem[][];
                  newArray[index][0].value = newValue?.elementId ?? '';
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
                options={roles}
                autoSelect
                disableClearable
                getOptionLabel={(option) => option}
                defaultValue={roles[0]}
                value={(inputArray[0].value as string) || roles[0]}
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
  ];
  const [formState, formDispatch] = useForm(initialFormState);
  return (
    <div>
      <FormTemplate
        formState={formState}
        formDispatch={formDispatch}
        onConfirm={async () => ({})}
      />
    </div>
  );
}

export default ScenarioForm;

/**
 *     <MuiThemeProvider theme={buttonTheme}>
    <div>
      <div>
        {(() => {
          const elNameFields: JSX.Element[] = [];
          for (let i = 0; i < successes.length; i++) {
            elNameFields.push(
              <div className={classes.elNameDiv} key={i}>
                <TextField
                  value={successes[i]}
                  placeholder={`name${i}`}
                  onChange={(e) => {
                    const newSucc = [...successes];
                    newSucc[i] = e.target.value;
                    setSuccesses(newSucc);
                  }}
                />
                <IconButton
                  onClick={() => {
                    const newSucc = [...successes];
                    newSucc.splice(i, 1);
                    setSuccesses(newSucc);
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </div>,
            );
          }
          return elNameFields;
        })()}
      </div>
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          const newSucc = [...successes];
          newSucc.push('');
          setSuccesses(newSucc);
        }}
      >
        Add card name
      </Button>
      <div>End</div>
    </div>
    </MuiThemeProvider>
 */
