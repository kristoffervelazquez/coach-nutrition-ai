"use client";

import {
  Box,
  Container,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Divider,
  Grid
} from '@mui/material';

export default function LogsSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justify: 'space-between', mb: 3 }}>
            <Box>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={300} height={20} />
            </Box>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>

        {/* Stats Cards Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="60%" height={16} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="40%" height={32} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Controls Section Skeleton */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
              {/* Search */}
              <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 1 }} />
              
              {/* Tabs */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3].map((tab) => (
                  <Skeleton key={tab} variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                ))}
              </Box>
              
              {/* Spacer */}
              <Box sx={{ flex: 1 }} />
              
              {/* Add button */}
              <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Logs List Skeleton */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                    {/* Icon */}
                    <Skeleton variant="circular" width={48} height={48} />
                    
                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="text" width={80} height={16} />
                      </Box>
                      <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="text" width={100} height={16} />
                        <Skeleton variant="text" width={80} height={16} />
                      </Box>
                    </Box>
                    
                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </Box>
                  
                  {item < 5 && <Divider />}
                </Box>
              ))}
            </Stack>

            {/* Pagination Skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Skeleton key={page} variant="circular" width={32} height={32} />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Empty State Skeleton (alternative) */}
        <Box sx={{ display: 'none' }}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 3 }} />
                <Skeleton variant="text" width="50%" height={28} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="70%" height={20} sx={{ mx: 'auto', mb: 3 }} />
                <Skeleton variant="rectangular" width={140} height={40} sx={{ mx: 'auto', borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}