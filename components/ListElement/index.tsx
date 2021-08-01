import { ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';
import { ListObject } from '../../lib/types-frontend';

type ListElementProps = {
  item: ListObject;
  item2?: ListObject;
  onClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  listElDiv: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
    width: 'auto',
    marginTop: 5,
    cursor: 'pointer',
  },
}));

/**
 * An item in the list veiw
 * @param props The name and roles represented in this listelement
 */
const ListElement: FC<ListElementProps> = (props) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.listElDiv} dense onClick={props.onClick}>
      <div>
        <ListItemText primary={<b>{props.item.name}</b>} secondary={props.item.notes.join(', ')} />
        {props.item2 && (
          <ListItemText
            primary={<b>{props.item2?.name}</b>}
            secondary={props.item2?.notes.join(', ')}
          />
        )}
      </div>
    </ListItem>
  );
};

export default ListElement;
