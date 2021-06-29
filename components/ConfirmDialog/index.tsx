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
import { MuiThemeProvider } from '@material-ui/core/styles';
import { FC } from 'react';
import { buttonTheme } from '../../lib/themes';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onYes?: () => void;
  type: 'confirm' | 'alert';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minWidth: 300,
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

export const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
  const classes = useStyles();
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{ className: classes.paper }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      {props.description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <MuiThemeProvider theme={buttonTheme}>
          <Button variant="contained" onClick={props.onClose}>
            {props.type === 'confirm' ? 'No' : props.type === 'alert' ? 'Ok' : ''}
          </Button>
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
