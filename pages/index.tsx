import { Button } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { buttonTheme } from '../lib/themes';

const Home: FC = () => {
  const router = useRouter();
  return (
    <PageTemplate
      title="ComboStats"
      description="Estimate the probability of drawing success from a population ComboStats!"
    >
      <div>
        <div>
          <p>
            Using computer power, instead of calculating the probability of success using formulas,
            this app draws from the population A LOT of times to estimate the probability of
            success.
          </p>
        </div>
        <div>
          <p>
            This webiste is ideal when calculating the probability of success in a population using
            formulas becomes extremely hard and complex. Thus this webiste is perfect for
            calculating the probability of complex starting hands in TCGs like <i>Yu-Gi-Oh!</i> and{' '}
            <i>Magic: The Gathering</i>. In addition, it is easy to perform some effects of certain
            cards when they are drawn, like drawing cards with "Pot of Greed" (this funcitonality
            might be added later).
          </p>
        </div>
        <div>
          <p>Follow these steps to use the app:</p>
          <ol>
            <li>Build the population/deck.</li>
            <li>Assign the scenarios/combos that make success occur.</li>
            <li>If you want you can add scenarios that make a failure occur.</li>
            <li>Estimate the probability of success!</li>
          </ol>
        </div>
        <MuiThemeProvider theme={buttonTheme}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              router.push('/populationpage');
            }}
          >
            Start
          </Button>
        </MuiThemeProvider>
        <div>
          <p>
            Click the START button above or the Deck menu button at the top of the page to begin.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Home;
