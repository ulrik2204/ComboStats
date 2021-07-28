import { Element } from '.prisma/client';
import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import Menu from '../components/Menu';
import Toast, { ToastProps } from '../components/Toast/index';
import { PopulationContext, SuccessGroupsContext, ToastContext } from '../lib/contexts';
import { backgroundTheme } from '../lib/themes';
import { findDefaultValue, useUpdateLocalStorage } from '../lib/utils-frontend';
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
  // The context state for creating a Toast
  const [toastData, setToastData] = useState<ToastProps>({
    open: false,
    title: '',
    onClose: () => setToastData({ ...toastData, open: false }),
    type: 'none',
  });
  // Update localStorage with population when population changes
  useUpdateLocalStorage(population, 'population');

  // Update localStorage with successGroups when successGroups changes
  useUpdateLocalStorage(successGroups, 'successGroups');

  // Create a temp user and log in with that user.
  //useLoginTempUser();

  return (
    <div className="root">
      <Provider store={store}>
        <MuiThemeProvider theme={backgroundTheme}>
          <PopulationContext.Provider value={{ population, setPopulation }}>
            <SuccessGroupsContext.Provider value={{ successGroups, setSuccessGroups }}>
              <ToastContext.Provider value={{ toastData, setToastData }}>
                <Toast
                  open={toastData.open}
                  onClose={toastData.onClose}
                  onConfirm={toastData.onConfirm}
                  title={toastData.title}
                  description={toastData.description}
                  type={toastData.type}
                  children={toastData.children}
                  disableClose={toastData.disableClose}
                  color={toastData.color}
                />
                <Menu />
                <Component {...pageProps} />
              </ToastContext.Provider>
            </SuccessGroupsContext.Provider>
          </PopulationContext.Provider>
        </MuiThemeProvider>
      </Provider>
    </div>
  );
}
export default MyApp;
