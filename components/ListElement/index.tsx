import { ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import { FC } from 'react';

type ListElementProps = {
  title: string;
  infoList?: string[];
  title2?: string;
  bulletList?: string[];
  onClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  listElDiv: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
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
        <ListItemText primary={<b>{props.title}</b>} secondary={props.infoList?.join(', ')} />
        {props.title2 && props.bulletList && (
          <ListItemText
            primary={<b>{props.title2}</b>}
            secondary={
              <ul>
                {props.bulletList?.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            }
          />
        )}
      </div>
    </ListItem>
  );
};

export default ListElement;
