import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    orange: {
      contrastText: '#fff',
      main: '#ff5349',
    },
    yellow: {
      contrastText: '#fff',
      main: '#fff064',
    },
    kakao_yellow: {
      contrastText: '#000',
      main: '#FEE500',
    },
    brown: {
      contrastText: '#fff',
      main: '#cfaf7b',
    },
    blue: {
      contrastText: '#fff',
      main: '#0485d1',
    },
    white: {
      contrastText: '#e9131d',
      main: '#fff',
    },
    gray_1: {
      contrastText: '#fff',
      main: '#949494',
    },
    gray_2: {
      contrastText: '#fff',
      main: '#a5a5a5',
    },
    gray_3: {
      contrastText: '#fff',
      main: '#b6b6b6',
    },
    gray_4: {
      contrastText: '#fff',
      main: '#c8c8c8',
    },
    gray_5: {
      contrastText: '#fff',
      main: '#dadada',
    },
    gray_6: {
      contrastText: '#fff',
      main: '#ececec',
    },
    black: {
      contrastText: '#fff',
      main: '#000',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      xxxsm: 300,
      xxsm: 400,
      xsm: 500,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
