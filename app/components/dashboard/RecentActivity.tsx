'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List
} from '@mui/material';
import { Restaurant, FitnessCenter } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { LogEntry } from '@/amplify/data/resource';
import LogItem from '../ui/LogItem';

interface RecentActivityProps {
  recentLogs: LogEntry[];
}

export default function RecentActivity({ recentLogs }: RecentActivityProps) {
  const router = useRouter();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Actividad Reciente
        </Typography>
        {recentLogs.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push('/logs')}
          >
            Ver Historial Completo
          </Button>
        )}
      </Box>
      <Card 
        sx={{
          cursor: recentLogs.length > 0 ? 'pointer' : 'default',
          '&:hover': recentLogs.length > 0 ? { boxShadow: 3 } : {}
        }}
        onClick={() => recentLogs.length > 0 && router.push('/logs')}
      >
        <CardContent>
          {recentLogs.length > 0 ? (
            <>
              <List disablePadding>
                {recentLogs.slice(0, 5).map((log, index) => (
                  <LogItem
                    key={log.PK + log.SK}
                    log={log}
                    index={index}
                    totalItems={Math.min(recentLogs.length, 5)}
                  />
                ))}
              </List>
              {recentLogs.length > 5 && (
                <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    ... y {recentLogs.length - 5} registros más
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/logs');
                    }}
                  >
                    Ver todo el historial
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No hay registros aún
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comienza registrando tu primera comida o entrenamiento
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/log?type=meal')}
                  startIcon={<Restaurant />}
                >
                  Registrar Comida
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/log?type=workout')}
                  startIcon={<FitnessCenter />}
                >
                  Registrar Entrenamiento
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}