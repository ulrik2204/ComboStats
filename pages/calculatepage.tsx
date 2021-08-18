import { createStyles, makeStyles } from '@material-ui/styles';
import { ScenarioGroup } from '@prisma/client';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import FormTemplate from '../components/FormTemplate/index';
import PageTemplate from '../components/PageTemplate/index';
import { getCalculationFromAPI, getScenarioGroupsFromAPI } from '../lib/api-calls';
import { populationPageUrl } from '../lib/constants-frontend';
import { ErrorResponse, GetCalculationResponse } from '../lib/types';
import { FormInput } from '../lib/types-frontend';
import { useForm, useToast } from '../lib/utils-frontend';
import { useAppSelector } from '../store/index';

const useStyles = makeStyles(() =>
  createStyles({
    resultGrid: {
      display: 'grid',
      gridTemplateColumns: 'fit-content(15em) fit-content(15em)',
      columnGap: '1em',
      rowGap: '1em',
    },
    resultGridItem: {
      width: 'auto',
    },
  }),
);

const Calculate: FC = () => {
  const formInitialState: FormInput[][] = [
    [
      { label: 'Number of samples', value: 10000, type: 'number' },
      { label: 'Draws per sample', value: 5, type: 'number' },
    ],
  ];
  const classes = useStyles();
  const router = useRouter();
  const toast = useToast();
  const state = useAppSelector((state) => state);
  const [successGroups, setSuccessGroups] = useState<ScenarioGroup[] | null>(null);
  const [result, setResult] = useState<GetCalculationResponse | null>(null);
  const [formState, formDispatch] = useForm(formInitialState);
  // If the user tries to access the page without having a set population or successes, redirect to that page.
  useEffect(() => {
    if (state.population.population.name === '') {
      router.push(populationPageUrl);
      return;
    }
    // Get successGroups alphabetically.
    getScenarioGroupsFromAPI(state.population.population.populationId, 'successes').then((res) => {
      if (!res.ok)
        return toast({
          title: 'Unable to fetch the success groups',
          description: `Error with code ${res.status}. Please try again later.`,
          type: 'alert',
          color: 'error',
        });
      // Else, everything is ok
      setSuccessGroups(res.data.scenarioGroups);
    });
  }, []);

  const handleCalculateClick = async (): Promise<ErrorResponse> => {
    // This returns a list of probabilities for each successGroup in alphabetical order.
    const res = await getCalculationFromAPI(state.population.population.populationId, 1000, 1);
    if (!res.ok)
      return {
        errorMsg: `Error getting calculation: ${res.status}. Please try again later.`,
      };
    // Else, the response is fine
    setResult(res.data);
    return {};
  };

  return (
    <PageTemplate title="Calculate" description="Calculate" column2={<div></div>}>
      <div>
        <FormTemplate
          formState={formState}
          formDispatch={formDispatch}
          confirmButtonText="Calculate"
          onConfirm={handleCalculateClick}
          disableClearOnConfirm
        />
        {result !== null && successGroups !== null && (
          <div>
            <h3>Results:</h3>
            <div className={classes.resultGrid}>
              {result.probabilities.map((prob, successGroupIndex) => {
                return (
                  <>
                    <div className={classes.resultGridItem}>
                      <i>{successGroups[successGroupIndex].name}:</i>
                    </div>
                    <div className={classes.resultGridItem}>
                      <b>{(prob * 100).toFixed(2)} %</b>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Calculate;
