"use client";

import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Stack
} from '@mui/material';

export default function DashboardSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, py: 4 }}>
        {/* Header Section Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Box>
          
          {/* Profile Setup CTA Skeleton */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                  <Skeleton variant="text" width="50%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </Box>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Stats Overview Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="60%" height={16} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="40%" height={28} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Card sx={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" width="70%" height={20} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width="90%" height={16} sx={{ mx: 'auto' }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity Skeleton */}
        <Box>
          <Skeleton variant="text" width="35%" height={32} sx={{ mb: 2 }} />
          <Card>
            <CardContent>
              <Stack spacing={2}>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton variant="text" width="50%" height={16} />
                    </Box>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                ))}
              </Stack>
              
              {/* Empty state skeleton */}
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="80%" height={16} sx={{ mx: 'auto' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}