'use client'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// Theme simple y responsivo
let theme = createTheme({
  // Colores básicos
  palette: {
    primary: {
      main: '#7551c2',
    },
    secondary: {
      main: '#ff6b35',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  
  // Tipografía limpia
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  
  // Solo componentes responsivos esenciales
  components: {
    // Container responsivo
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (min-width: 600px)': {
            padding: '24px',
          },
        },
      },
    },
    
    // Cards responsivas
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            '@media (min-width: 600px)': {
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
    
    // Botones touch-friendly
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px', // Touch target mínimo
          textTransform: 'none',
        },
      },
    },
    
    // Grid responsivo
    MuiGrid: {
      styleOverrides: {
        container: {
          '@media (max-width: 600px)': {
            margin: '0 -8px',
            width: 'calc(100% + 16px)',
          },
        },
      },
    },
  },
})

// Fuentes responsivas automáticas
theme = responsiveFontSizes(theme)

export { theme }