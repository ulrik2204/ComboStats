import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC, useState } from 'react';

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

// Form label constants
// const scenarioNameLabel

const ScenarioForm: FC<SuccessesFormProps> = (props) => {
  const [successes, setSuccesses] = useState<string[]>(props.defaultSuccesses);
  const classes = useStyles();

  return <div></div>;
};

export default ScenarioForm;

/**
 *     <MuiThemeProvider theme={buttonTheme}>
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
 */
