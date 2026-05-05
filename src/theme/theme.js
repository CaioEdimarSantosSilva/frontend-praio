import { createTheme } from '@mui/material/styles';

export const colors = {
  base: '#042c53',
  primary: '#185FA5',
  azul: '#378ADD',
  teal: '#0F6E56',
  fundo: '#E6F1FB',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.base,
      light: colors.azul,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.teal,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.fundo,
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2e44',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"SF Pro Text"',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
