import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    orange: {
      contrastText: "#fff",
      main: "#e9131d"
    },
    brown: {
      contrastText: "#fff",
      main: "#cfaf7b"
    },
    blue: {
      contrastText: "#fff",
      main: "#0485d1"
    },
    white: {
      contrastText: "#e9131d",
      main: "#fff"
    }
  },
});

export default theme;