import { createStyles, Dialog, makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FC } from 'react';
import IconButton from '@material-ui/core/IconButton';

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
  }),
);

/**
 * A component making a popup dialog with the desired format
 * @param props
 */
const Popup: FC<PopupProps> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  return (
    <Dialog
      disableBackdropClick
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="dialogTitle"
      aria-aria-describedby="descriptionTitle"
      fullWidth={true}
      fullScreen={fullScreen}
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
