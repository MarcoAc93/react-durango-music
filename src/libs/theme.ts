// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul
    },
    secondary: {
      main: '#d32f2f', // Rojo
    },
    error: {
      main: '#f44336', // Rojo (error)
    },
    background: {
      default: '#ffffff', // Blanco
    },
    text: {
      primary: '#000000', // Negro
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;
