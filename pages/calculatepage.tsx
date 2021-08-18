import { Button } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { getCalculationFromAPI } from '../lib/api-calls';
import { populationPageUrl } from '../lib/constants-frontend';
import { buttonTheme } from '../lib/themes';
import { GetCalculationResponse } from '../lib/types';
import { useToast } from '../lib/utils-frontend';
import { useAppSelector } from '../store/index';

const Calculate: FC = () => {
  const router = useRouter();
  const toast = useToast();
  const state = useAppSelector((state) => state);
  const [result, setResult] = useState<GetCalculationResponse | null>(null);
  // If the user tries to access the page without having a set population or successes, redirect to that page.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
    // else if (state.successes.scenarioGroup.name === '') router.push(successesPageUrl);
  }, []);

  const handleCalculateClick = async () => {
    const res = await getCalculationFromAPI(state.population.population.populationId, 1000, 1);
    if (!res.ok)
      return toast({
        title: 'Error getting calculation',
        description: `There was an error with code: ${res.status}. Please try again later`,
        type: 'alert',
        color: 'error',
      });
    // Else, the response is fine
    setResult(res.data);
  };

  return (
    <PageTemplate title="Calculate" description="Calculate">
      <div>
        <MuiThemeProvider theme={buttonTheme}>
          <Button variant="contained" onClick={handleCalculateClick}>
            Calculate
          </Button>
          <pre>{result ? JSON.stringify(result, null, 2) : 'No result yet.'}</pre>
        </MuiThemeProvider>
      </div>
    </PageTemplate>
  );
};

export default Calculate;
