import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';
import { APIResponse, CUDElementResponse } from '../../lib/types';
import { InputForm } from '../../lib/types-frontend';
import { useForm, useToast } from '../../lib/utils-frontend';
import { addElement, deleteElement, editElement } from '../../store/actions/population-actions';
import { useAppDispatch } from '../../store/index';
import FormTemplate from '../FormTemplate/index';

type PopualtionFormCommonProps = {
  defaultName: string;
  defaultRoles: string[];
  defaultCount: number;
  afterConfirm?: () => void;
  afterDeleteAll?: () => void;
};

type PopulationFormTypeProps = { type: 'add' } | { type: 'edit'; elementId: string };

type PopulationFormProps = PopualtionFormCommonProps & PopulationFormTypeProps;

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

const PopulationForm: FC<PopulationFormProps> = (props) => {
  const classes = useStyles();
  const toast = useToast();
  const appDispatch = useAppDispatch();
  const initialForm: InputForm[][] = [
    [
      { label: nameLabel, value: props.defaultName },
      { label: countLabel, value: props.defaultCount, className: classes.countBox, type: 'number' },
    ],
    [{ label: rolesLabel, value: props.defaultRoles }],
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
          console.log('count from PopForm', count);
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
          if (props.type === 'add') res = await appDispatch(addElement({ name, roles, count }));
          else
            res = await appDispatch(
              editElement(props.elementId, { newName: name, newRoles: roles, newCount: count }),
            );

          // Clear all input data if appropriate.
          props.afterConfirm?.();

          return res.data;
        }}
        toastOnSecondButtonClick={{
          title: 'Delete all copies?',
          description: 'This action is irreversible',
          type: 'confirm',
        }}
        onSecondButtonClick={
          props.type !== 'edit'
            ? undefined
            : async () => {
                // Just perform the delete action
                const res = await appDispatch(deleteElement(props.elementId));
                props.afterDeleteAll?.();
                return res.data;
              }
        }
      />
    </div>
  );
};

export default PopulationForm;

// const [name, setName] = useState(props.defaultName);
// const [elementCount, setElementCount] = useState(props.defaultCount);
// const [roles, setRoles] = useState(props.defaultRoles);
// const { population, setPopulation } = useContext(PopulationContext);
// const toast = useToast();
// const classes = useStyles();

// /**
//  * Function to handle the press of the confirm button
//  */
// const handleConfirm = useCallback(() => {
//   // If the name value is empty, alert the user
//   if (name === '') {
//     toast({ title: 'No name was entered.', type: 'alert', description: 'Please enter a name.' });
//     return;
//   }
//   let newPop = population;
//   if (props.type === 'edit') {
//     newPop = removeAllByName(newPop, props.defaultName);
//   }
//   // Filter out roles that are the emtpy string
//   // The Element class will filter out duplicates of equal roles
//   // Also convert all roles to all lower case
//   const el = identifyEl({ name, roles, count: 1, elementId: '', populationId: '' });
//   // Add elementCount of elements
//   for (let i = 0; i < elementCount; i++) {
//     newPop.push(el);
//   }
//   setPopulation([...newPop]);
//   if (props.clearAllOnConfirm) {
//     setName('');
//     setElementCount(1);
//     setRoles([]);
//   }
//   props.afterConfirm?.();
// }, [population, setPopulation, props.afterConfirm, name, elementCount, roles, setRoles]);

// /**
//  * Function to handle the press of the delete button
//  */
// const handleDeleteAll = useCallback(() => {
//   setPopulation(removeAllByName(population, props.defaultName));
//   props.afterDeleteAll?.();
// }, [population, setPopulation, props.defaultName, props.afterDeleteAll]);

// return (
//   <MuiThemeProvider theme={buttonTheme}>
//     <div>
//       <div>
//         <TextField
//           label="Name of card"
//           className={classes.nameBox}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <TextField
//           label="Count"
//           value={elementCount}
//           type="number"
//           className={classes.countBox}
//           onChange={(e) => setElementCount(parseInt(e.target.value))}
//         />
//       </div>
//       <div className={classes.rolesOverDiv}>
//         <FormLabel>Roles</FormLabel>
//         {(() => {
//           const roleFields: JSX.Element[] = [];
//           for (let i = 0; i < roles.length; i++) {
//             roleFields.push(
//               <div className={classes.roleDiv} key={i}>
//                 <TextField
//                   value={roles[i]}
//                   placeholder={`role${i + 1}`}
//                   onChange={(e) => {
//                     const newRoles = [...roles];
//                     newRoles[i] = e.target.value;
//                     setRoles(newRoles);
//                   }}
//                 />
//                 <IconButton
//                   onClick={() => {
//                     const newRoles = [...roles];
//                     newRoles.splice(i, 1);
//                     setRoles(newRoles);
//                   }}
//                 >
//                   <CloseIcon color="secondary" />
//                 </IconButton>
//               </div>,
//             );
//           }
//           return roleFields;
//         })()}
//       </div>
//       <Button
//         startIcon={<AddIcon />}
//         onClick={() => {
//           const newRoles = [...roles];
//           newRoles.push('');
//           setRoles(newRoles);
//         }}
//       >
//         Add role
//       </Button>
//       <div className={classes.finishingButtonsDiv}>
//         <Button variant="contained" color="primary" onClick={handleConfirm}>
//           Confirm
//         </Button>
//         {props.type === 'edit' && (
//           <Button
//             className={classes.deleteButton}
//             variant="contained"
//             color="secondary"
//             onClick={() =>
//               toast({
//                 title: 'Delete all copies of the card?',
//                 type: 'confirm',
//                 onConfirm: handleDeleteAll,
//                 description: 'This action is irreversible.',
//               })
//             }
//           >
//             Delete all copies
//           </Button>
//         )}
//       </div>
//     </div>
//   </MuiThemeProvider>
// );
