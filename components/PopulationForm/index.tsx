import {
  Button,
  createStyles,
  FormLabel,
  IconButton,
  makeStyles,
  MuiThemeProvider,
  TextField,
  Theme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { FC, useCallback, useContext, useState } from 'react';
import { PopulationContext } from '../../lib/contexts';
import { identifyEl, removeAllByName } from '../../lib/core';
import { buttonTheme } from '../../lib/themes';
import { useConfirmDialog } from '../../lib/util';

type PopualtionFormProps = {
  defaultName: string;
  defaultRoles: string[];
  defaultCount: number;
  type: 'add' | 'edit';
  clearAllOnConfirm?: boolean;
  afterConfirm?: () => void;
  afterDeleteAll?: () => void;
};

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
      marginLeft: 30,
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

const PopulationForm: FC<PopualtionFormProps> = (props) => {
  const [name, setName] = useState(props.defaultName);
  const [elementCount, setElementCount] = useState(props.defaultCount);
  const [roles, setRoles] = useState(props.defaultRoles);
  const { population, setPopulation } = useContext(PopulationContext);
  const confirmAction = useConfirmDialog();
  const classes = useStyles();

  /**
   * Function to handle the press of the confirm button
   */
  const handleConfirm = useCallback(() => {
    // If the name value is empty, alert the user
    if (name === '') {
      confirmAction('No name was entered.', 'alert', undefined, 'Please enter a name.');
      return;
    }
    let newPop = population;
    if (props.type === 'edit') {
      newPop = removeAllByName(newPop, props.defaultName);
    }
    // Filter out roles that are the emtpy string
    // The Element class will filter out duplicates of equal roles
    // Also convert all roles to all lower case
    const el = identifyEl({ name, roles, count: 1, elementId: '', populationId: ''});
    // Add elementCount of elements
    for (let i = 0; i < elementCount; i++) {
      newPop.push(el);
    }
    setPopulation([...newPop]);
    if (props.clearAllOnConfirm) {
      setName('');
      setElementCount(1);
      setRoles([]);
    }
    props.afterConfirm?.();
  }, [population, setPopulation, props.afterConfirm, name, elementCount, roles, setRoles]);

  /**
   * Function to handle the press of the delete button
   */
  const handleDeleteAll = useCallback(() => {
    setPopulation(removeAllByName(population, props.defaultName));
    props.afterDeleteAll?.();
  }, [population, setPopulation, props.defaultName, props.afterDeleteAll]);

  return (
    <MuiThemeProvider theme={buttonTheme}>
      <div>
        <div>
          <TextField
            label="Name of card"
            className={classes.nameBox}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Count"
            value={elementCount}
            type="number"
            className={classes.countBox}
            onChange={(e) => setElementCount(parseInt(e.target.value))}
          />
        </div>
        <div className={classes.rolesOverDiv}>
          <FormLabel>Roles</FormLabel>
          {(() => {
            const roleFields: JSX.Element[] = [];
            for (let i = 0; i < roles.length; i++) {
              roleFields.push(
                <div className={classes.roleDiv} key={i}>
                  <TextField
                    value={roles[i]}
                    placeholder={`role${i + 1}`}
                    onChange={(e) => {
                      const newRoles = [...roles];
                      newRoles[i] = e.target.value;
                      setRoles(newRoles);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const newRoles = [...roles];
                      newRoles.splice(i, 1);
                      setRoles(newRoles);
                    }}
                  >
                    <CloseIcon color="secondary" />
                  </IconButton>
                </div>,
              );
            }
            return roleFields;
          })()}
        </div>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            const newRoles = [...roles];
            newRoles.push('');
            setRoles(newRoles);
          }}
        >
          Add role
        </Button>
        <div className={classes.finishingButtonsDiv}>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
          {props.type === 'edit' && (
            <Button
              className={classes.deleteButton}
              variant="contained"
              color="secondary"
              onClick={() =>
                confirmAction(
                  'Delete all copies of the card?',
                  'confirm',
                  handleDeleteAll,
                  'This action is irreversible.',
                )
              }
            >
              Delete all copies
            </Button>
          )}
        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default PopulationForm;
