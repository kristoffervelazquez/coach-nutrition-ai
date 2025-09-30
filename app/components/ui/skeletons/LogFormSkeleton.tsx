"use client";

import { 
  Box, 
  Container, 
  Paper, 
  Skeleton, 
  Stack, 
  Card, 
  CardContent 
} from '@mui/material';

export default function LogFormSkeleton() {
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header Skeleton */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Form Skeleton */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stack spacing={3}>
            {/* Type selector skeleton */}
            <Box>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Notes field skeleton */}
            <Box>
              <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Calories field skeleton */}
            <Box>
              <Skeleton variant="text" width="35%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Submit button skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
              <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 2 }} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}