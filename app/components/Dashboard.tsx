'use client'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material'
import {
  Restaurant,
  FitnessCenter,
  Chat,
  Person,
  TrendingUp,
  CalendarToday,
  AccessTime
} from '@mui/icons-material'
import { AuthUser } from 'aws-amplify/auth'
import { UserProfile, LogEntry } from '@/amplify/data/resource'
import { useRouter } from 'next/navigation'

interface DashboardProps {
  user: AuthUser
  userProfile: UserProfile | null
  recentLogs: LogEntry[]
}

export default function Dashboard({ user, userProfile, recentLogs }: DashboardProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    // Esta función será implementada en el Header
    console.log('Sign out')
  }

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Sin fecha'
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLogIcon = (type?: string) => {
    return type === 'MEAL' ? <Restaurant color="primary" /> : <FitnessCenter color="secondary" />
  }

  const getLogLabel = (type?: string) => {
    return type === 'MEAL' ? 'Comida' : 'Entrenamiento'
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header simplificado */}
        <Box sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {user.signInDetails?.loginId?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Hola, {user.signInDetails?.loginId?.split('@')[0] || 'Usuario'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => router.push('/profile')}
            startIcon={<Person />}
          >
            Mi Perfil
          </Button>
        </Box>

        {/* Stats Overview */}
        {userProfile && (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4
          }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="primary.main">
                  {userProfile.weight}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Peso (kg)
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="primary.main">
                  {userProfile.height}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Altura (cm)
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="primary.main">
                  {userProfile.age}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Edad (años)
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="primary.main">
                  {recentLogs.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Registros
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Main Actions */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Acciones Rápidas
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              height: 140,
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={() => router.push('/log?type=meal')}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1
            }}>
              <Restaurant sx={{ fontSize: 40, color: 'primary.main', mx: 'auto' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Registrar Comida
              </Typography>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              cursor: 'pointer', 
              height: 140,
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={() => router.push('/log?type=workout')}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1
            }}>
              <FitnessCenter sx={{ fontSize: 40, color: 'secondary.main', mx: 'auto' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Entrenamientos
              </Typography>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              cursor: 'pointer', 
              height: 140,
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={() => router.push('/chat')}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1
            }}>
              <Chat sx={{ fontSize: 40, color: 'success.main', mx: 'auto' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Coach IA
              </Typography>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              cursor: 'pointer', 
              height: 140,
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={() => router.push('/analytics')}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1
            }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mx: 'auto' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                Analíticas
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Actividad Reciente
        </Typography>
        <Card>
          <CardContent>
            {recentLogs.length > 0 ? (
              <List disablePadding>
                {recentLogs.slice(0, 5).map((log, index) => (
                  <ListItem 
                    key={log.PK + log.SK} 
                    divider={index < recentLogs.length - 1}
                    sx={{ px: 0 }}
                  >
                    <ListItemIcon>
                      {getLogIcon(log.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {getLogLabel(log.type)}
                          </Typography>
                          {log.calories && (
                            <Chip 
                              label={`${log.calories} cal`} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {log.notes}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(log.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No hay registros aún
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comienza registrando tu primera actividad
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => router.push('/log?type=meal')}
                >
                  Registrar Comida
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Setup Profile CTA */}
        {!userProfile && (
          <Card sx={{ mt: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" gutterBottom color="primary.main">
                Completa tu perfil
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Añade tu información personal para obtener recomendaciones más precisas
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => router.push('/profile')}
                startIcon={<Person />}
              >
                Configurar Perfil
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  )
}