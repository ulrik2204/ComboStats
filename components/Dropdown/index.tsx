import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { FC } from 'react';

type DropdownProps = {
  inputLabel: string;
  itemList: string[];
  value: string;
  setValue: (s: string) => void;
  addButtonOnClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '16em',
    },
    formDiv: {
      margin: '1em 0em 1em 0em',
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
              {item}
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
    </div>
  );
};
export default Dropdown;
