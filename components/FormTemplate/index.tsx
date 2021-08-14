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
import { FormActionTypes, FormState, FORM_ACTION, InputArrayItem } from '../../lib/types-frontend';
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
    <div>
      <MuiThemeProvider theme={buttonTheme}>
        {props.formState.form.map((rowInputs, outerIndex) => {
          return (
            <div key={outerIndex} className={classes.rowDiv}>
              {rowInputs.map((input, innerIndex) => {
                const type = input.type;
                if (type === 'string' || type === 'number') {
                  // If an inputRender is provided, use that, otherwise use standard TextField
                  return !input.inputRender ? (
                    <TextField
                      key={`TextField${outerIndex},${innerIndex}`}
                      label={input.label}
                      value={input.value}
                      type={type}
                      className={`${input.className}`}
                      onChange={(e) => {
                        const value = e.target.value.toString();
                        if (input.type === 'string')
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
                    input.inputRender(input.value, input.label)
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
                      {input.value.map((item, itemIndex) => {
                        const itemPlaceholder = `${input.label
                          .toLowerCase()
                          .slice(0, -1)} ${itemIndex}`;
                        return (
                          <div
                            key={itemIndex}
                            className={`${classes.arrayElementDiv} ${input.className ?? ''}`}
                          >
                            {input.inputRender ? (
                              input.type === 'array' ? (
                                input.inputRender(item as string, input.label, itemIndex)
                              ) : (
                                input.inputRender(item as InputArrayItem[], input.label, itemIndex)
                              )
                            ) : input.type === 'array' ? (
                              <TextField
                                key={`TextField${outerIndex},${innerIndex},${itemIndex}`}
                                value={item}
                                className={`${classes.arrayFields}`}
                                // The placeholder is the item text minus the last letter ("roles" become "role")
                                placeholder={itemPlaceholder}
                                onChange={(e) => {
                                  const newItems = [...input.value];
                                  newItems[itemIndex] = e.target.value;
                                  return setField([outerIndex, innerIndex], newItems);
                                }}
                              />
                            ) : (
                              // The item is an array of objects with value, label and type (inputarray)
                              //
                              input.value.map((arrayInputs, arrayIndex) => {
                                return arrayInputs.map((arrayInput, arrayInputIndex) => {
                                  return (
                                    <TextField
                                      key={`ArrayRowTextField${outerIndex},${innerIndex},${itemIndex},${arrayIndex},${arrayInputIndex}`}
                                      value={arrayInput.value}
                                      className={`${classes.arrayFields} ${
                                        arrayInput.className ?? ''
                                      }`}
                                      type={arrayInput.type}
                                      // The placeholder is the item text minus the last letter ("roles" become "role")
                                      placeholder={arrayInput.placeholder}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        const newItems = [...arrayInputs];
                                        newItems[arrayInputIndex].value =
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
                                const newItems = [...input.value];
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
                        const newItems = [...input.value];
                        const pushItem =
                          input.type === 'array'
                            ? ''
                            : ([
                                ...input.inputRow.map((arrayInput) => ({
                                  ...arrayInput,
                                  value: arrayInput.type === 'number' ? 1 : '',
                                })),
                              ] as InputArrayItem[]);
                        newItems.push(pushItem);
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
                    props.onSecondButtonClick ?? (() => new Promise((res, _rej) => res({})));
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
/**
 *  const renderForm = (form: InputForm[][]) => {
    return form.map((rowInputs, outerIndex) => {
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
                <div className={`${classes.inputFields} ${input.className}`}>
                  {input.inputRender(input.value, input.label, -1)}
                </div>
              );
            }
            // Else, make one input field for each value in the list of InputForms
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
                    const placeholder = `${input.label.toLowerCase().slice(0, -1)} ${itemIndex}`;
                    return (
                      <div
                        key={itemIndex}
                        className={`${classes.arrayElementDiv} ${input.className}`}
                      >
                        {!input.inputRender ? (
                          <TextField
                            key={`TextField${outerIndex},${innerIndex},${itemIndex}`}
                            value={item}
                            className={`${classes.arrayFields}`}
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
                          />
                        ) : (
                          <div className={''}>
                            {input.inputRender(item, input.label, itemIndex)}
                          </div>
                        )}
                        <IconButton
                          key={`IconButton${outerIndex},${innerIndex},${itemIndex} `}
                          className={classes.deleteElementButton}
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
                  {renderForm(input.value)}
                </div>
                <Button
                  key={`Button${outerIndex}, ${innerIndex}`}
                  startIcon={<AddIcon />}
                  className={classes.addButton}
                  onClick={() => {
                    const inputValue = input.value as InputForm[][];
                    const newItems = [...inputValue];
                    console.log(inputValue);

                    const newItem = [
                      ...inputValue[0].map((input) => ({
                        ...input,
                        value: input.type === 'number' ? 0 : '',
                      })),
                    ];
                    newItems.push(newItem);
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
    });
  };
 */
