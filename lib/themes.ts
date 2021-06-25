import { createMuiTheme } from '@material-ui/core';

export const backgroundTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#D1D2F9',
    },
    secondary: {
      main: '#19A1B3',
    },
    
  },
});

export const appBarTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFBE86',
    },
  },
});

export const buttonTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#19A1B3',
      contrastText: "#000000",
    },
    secondary: {
      main: '#EF3E36',
      contrastText: "#000000",
    },
  },
});
