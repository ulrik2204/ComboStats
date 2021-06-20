import { AppBar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { FC, useState } from 'react';
import { backgroundTheme } from '../../lib/themes';
import Arrowbutton from './Arrowbutton';

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  afterDiv: {
    height: '90px',
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
          <div>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push('/');
                setLastClicked({ population: false, successes: false, more: false, calculate: false });
              }}
            >
              <Image width={120} height={80} src="/vercel.svg" />
            </span>
            <Arrowbutton
              text="Deck"
              onClick={() => {
                setLastClicked({ population: true, successes: false, more: false, calculate: false });
                router.push('/population');
              }}
              clicked={lastClicked.population}
            />
            <Arrowbutton
              text="Combos"
              onClick={() => {
                setLastClicked({ population: false, successes: true, more: false, calculate: false });
                router.push('/successes');
              }}
              clicked={lastClicked.successes}
            />
            <Arrowbutton
              text="More"
              onClick={() => {
                setLastClicked({ population: false, successes: false, more: true, calculate: false });
                router.push('/more');
              }}
              clicked={lastClicked.more}
            />
            <Arrowbutton
              text="Calculate"
              onClick={() => {
                setLastClicked({ population: false, successes: false, more: false, calculate: true });
                router.push('/calculate');
              }}
              clicked={lastClicked.calculate}
            />
          </div>
        </AppBar>
        <div className={classes.afterDiv}></div>
      </MuiThemeProvider>
    </div>
  );
};
export default Menu;
