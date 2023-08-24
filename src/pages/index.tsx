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
      description="Estimate the probability of drawing success from a population (without replacement) using ComboStats!
          Instead of using formulas, this app draws A LOT of samples to estimate the probability of success."
    >
      <div>
        <p>
          This website is ideal when the probability formula for calculating success becomes very
          intricate. Thus this webiste is perfect for calculating the probability of complex
          starting hands in TCGs like <i>Yu-Gi-Oh!</i> and <i>Magic: The Gathering</i>. Therefore it
          uses terms like &quot;Deck&ldquo; instead of &quot;Population&ldquo;, &quot;Combos&ldquo;
          instead of &quot;Successes&ldquo; and &quot;Bricks&ldquo; instead of &quot;Failures&ldquo;
          to better suit the intended use case.
        </p>
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
      </div>
    </PageTemplate>
  );
};

export default Home;
