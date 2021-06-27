import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import Menu from '../components/Menu';
import { PopulationContext, SuccessGroupsContext } from '../lib/contexts';
import { Element } from '../lib/core';
import { backgroundTheme } from '../lib/themes';
import { findDefaultValue, useUpdateLocalStorage } from '../lib/util';
import '../styles/globals.css';

const findLocalStartValue = (key: string): any => {
  const defaultValue = findDefaultValue(key);
  if (typeof window !== 'undefined') {
    const localPop = localStorage.getItem(key);
    return localPop == null || ['null', undefined, 'undefined'].indexOf(localPop) > -1
      ? defaultValue
      : JSON.parse(localPop);
  }
  // If it is being rendered on the server, return a matching object related to the name of the key
  console.log(key, defaultValue);
  return defaultValue;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [population, setPopulation] = useState<Element[]>(findLocalStartValue('population'));
  const [successGroups, setSuccessGroups] = useState<{ [sucessGroupName: string]: Element[] }>(
    findLocalStartValue('successGroups'),
  );
  // Update localStorage with population when population changes
  useUpdateLocalStorage(population, 'population');

  // Update localStorage with successGroups when successGroups changes
  useUpdateLocalStorage(successGroups, 'successGroups');

  return (
    <div className="root">
      <Menu />
      <MuiThemeProvider theme={backgroundTheme}>
        <PopulationContext.Provider value={{ population, setPopulation }}>
          <SuccessGroupsContext.Provider value={{ successGroups, setSuccessGroups }}>
            <Component {...pageProps} />
          </SuccessGroupsContext.Provider>
        </PopulationContext.Provider>
      </MuiThemeProvider>
    </div>
  );
}
export default MyApp;
