import {
  Button,
  createStyles,
  FormLabel,
  makeStyles,
  MuiThemeProvider,
  TextField,
  Theme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Dispatch, FC } from 'react';
import { buttonTheme } from '../../lib/themes';
import { ErrorResponse } from '../../lib/types';
import { FormActionTypes, FormState, FORM_ACTION } from '../../lib/types-frontend';

type FormTemplateProps = {
  formState: FormState;
  formDispatch: Dispatch<FormActionTypes>;
  onConfirm: () => Promise<ErrorResponse>; // An error response with an error message if there was an error and errorMsg being undefined otherwise.
  onSecondButtonClick?: () => Promise<ErrorResponse>;
  secondButtonText?: string;
  children?: JSX.Element;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrayElementDiv: {
      display: 'inline',
    },
    arrayFields: {
      marginBottom: '0.3em',
      marginRight: '1em',
    },
    inputFields: {
      marginRight: '2em',
      marginBottom: '1em',
    },
    arrayInnerDiv: {
      marginTop: '0.5em',
    },
    arrayOverDiv: {
      marginTop: '0.8em',
    },
    buttonsDiv: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
    },
    secondButton: {
      marginLeft: theme.spacing(3),
    },
  }),
);

const FormTemplate: FC<FormTemplateProps> = (props) => {
  const classes = useStyles();
  // const [formState, formDispatch] = useReducer(props.setForm, props.form);
  const setField = (position: [number, number], value: any) =>
    props.formDispatch({ type: FORM_ACTION.FIELD, payload: { position, value } });
  return (
    <div>
      <MuiThemeProvider theme={buttonTheme}>
        {props.formState.form.map((rowInputs, outerIndex) => {
          return (
            <div key={outerIndex}>
              {rowInputs.map((input, innerIndex) => {
                if (!Array.isArray(input.value)) {
                  return (
                    <TextField
                      key={`TextField${outerIndex},${innerIndex}`}
                      label={input.label}
                      value={input.value}
                      type={typeof input.value}
                      className={`${classes.inputFields} ${input.className}`}
                      onChange={(e) => {
                        if (typeof input.value === 'string')
                          return setField([outerIndex, innerIndex], e.target.value);
                        else if (typeof input.value === 'number')
                          return setField([outerIndex, innerIndex], parseInt(e.target.value));
                      }}
                    />
                  );
                }
                // Else, make one input field for each value in the list
                return (
                  <div
                    key={`ArrayOuterDiv${outerIndex}, ${innerIndex}`}
                    className={classes.arrayOverDiv}
                  >
                    <FormLabel key={input.label}>{input.label}</FormLabel>
                    <div
                      key={`ArrayInnerDiv${outerIndex}, ${innerIndex}`}
                      className={classes.arrayInnerDiv}
                    >
                      {input.value.map((item: string, itemIndex) => {
                        return (
                          <div key={itemIndex} className={classes.arrayElementDiv}>
                            <TextField
                              key={`TextField${outerIndex},${innerIndex},${itemIndex} `}
                              value={item}
                              className={`${classes.arrayFields} ${input.className}`}
                              // The placeholder is the item text minus the last letter ("roles" become "role")
                              placeholder={`${input.label.toLowerCase().slice(0, -1)} ${itemIndex}`}
                              onChange={(e) => {
                                const newItems = [...input.value];
                                newItems[itemIndex] =
                                  typeof item === 'number'
                                    ? parseInt(e.target.value)
                                    : e.target.value;
                                return setField([outerIndex, innerIndex], newItems);
                              }}
                            ></TextField>
                            <IconButton
                              key={`IconButton${outerIndex},${innerIndex},${itemIndex} `}
                              onClick={() => {
                                const newItems = [...input.value];
                                newItems.splice(itemIndex, 1);
                                return setField([outerIndex, innerIndex], newItems);
                              }}
                            >
                              <CloseIcon
                                color="secondary"
                                key={`CloseIcon${outerIndex},${innerIndex},${itemIndex} `}
                              />
                            </IconButton>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      key={`Button${outerIndex}, ${innerIndex}`}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newItems = [...input.value];
                        console.log(newItems);
                        newItems.push('');
                        return setField([outerIndex, innerIndex], newItems);
                      }}
                    >
                      Add {`${input.label.toLowerCase().slice(0, -1)}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className={classes.buttonsDiv}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              props.formDispatch({ type: FORM_ACTION.SUBMIT_LOADING });
              const errorResponse = await props.onConfirm();
              console.log('Onclick from FormTemplate');
              setTimeout(() => {
                console.log(errorResponse);
                if (!errorResponse.errorMsg) {
                  console.log('success from FormTemplate');

                  return props.formDispatch({ type: FORM_ACTION.SUBMIT_SUCCESS });
                }
                return props.formDispatch({
                  type: FORM_ACTION.SUBMIT_FAILURE,
                  payload: errorResponse,
                });
              }, 2000);
            }}
          >
            Confirm
          </Button>
          {props.onSecondButtonClick && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.secondButton}
              onClick={async () => {
                props.formDispatch({ type: FORM_ACTION.SUBMIT_LOADING });
                // Check that onSecondButtonClick is not undefined (which it is not at this point)
                const onClick =
                  props.onSecondButtonClick ?? (() => new Promise((res, rej) => res({})));
                const errorResponse = await onClick();
                if (!errorResponse.errorMsg)
                  return props.formDispatch({ type: FORM_ACTION.SUBMIT_SUCCESS });
                return props.formDispatch({
                  type: FORM_ACTION.SUBMIT_FAILURE,
                  payload: errorResponse,
                });
              }}
            >
              {props.secondButtonText ?? 'Delete'}
            </Button>
          )}
        </div>
        {props.children}
      </MuiThemeProvider>
    </div>
  );
};

export default FormTemplate;
