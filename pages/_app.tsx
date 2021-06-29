import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import ConfirmDialog, { ConfirmDialogProps } from '../components/ConfirmDialog/index';
import Menu from '../components/Menu';
import { ConfirmDialogContext, PopulationContext, SuccessGroupsContext } from '../lib/contexts';
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
  return defaultValue;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [population, setPopulation] = useState<Element[]>(findLocalStartValue('population'));
  const [successGroups, setSuccessGroups] = useState<{ [sucessGroupName: string]: Element[] }>(
    findLocalStartValue('successGroups'),
  );
  // The context state for creating a ConfirmDialog
  const [confirmDialogInfo, setConfirmDialogInfo] = useState<ConfirmDialogProps>({
    open: false,
    title: '',
    onYes: () => {},
    onClose: () => setConfirmDialogInfo({ ...confirmDialogInfo, open: false }),
    type: 'confirm',
  });
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
            <ConfirmDialog
              open={confirmDialogInfo.open}
              onClose={confirmDialogInfo.onClose}
              onYes={confirmDialogInfo.onYes}
              title={confirmDialogInfo.title}
              description={confirmDialogInfo.description}
              type={confirmDialogInfo.type}
            />
            <ConfirmDialogContext.Provider value={{ confirmDialogInfo, setConfirmDialogInfo }}>
              <Component {...pageProps} />
            </ConfirmDialogContext.Provider>
          </SuccessGroupsContext.Provider>
        </PopulationContext.Provider>
      </MuiThemeProvider>
    </div>
  );
}
export default MyApp;
