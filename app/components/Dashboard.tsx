'use client'
import {
  Container,
  Box,
  Alert
} from '@mui/material'
import { AuthUser } from 'aws-amplify/auth'
import { UserProfile, LogEntry } from '@/amplify/data/resource'
import { useEffect, useState } from 'react'
import UserHeader from './dashboard/UserHeader'
import StatsOverview from './dashboard/StatsOverview'
import QuickActions from './dashboard/QuickActions'
import RecentActivity from './dashboard/RecentActivity'
import ProfileSetupCTA from './dashboard/ProfileSetupCTA'


interface DashboardProps {
  user: AuthUser
  userProfile: UserProfile | null
  recentLogs: LogEntry[]
  successMessage?: string
}

export default function Dashboard({ user, userProfile, recentLogs, successMessage }: DashboardProps) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Box component={'span'} sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <UserHeader user={user} />

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {decodeURIComponent(successMessage)}
          </Alert>
        )}

        {/* Stats Overview */}
        <StatsOverview userProfile={userProfile} recentLogs={recentLogs} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity recentLogs={recentLogs} />

        {/* Setup Profile CTA */}
        {!userProfile && <ProfileSetupCTA />}
      </Container>
    </Box>
  )
}