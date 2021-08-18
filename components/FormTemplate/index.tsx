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
import {
  ArrayInputItem,
  FormActionTypes,
  FormInputArray,
  FormInputArrayInput,
  FormInputCommon,
  FormInputSingle,
  FormState,
  FORM_ACTION,
} from '../../lib/types-frontend';
import { ToastOptions, useToast } from '../../lib/utils-frontend';

type FormTemplateProps = {
  formState: FormState;
  formDispatch: Dispatch<FormActionTypes>;
  onConfirm: () => Promise<ErrorResponse>; // An error response with an error message if there was an error and errorMsg being undefined otherwise.
  confirmButtonText?: string;
  onSecondButtonClick?: () => Promise<ErrorResponse>;
  toastOnSecondButtonClick?: Omit<ToastOptions, 'onConfirm'>;
  secondButtonText?: string;
  children?: JSX.Element;
  className?: string;
  disableClearOnConfirm?: boolean;
  disableClearOnSecondButtonClick?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    simpleTextField: {
      marginRight: '2em',
    },
    rowDiv: {
      marginRight: '2em',
      marginBottom: '1em',
    },
    buttonsDiv: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
    },
    addButton: {
      marginTop: '0.5em',
    },
    deleteElementButton: {
      alignSelf: 'flex-end',
      marginBottom: '-8px',
      padding: '4px',
      marginLeft: '0.7em',
    },
    secondButton: {
      marginLeft: theme.spacing(2),
    },
    arrayInnerDiv: {
      marginTop: '0.5em',
    },
    arrayOverDiv: {
      marginTop: '1.5em',
    },
    arrayElementDiv: {
      display: 'flex',
      flexFlow: 'row',
      marginBottom: '1em',
    },
    arrayFields: {
      width: '12em',
      alignSelf: 'flex-end',
    },
  }),
);

const FormTemplate: FC<FormTemplateProps> = (props) => {
  const classes = useStyles();
  const toast = useToast();
  // const [formState, formDispatch] = useReducer(props.setForm, props.form);
  const setField = (position: [number, number], value: any) =>
    props.formDispatch({ type: FORM_ACTION.FIELD, payload: { position, value } });

  // Render
  return (
    <div className={props.className}>
      <MuiThemeProvider theme={buttonTheme}>
        {props.formState.form.map((rowInputs, outerIndex) => {
          return (
            <div key={outerIndex} className={classes.rowDiv}>
              {rowInputs.map((input, innerIndex) => {
                const type = input.type;
                if (type === 'string' || type === 'number') {
                  const thisInput = input as FormInputSingle & FormInputCommon;
                  // If an inputRender is provided, use that, otherwise use standard TextField
                  return !thisInput.inputRenderSingle ? (
                    <TextField
                      key={`TextField${outerIndex},${innerIndex}`}
                      label={thisInput.label}
                      value={thisInput.value}
                      type={type}
                      className={`${classes.simpleTextField} ${thisInput.className}`}
                      onChange={(e) => {
                        const value = e.target.value.toString();
                        if (thisInput.type === 'string')
                          return setField([outerIndex, innerIndex], value);
                        else if (type === 'number') {
                          return setField(
                            [outerIndex, innerIndex],
                            value === '' ? '' : parseInt(value),
                          );
                        }
                      }}
                    />
                  ) : (
                    thisInput.inputRenderSingle(thisInput.value, thisInput.label)
                  );
                }
                let thisInput = input as (FormInputArray | FormInputArrayInput) & FormInputCommon;
                // Else, make one input field for each value in the list
                return (
                  <div
                    key={`ArrayOuterDiv${outerIndex}, ${innerIndex}`}
                    className={classes.arrayOverDiv}
                  >
                    <FormLabel key={thisInput.label}>{thisInput.label}</FormLabel>
                    <div
                      key={`ArrayInnerDiv${outerIndex}, ${innerIndex}`}
                      className={classes.arrayInnerDiv}
                    >
                      {thisInput.value.map((item, itemIndex) => {
                        const itemPlaceholder = `${thisInput.label
                          .toLowerCase()
                          .slice(0, -1)} ${itemIndex}`;
                        return (
                          <div
                            key={itemIndex}
                            className={`${classes.arrayElementDiv} ${thisInput.className ?? ''}`}
                          >
                            {thisInput.inputRender ? (
                              thisInput.type === 'array' ? (
                                thisInput.inputRender(item as string, thisInput.label, itemIndex)
                              ) : (
                                thisInput.inputRender(
                                  item as ArrayInputItem[],
                                  thisInput.rowInputsInfo,
                                  itemIndex,
                                )
                              )
                            ) : thisInput.type === 'array' ? (
                              <TextField
                                key={`TextField${outerIndex},${innerIndex},${itemIndex}`}
                                value={item}
                                className={`${classes.arrayFields}`}
                                // The placeholder is the item text minus the last letter ("roles" become "role")
                                placeholder={itemPlaceholder}
                                onChange={(e) => {
                                  const newItems = [...thisInput.value];
                                  newItems[itemIndex] = e.target.value;
                                  return setField([outerIndex, innerIndex], newItems);
                                }}
                              />
                            ) : (
                              // The item is an array of objects with value, label and type (inputarray)
                              thisInput.value.map((arrayInputs, arrayIndex) => {
                                return arrayInputs.map((inputArrayItem, arrayInputIndex) => {
                                  thisInput = input as FormInputArrayInput & FormInputCommon;
                                  const inputRowType = thisInput.rowInputsInfo[arrayInputIndex];
                                  return (
                                    <TextField
                                      key={`ArrayRowTextField${outerIndex},${innerIndex},${itemIndex},${arrayIndex},${arrayInputIndex}`}
                                      value={inputArrayItem}
                                      className={`${classes.arrayFields} ${
                                        inputRowType.className ?? ''
                                      }`}
                                      type={inputRowType.type}
                                      // The placeholder is the item text minus the last letter ("roles" become "role")
                                      placeholder={thisInput.rowInputsInfo[arrayIndex].placeholder}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const newItems = [...arrayInputs];
                                        newItems[arrayInputIndex] =
                                          newValue === '' ? '' : parseInt(newValue);
                                        return setField([outerIndex, innerIndex], newItems);
                                      }}
                                    />
                                  );
                                });
                              })
                            )}
                            <IconButton
                              key={`IconButton${outerIndex},${innerIndex},${itemIndex} `}
                              className={classes.deleteElementButton}
                              onClick={() => {
                                const newItems = [...thisInput.value];
                                newItems.splice(itemIndex, 1);
                                return setField([outerIndex, innerIndex], newItems);
                              }}
                            >
                              <CloseIcon
                                color="secondary"
                                key={`CloseIcon${outerIndex},${innerIndex},${itemIndex}`}
                              />
                            </IconButton>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      key={`Button${outerIndex}, ${innerIndex}`}
                      startIcon={<AddIcon />}
                      className={classes.addButton}
                      onClick={() => {
                        const newItems = [...thisInput.value];
                        const pushItem =
                          thisInput.type === 'array'
                            ? ''
                            : ([
                                ...thisInput.rowInputsInfo.map((inputType) =>
                                  inputType.type === 'number' ? 1 : '',
                                ),
                              ] as ArrayInputItem[]);
                        newItems.push(pushItem);
                        return setField([outerIndex, innerIndex], newItems);
                      }}
                    >
                      Add {`${thisInput.label.toLowerCase().slice(0, -1)}`}
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
                return props.formDispatch({
                  type: FORM_ACTION.SUBMIT_SUCCESS,
                  payload: { clearForm: !props.disableClearOnConfirm },
                });
              }
              return props.formDispatch({
                type: FORM_ACTION.SUBMIT_FAILURE,
                payload: errorResponse,
              });
            }}
          >
            {props.confirmButtonText ?? 'Confirm'}
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
                    props.onSecondButtonClick ?? (() => new Promise((res, _rej) => res({})));
                  const errorResponse = await onClick();
                  if (!errorResponse.errorMsg)
                    return props.formDispatch({
                      type: FORM_ACTION.SUBMIT_SUCCESS,
                      payload: { clearForm: !props.disableClearOnSecondButtonClick },
                    });
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

