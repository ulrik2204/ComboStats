import { AppBar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC, useState } from 'react';
import { backgroundTheme } from '../../lib/themes';
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
    width: 200,
    height: 80,
    marginLeft: -100,
  },
  '@media screen and (max-width: 800px)': {
    arrowbutton: {
      width: 90,
    },
    logo: {
      width: 100,
      height: 50,
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
  const router = useRouter();
  const [lastClicked, setLastClicked] = useState({
    population: router.pathname === '/population',
    successes: router.pathname === '/successes',
    more: router.pathname === '/more',
    calculate: router.pathname === '/calculate',
  });
  const classes = useStyles();
  return (
    <div>
      <MuiThemeProvider theme={backgroundTheme}>
        <AppBar position="fixed" color="secondary" className={classes.appBar}>
          <div className={classes.contentDiv}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push('/');
                setLastClicked({ population: false, successes: false, more: false, calculate: false });
              }}
            >
              <img src="/ComboStatsLogo.svg" className={classes.logo} />
            </span>
            <Arrowbutton
              text="Deck"
              onClick={() => {
                setLastClicked({ population: true, successes: false, more: false, calculate: false });
                router.push('/population');
              }}
              clicked={lastClicked.population}
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="Combos"
              onClick={() => {
                setLastClicked({ population: false, successes: true, more: false, calculate: false });
                router.push('/successes');
              }}
              clicked={lastClicked.successes}
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="More"
              onClick={() => {
                setLastClicked({ population: false, successes: false, more: true, calculate: false });
                router.push('/more');
              }}
              clicked={lastClicked.more}
              className={classes.arrowbutton}
            />
            <Arrowbutton
              text="Calculate"
              onClick={() => {
                setLastClicked({ population: false, successes: false, more: false, calculate: true });
                router.push('/calculate');
              }}
              clicked={lastClicked.calculate}
              className={classes.arrowbutton}
            />
          </div>
        </AppBar>
      </MuiThemeProvider>
    </div>
  );
};
export default Menu;
