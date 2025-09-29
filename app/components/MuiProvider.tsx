'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'


interface MuiProviderProps {
  children: React.ReactNode
}

export default function MuiProvider({ children }: MuiProviderProps) {
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}