import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  Typography
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { FC } from 'react';

type DropdownProps = {
  inputLabel: string;
  itemList: string[];
  value: string;
  setValue: (s: string) => void;
  addButtonOnClick?: () => void;
  editButtonOnClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '16em',
    },
    formDiv: {
      margin: '1em 0em 1em 0em',
      display: 'inline-flex',
      alignItems: 'bottom',
    },
    menuItemDiv: {
      display: 'flex',
      flexFlow: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    editButton: {
      padding: 6,
    },
    editButtonDiv: {
      display: 'flex',
      alignItems: 'flex-end',
      marginLeft: '0.7em',
    },
  }),
);

const Dropdown: FC<DropdownProps> = (props) => {
  const classes = useStyles();
  const addButtonUnique = 'addButton^gf34trfg34tq425r';

  return (
    <div className={classes.formDiv}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{props.inputLabel}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.value}
          onChange={(e) => {
            const newValue = e.target.value as string;
            if (newValue !== addButtonUnique) return props.setValue(newValue);
            // Else, fire the addButtonOnClick
            props.addButtonOnClick?.();
          }}
        >
          {props.itemList.map((item) => (
            <MenuItem key={item} value={item}>
              <div className={classes.menuItemDiv}>{item}</div>
            </MenuItem>
          ))}
          {props.addButtonOnClick && (
            <MenuItem value={addButtonUnique} key={addButtonUnique}>
              <AddIcon />
              <Typography variant="button">Add {props.inputLabel}</Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
      {props.editButtonOnClick && props.value !== '' && (
        <div className={classes.editButtonDiv}>
          <IconButton className={classes.editButton} onClick={() => props.editButtonOnClick?.()}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
