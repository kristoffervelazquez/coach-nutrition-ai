'use client'
import { Container, Paper } from '@mui/material'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container component={'span'} maxWidth="md" sx={{ mt: 4 }}>
      <Paper component={'span'} elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Paper>
    </Container>
  )
}

export default layout