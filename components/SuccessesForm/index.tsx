import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { FC, useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { buttonTheme } from '../../lib/themes';

type SuccessesFormProps = {
  defaultSuccesses: string[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    elNameDiv: {
      display: 'inline',
    },
  }),
);

const SuccessesForm: FC<SuccessesFormProps> = (props) => {
  const [successes, setSuccesses] = useState<string[]>(props.defaultSuccesses);
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={buttonTheme}>
    <div>
      <div>
        {(() => {
          const elNameFields: JSX.Element[] = [];
          for (let i = 0; i < successes.length; i++) {
            elNameFields.push(
              <div className={classes.elNameDiv} key={i}>
                <TextField
                  value={successes[i]}
                  placeholder={`name${i}`}
                  onChange={(e) => {
                    const newSucc = [...successes];
                    newSucc[i] = e.target.value;
                    setSuccesses(newSucc);
                  }}
                />
                <IconButton
                  onClick={() => {
                    const newSucc = [...successes];
                    newSucc.splice(i, 1);
                    setSuccesses(newSucc);
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </div>,
            );
          }
          return elNameFields;
        })()}
      </div>
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          const newSucc = [...successes];
          newSucc.push('');
          setSuccesses(newSucc);
        }}
      >
        Add card name
      </Button>
      <div>End</div>
    </div>
    </MuiThemeProvider>
  );
};

export default SuccessesForm;
