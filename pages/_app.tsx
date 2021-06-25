import { Button, MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import Menu from '../components/Menu';
import { PopulationContext } from '../lib/contexts';
import { Element } from '../lib/core';
import { backgroundTheme } from '../lib/themes';
import '../styles/globals.css';

const findPopulationStartValue = (): Element[] => {
  if (typeof window !== 'undefined') {
    const localPop = localStorage.getItem('population');
    console.log('localPop value', localPop);
    return localPop == null || ['null', undefined, 'undefined'].indexOf(localPop) > -1 ? [] : JSON.parse(localPop);
  }
  return [];
};

function MyApp({ Component, pageProps }: AppProps) {
  const [population, setPopulation] = useState<Element[]>(findPopulationStartValue());
  let isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Otherwise, population is getting updated, so the localStorage version is updated
    if (typeof window !== 'undefined' && population !== []) localStorage.setItem('population', JSON.stringify(population));
  }, [population, setPopulation]);

  return (
    <div className="root">
      <Menu />
      <MuiThemeProvider theme={backgroundTheme}>
        <PopulationContext.Provider value={{ population, setPopulation }}>
          <Component {...pageProps} />
        </PopulationContext.Provider>
      </MuiThemeProvider>
    </div>
  );
}
export default MyApp;
