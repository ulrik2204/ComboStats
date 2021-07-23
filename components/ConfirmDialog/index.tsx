import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { FC } from 'react';
import { buttonTheme } from '../../lib/themes';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  type: 'confirm' | 'alert' | 'none';
  description?: string;
  onYes?: () => void;
  disableClose?: boolean;
  children?: JSX.Element;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minWidth: 300,
      backgroundColor: theme.palette.warning.main,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

export const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
  const classes = useStyles();
  return (
    <Dialog
      open={props.open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick') return !props.disableClose && props.onClose();
        props.onClose();
      }}
      PaperProps={{ className: classes.paper }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={!!props.disableClose}
    >
      {!props.disableClose && (
        <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      )}
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      {props.description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.description}</DialogContentText> {props.children}
        </DialogContent>
      )}
      <DialogActions>
        <MuiThemeProvider theme={buttonTheme}>
          {props.type !== 'none' && (
            <Button variant="contained" onClick={props.onClose}>
              {props.type === 'confirm' ? 'No' : props.type === 'alert' ? 'Ok' : ''}
            </Button>
          )}
          {props.type === 'confirm' && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.onYes?.();
                props.onClose();
              }}
            >
              Yes
            </Button>
          )}
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
