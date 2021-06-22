import type { AppProps } from 'next/app';
import Menu from '../components/Menu';
import '../styles/globals.css';
import { MuiThemeProvider } from '@material-ui/core';
import { backgroundTheme } from '../lib/themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="root">
      <Menu />
      <MuiThemeProvider theme={backgroundTheme}>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </div>
  );
}
export default MyApp;
