import { AppBar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { backgroundTheme } from '../../lib/themes';
import { useLoginTempUser } from '../../lib/utils-frontend';
import { useAppSelector } from '../../store/index';
import Arrowbutton from './Arrowbutton';

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 80,
  },
  contentDiv: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
  },
  arrowbutton: {},
  logo: {
    height: 50,
    marginLeft: -100,
  },
  '@media screen and (max-width: 800px)': {
    arrowbutton: {
      width: 90,
    },
    logo: {
      height: 30,
      marginLeft: -50,
    },
    appBar: {
      height: 60,
    },
    contentDiv: {
      height: '60px',
    },
  },
  '@media screen and (max-width: 520px)': {
    logo: {
      display: 'none',
    },
  },
}));

const populationPage = '/populationpage';
const successesPage = '/successespage';
const morePage = '/morepage';
const calculatePage = '/calculatepage';

const Menu: FC = () => {
  const state = useAppSelector((state) => state);
  const router = useRouter();
  const [lastClicked, setLastClicked] = useState({
    population: router.pathname === populationPage,
    successes: router.pathname === successesPage,
    more: router.pathname === morePage,
    calculate: router.pathname === calculatePage,
  });

  const setClicked = useCallback(
    (page: string) => {
      setLastClicked({
        population: page === populationPage,
        successes: page === successesPage,
        more: page === morePage,
        calculate: page === calculatePage,
      });
    },
    [setLastClicked],
  );
  const classes = useStyles();
  useLoginTempUser();

  useEffect(() => {
    setClicked(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    console.log(lastClicked, router.pathname);
  }, [lastClicked]);
  return (
    <div>
      <MuiThemeProvider theme={backgroundTheme}>
        <AppBar position="fixed" color="secondary" className={classes.appBar}>
          <div className={classes.contentDiv}>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
              <img src="/ComboStatsRoundedLogo.png" className={classes.logo} />
            </span>
            <Arrowbutton
              text="Deck"
              variant={lastClicked.population ? 'clicked' : 'clickable'}
              onClick={() => router.push(populationPage)}
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="Combos"
              onClick={() => router.push(successesPage)}
              variant={
                lastClicked.successes
                  ? 'clicked'
                  : state.population.population.name === ''
                  ? 'unclickable'
                  : 'clickable'
              }
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="More"
              onClick={() => router.push(morePage)}
              variant={
                lastClicked.more
                  ? 'clicked'
                  : state.successes.scenarioGroup.name === ''
                  ? 'unclickable'
                  : 'clickable'
              }
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="Calculate"
              onClick={() => router.push(calculatePage)}
              variant={
                lastClicked.calculate
                  ? 'clicked'
                  : state.population.population.name === '' ||
                    state.successes.scenarioGroup.name === ''
                  ? 'unclickable'
                  : 'clickable'
              }
              className={classes.arrowbutton}
            />
          </div>
        </AppBar>
      </MuiThemeProvider>
    </div>
  );
};
export default Menu;
