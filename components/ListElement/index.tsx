import { ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';

export type ListEl = {
  boldNotes: string[];
  fadedNotes?: string[];
};

type ListElementProps = {
  item: ListEl;
  item2?: ListEl;
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
        <ListItemText
          primary={<b>{props.item.boldNotes.join(', ')}</b>}
          secondary={props.item.fadedNotes?.join(', ')}
        />
        {props.item2 && (
          <ListItemText
            primary={<b>{props.item2?.boldNotes?.join(', ')}</b>}
            secondary={props.item2?.fadedNotes?.join(', ')}
          />
        )}
      </div>
    </ListItem>
  );
};

export default ListElement;
