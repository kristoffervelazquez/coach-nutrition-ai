'use client';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function ChatHeader() {
  return (
    <AppBar position="static" sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
      <Toolbar>
        <IconButton  edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <SmartToyIcon />
        </IconButton>
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          AI Fitness Coach
        </Typography>
      </Toolbar>
    </AppBar>
  );
}