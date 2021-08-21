import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';
import { APIResponse, CUDElementResponse } from '../../lib/types';
import { FormInput } from '../../lib/types-frontend';
import { useForm, useToast } from '../../lib/utils-frontend';
import {
  addElementTAction,
  deleteElementTAction,
  editElementTAction,
} from '../../store/actions/population-actions';
import { useAppDispatch } from '../../store/index';
import FormTemplate from '../FormTemplate/index';

type ElementFormCommonProps = {
  defaultName: string;
  defaultRoles: string[];
  defaultCount: number;
  afterConfirm?: () => void;
  afterDelete?: () => void;
};

type ElementFormTypeProps = { type: 'add' } | { type: 'edit'; elementId: string };

type ElementFormProps = ElementFormCommonProps & ElementFormTypeProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    roleDiv: {
      display: 'inline',
    },
    rolesOverDiv: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 30,
    },
    nameBox: {
      width: '50%',
    },
    countBox: {
      width: theme.spacing(8),
    },
    finishingButtonsDiv: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
    },
    deleteButton: {
      marginLeft: theme.spacing(1),
    },
  }),
);

// Form label constants
const nameLabel = 'Name';
const countLabel = 'Count';
const rolesLabel = 'Roles';

/**
 * For to add or edit an element.
 */
const ElementForm: FC<ElementFormProps> = (props) => {
  const classes = useStyles();
  const toast = useToast();
  const appDispatch = useAppDispatch();
  const initialForm: FormInput[][] = [
    [
      { label: nameLabel, value: props.defaultName, type: 'string' },
      { label: countLabel, value: props.defaultCount, className: classes.countBox, type: 'number' },
    ],
    [{ label: rolesLabel, value: props.defaultRoles, type: 'array' }],
  ];
  const [formState, formDispatch] = useForm(initialForm);

  return (
    <div>
      <FormTemplate
        formState={formState}
        formDispatch={formDispatch}
        onConfirm={async () => {
          const name = formState.findValue(nameLabel);
          const count = parseInt(formState.findValue(countLabel));
          const roles = formState.findValue(rolesLabel);
          toast({
            title: 'Hei',
            type: 'alert',
          });
          // const a = new Promise<ErrorResponse>((res, rej) => res({}));
          // return a;
          if ([name, roles, count].indexOf(undefined) > -1) {
            return { errorMsg: 'Not able to retrieve input values' }; // Return an empty object as the error is already handled.
          }
          if (name === '' || count <= 0) {
            return { errorMsg: 'No name or a count of 0 or less was provided.' }; // Same reason as above.
          }

          // We now know that the input is legal, perform dispatch.
          let res: APIResponse<CUDElementResponse>;
          if (props.type === 'add')
            res = await appDispatch(addElementTAction({ name, roles, count }));
          else
            res = await appDispatch(
              editElementTAction(props.elementId, {
                newName: name,
                newRoles: roles,
                newCount: count,
              }),
            );

          props.afterConfirm?.();

          return res.data;
        }}
        toastOnSecondButtonClick={{
          title: 'Delete all copies?',
          description: 'This action is irreversible.',
          type: 'confirm',
        }}
        onSecondButtonClick={
          props.type !== 'edit'
            ? undefined
            : async () => {
                // Just perform the delete action
                const res = await appDispatch(deleteElementTAction(props.elementId));
                props.afterDelete?.();
                return res.data;
              }
        }
      />
    </div>
  );
};

export default ElementForm;
