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
import { useTranslation } from '../../hooks/useTranslation';

interface RecentActivityProps {
  recentLogs: LogEntry[];
}

export default function RecentActivity({ recentLogs }: RecentActivityProps) {
  const router = useRouter();
  const t = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {t('dashboard.recentActivity')}
        </Typography>
        {recentLogs.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push('/logs')}
          >
            {t('dashboard.activity.viewCompleteHistory')}
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
                    {t('dashboard.activity.moreRecords', { count: (recentLogs.length - 5).toString() })}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/logs');
                    }}
                  >
                    {t('dashboard.activity.viewAllHistory')}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {t('dashboard.activity.noRecords')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('dashboard.activity.getStarted')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/log?type=meal')}
                  startIcon={<Restaurant />}
                >
                  {t('dashboard.activity.logMeal')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/log?type=workout')}
                  startIcon={<FitnessCenter />}
                >
                  {t('dashboard.activity.logWorkout')}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}