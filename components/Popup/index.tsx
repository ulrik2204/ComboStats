import { createStyles, Dialog, makeStyles, Theme, useTheme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FC } from 'react';

type PopupProps = {
  children?: JSX.Element;
  open: boolean;
  onClose: () => void;
  title: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: 20,
    },
    contentDiv: {
      padding: '0px 20px 20px 20px',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialog: {
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

/**
 * A component making a popup dialog with the desired format
 * @param props
 */
const Popup: FC<PopupProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Dialog
      open={props.open}
      onClose={(_event, reason) => reason !== 'backdropClick' && props.onClose()}
      fullWidth={true}
      maxWidth="xs"
      PaperProps={{ className: classes.dialog }}
    >
      <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose}>
        <CloseIcon />
      </IconButton>
      <h1 id="dialogTitle" className={classes.title}>
        {props.title}
      </h1>
      <div className={classes.contentDiv}>{props.children}</div>
    </Dialog>
  );
};

export default Popup;
