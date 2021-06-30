import { ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';

type ListElementProps = {
  title: string;
  noteList?: string[];
  title2?: string;
  noteList2?: string[];
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
        <ListItemText primary={<b>{props.title}</b>} secondary={props.noteList?.join(', ')} />
        {props.title2 && props.noteList2 && <ListItemText primary={<b>{props.title2}</b>} secondary={props.noteList2.join(", ")} />}
      </div>
    </ListItem>
  );
};

export default ListElement;
