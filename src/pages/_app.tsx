import { MuiThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import CommonLogic from '../components/CommonLogic/index';
import Menu from '../components/Menu';
import Toast, { ToastProps } from '../components/Toast/index';
import { ToastContext } from '../lib/contexts';
import { backgroundTheme } from '../lib/themes';
import store from '../store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // The context state for creating a Toast
  const [toastData, setToastData] = useState<ToastProps>({
    open: false,
    title: '',
    onClose: () => {},
    type: 'none',
  });

  // Create a temp user and log in with that user.
  //useLoginTempUser();

  return (
    <div className="root">
      <Provider store={store}>
        <MuiThemeProvider theme={backgroundTheme}>
          <ToastContext.Provider value={{ toastData, setToastData }}>
            <Toast
              open={toastData.open}
              onClose={toastData.onClose}
              onConfirm={toastData.onConfirm}
              title={toastData.title}
              description={toastData.description}
              type={toastData.type}
              disableClose={toastData.disableClose}
              color={toastData.color}
            >
              {toastData.children}
            </Toast>
            <Menu />
            <CommonLogic />
            <Component {...pageProps} />
          </ToastContext.Provider>
        </MuiThemeProvider>
      </Provider>
    </div>
  );
}
export default MyApp;
