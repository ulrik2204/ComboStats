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
import { ToastOptions, useToast } from '../../lib/utils-frontend';

type FormTemplateProps = {
  formState: FormState;
  formDispatch: Dispatch<FormActionTypes>;
  onConfirm: () => Promise<ErrorResponse>; // An error response with an error message if there was an error and errorMsg being undefined otherwise.
  onSecondButtonClick?: () => Promise<ErrorResponse>;
  toastOnSecondButtonClick?: Omit<ToastOptions, 'onConfirm'>;
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
      marginLeft: theme.spacing(2),
    },
  }),
);

const FormTemplate: FC<FormTemplateProps> = (props) => {
  const classes = useStyles();
  const toast = useToast();
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
                  const type = input.type ?? typeof input.value;
                  // If an inputRender is provided, use that, otherwise use standard TextField
                  return !input.inputRender ? (
                    <TextField
                      key={`TextField${outerIndex},${innerIndex}`}
                      label={input.label}
                      value={input.value}
                      type={type}
                      className={`${classes.inputFields} ${input.className}`}
                      onChange={(e) => {
                        const value = e.target.value.toString();
                        if (type === 'string') return setField([outerIndex, innerIndex], value);
                        else if (type === 'number') {
                          return setField(
                            [outerIndex, innerIndex],
                            value === '' ? '' : parseInt(value),
                          );
                        }
                      }}
                    />
                  ) : (
                    input.inputRender(input.value, input.label, -1)
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
                        const placeholder = `${input.label
                          .toLowerCase()
                          .slice(0, -1)} ${itemIndex}`;
                        return (
                          <div key={itemIndex} className={classes.arrayElementDiv}>
                            {!input.inputRender ? (
                              <TextField
                                key={`TextField${outerIndex},${innerIndex},${itemIndex} `}
                                value={item}
                                className={`${classes.arrayFields} ${input.className}`}
                                // The placeholder is the item text minus the last letter ("roles" become "role")
                                placeholder={placeholder}
                                onChange={(e) => {
                                  const newItems = [...input.value];
                                  newItems[itemIndex] =
                                    typeof item === 'number'
                                      ? parseInt(e.target.value)
                                      : e.target.value;
                                  return setField([outerIndex, innerIndex], newItems);
                                }}
                              ></TextField>
                            ) : (
                              input.inputRender(item, input.label, itemIndex)
                            )}
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
              if (!errorResponse.errorMsg) {
                return props.formDispatch({ type: FORM_ACTION.SUBMIT_SUCCESS });
              }
              return props.formDispatch({
                type: FORM_ACTION.SUBMIT_FAILURE,
                payload: errorResponse,
              });
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
                // Wrap the funtionality in a function so that it can be confirmed
                const secondButtonFunc = async () => {
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
                };
                // Throw toast if props allow it.
                if (!props.toastOnSecondButtonClick) return await secondButtonFunc();
                toast({
                  ...props.toastOnSecondButtonClick,
                  onConfirm: async () => await secondButtonFunc(),
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
