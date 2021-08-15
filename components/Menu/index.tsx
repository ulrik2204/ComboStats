import { AppBar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  calculatePageUrl,
  homePageUrl,
  morePageUrl,
  populationPageUrl,
  successesPageUrl,
} from '../../lib/constants-frontend';
import { backgroundTheme } from '../../lib/themes';
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

const Menu: FC = () => {
  const state = useAppSelector((state) => state);
  const router = useRouter();
  const [lastClicked, setLastClicked] = useState({
    population: router.pathname === populationPageUrl,
    successes: router.pathname === successesPageUrl,
    more: router.pathname === morePageUrl,
    calculate: router.pathname === calculatePageUrl,
  });

  const setClicked = useCallback(
    (page: string) => {
      setLastClicked({
        population: page === populationPageUrl,
        successes: page === successesPageUrl,
        more: page === morePageUrl,
        calculate: page === calculatePageUrl,
      });
    },
    [setLastClicked],
  );
  const classes = useStyles();

  useEffect(() => {
    setClicked(router.pathname);
  }, [router.pathname]);

  return (
    <div>
      <MuiThemeProvider theme={backgroundTheme}>
        <AppBar position="fixed" color="secondary" className={classes.appBar}>
          <div className={classes.contentDiv}>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push(homePageUrl)}>
              <img src="/ComboStatsRoundedLogo.png" className={classes.logo} />
            </span>
            <Arrowbutton
              text="Deck"
              variant={lastClicked.population ? 'clicked' : 'clickable'}
              onClick={() => router.push(populationPageUrl)}
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="Combos"
              onClick={() => router.push(successesPageUrl)}
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
              onClick={() => router.push(morePageUrl)}
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
              onClick={() => router.push(calculatePageUrl)}
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
