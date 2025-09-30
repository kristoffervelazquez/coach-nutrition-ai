'use client';

import { 
  Box, 
  Paper, 
  Stack, 
  TextField, 
  InputAdornment, 
  Tabs, 
  Tab, 
  Button 
} from '@mui/material';
import { Search, Add, Restaurant, FitnessCenter } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface LogsControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export default function LogsControls({ 
  searchTerm, 
  onSearchChange, 
  currentTab, 
  onTabChange 
}: LogsControlsProps) {
  const router = useRouter();

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Stack spacing={{ xs: 3, sm: 2 }}>
        {/* Barra de búsqueda */}
        <TextField
          placeholder="Buscar en registros..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: '100%',
            maxWidth: { sm: '350px' }
          }}
        />
        
        {/* Pestañas y botón */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => onTabChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              minHeight: { xs: 40, sm: 48 },
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minHeight: { xs: 40, sm: 48 },
                padding: { xs: '6px 8px', sm: '12px 16px' }
              }
            }}
          >
            <Tab label="Todos" />
            <Tab 
              label="Comidas"
              icon={<Restaurant sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />} 
              iconPosition="start" 
            />
            <Tab 
              label="Entrenamientos"
              icon={<FitnessCenter sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />} 
              iconPosition="start" 
            />
          </Tabs>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/log')}
            sx={{ 
              whiteSpace: 'nowrap',
              minWidth: { sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Nuevo Registro
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}