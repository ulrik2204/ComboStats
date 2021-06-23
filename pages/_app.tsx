import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import Menu from '../components/Menu';
import { PopulationContext } from '../lib/contexts';
import { Population } from '../lib/core';
import { backgroundTheme } from '../lib/themes';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [population, setPopulation] = useState(new Population())
  return (
    <div className="root">
      <Menu />
      <MuiThemeProvider theme={backgroundTheme}>
        <PopulationContext.Provider value={{population, setPopulation}}>
          <Component {...pageProps} />
        </PopulationContext.Provider>
      </MuiThemeProvider>
    </div>
  );
}
export default MyApp;
