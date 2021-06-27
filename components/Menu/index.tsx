import { AppBar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC, useState } from 'react';
import { appBarTheme } from '../../lib/themes';
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
  arrowbutton: {
    width: 153,
  },
  logo: {
    width: 70,
    height: 70,
  },
  '@media screen and (max-width: 750px)': {
    arrowbutton: {
      width: 90,
    },
    logo: {
      width: 50,
      height: 50,
    },
    appBar: {
      height: 60,
    },
    contentDiv: {
      height: '60px',
    },
  },
  '@media screen and (max-width: 480px)': {
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
      <MuiThemeProvider theme={appBarTheme}>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <div className={classes.contentDiv}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push('/');
                setLastClicked({ population: false, successes: false, more: false, calculate: false });
              }}
            >
              <img src="/ComboStatsBrownFade.svg" className={classes.logo} />
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
