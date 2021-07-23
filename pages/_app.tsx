import { Element } from '.prisma/client';
import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import ConfirmDialog, { ConfirmDialogProps } from '../components/ConfirmDialog/index';
import Menu from '../components/Menu';
import { ConfirmDialogContext, PopulationContext, SuccessGroupsContext } from '../lib/contexts';
import { backgroundTheme } from '../lib/themes';
import { findDefaultValue, useLoginTempUser, useUpdateLocalStorage } from '../lib/utils-frontend';
import store from '../store';
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
  const [successGroups, setSuccessGroups] = useState<{ [sucessGroupName: string]: Element[][] }>(
    findLocalStartValue('successGroups'),
  );
  // The context state for creating a ConfirmDialog
  const [confirmDialogInfo, setConfirmDialogInfo] = useState<ConfirmDialogProps>({
    open: false,
    title: '',
    onYes: () => {},
    onClose: () => setConfirmDialogInfo({ ...confirmDialogInfo, open: false }),
    type: 'none',
  });
  // Update localStorage with population when population changes
  useUpdateLocalStorage(population, 'population');

  // Update localStorage with successGroups when successGroups changes
  useUpdateLocalStorage(successGroups, 'successGroups');

  // Create a temp user and log in with that user.
  useLoginTempUser();

  return (
    <div className="root">
      <Provider store={store}>
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
                children={confirmDialogInfo.children}
                disableClose={confirmDialogInfo.disableClose}
              />
              <ConfirmDialogContext.Provider value={{ confirmDialogInfo, setConfirmDialogInfo }}>
                <Component {...pageProps} />
              </ConfirmDialogContext.Provider>
            </SuccessGroupsContext.Provider>
          </PopulationContext.Provider>
        </MuiThemeProvider>
      </Provider>
    </div>
  );
}
export default MyApp;
