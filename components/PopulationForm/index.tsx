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
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { PopulationContext } from '../../lib/contexts';
import { identifyEl, removeByElement } from '../../lib/core';
import { buttonTheme } from '../../lib/themes';

type PopualtionFormProps = {
  defaultName: string;
  defaultRoles: string[];
  type: 'add' | 'edit';
  clearAllOnConfirm?: boolean;
  afterConfirm?: () => void;
  afterDelete?: () => void;
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
    countBox: {
      marginLeft: 30,
      width: theme.spacing(8),
    },
    finishingButtonsDiv: {},
  }),
);

const PopulationForm: FC<PopualtionFormProps> = (props) => {
  const [name, setName] = useState(props.defaultName);
  const [elementCount, setElementCount] = useState(1);
  const [roles, setRoles] = useState(props.defaultRoles);
  const { population, setPopulation } = useContext(PopulationContext);
  const classes = useStyles();

  useEffect(() => {
    console.log();
  }, [name]);
  /**
   * Function to handle the press of the confirm button
   */
  const handleConfirm = useCallback(() => {
    let newPop = population;
    if (props.type === 'edit') {
      newPop = removeByElement(newPop, { name: props.defaultName, roles: props.defaultRoles });
    }
    // Filter out roles that are the emtpy string
    // The Element class will filter out duplicates of equal roles
    // Also convert all roles to all lower case
    const usedRoles = roles.filter((role) => role.trim() !== '').map((role) => role.trim().toLowerCase());
    const el = identifyEl({ name, roles: usedRoles });
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
  const handleDelete = useCallback(() => {
    setPopulation(removeByElement(population, { name: props.defaultName, roles: props.defaultRoles }));
    props.afterDelete?.();
  }, [population, setPopulation, props.defaultName, props.defaultRoles, props.afterDelete]);

  return (
    <MuiThemeProvider theme={buttonTheme}>
      <div>
        <div>
          <TextField label="Name of card" value={name} onChange={(e) => setName(e.target.value)} />
          {props.type === 'add' && (
            <TextField
              label="Count"
              value={elementCount}
              type="number"
              className={classes.countBox}
              onChange={(e) => setElementCount(parseInt(e.target.value))}
            />
          )}
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
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default PopulationForm;
