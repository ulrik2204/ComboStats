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

/**
 * Props of the Toast component.
 * @remarks
 * onYes is only used if type='confirm'.
 */
export type ToastProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  type: ToastType;
  description?: string;
  onYes?: () => void; // Only used if type='confirm'
  color?: ToastColor;
  disableClose?: boolean; // Disables backdrop click and x (corner close) button.
  children?: JSX.Element;
};
export type ToastType = 'confirm' | 'alert' | 'none';
export type ToastColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | undefined;

const useStyles = (color: ToastColor) =>
  makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        minWidth: 300,
        backgroundColor: color ? theme.palette[color].main : theme.palette.warning.main,
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        color: theme.palette.grey[500],
      },
    }),
  )();

const Toast: FC<ToastProps> = (props) => {
  const classes = useStyles(props.color);
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

export default Toast;
