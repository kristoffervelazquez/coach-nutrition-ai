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
  Divider,
  Alert
} from '@mui/material'
import {
  Restaurant,
  FitnessCenter,
  Chat,
  Person,
  TrendingUp,
  CalendarToday,
  AccessTime,
  Logout
} from '@mui/icons-material'
import { AuthUser, signOut } from 'aws-amplify/auth'
import { UserProfile, LogEntry } from '@/amplify/data/resource'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


interface DashboardProps {
  user: AuthUser
  userProfile: UserProfile | null
  recentLogs: LogEntry[]
  successMessage?: string
}

interface ParsedLogData {
  userNotes: string;
  mealType?: string;
  foods?: string;
  workoutType?: string;
  duration?: number;
  intensity?: string;
}

export default function Dashboard({ user, userProfile, recentLogs, successMessage }: DashboardProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/signup')
    } catch (error) {
      console.error('Error signing out:', error)
    }
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
    <Box component={'span'} sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header simplificado */}
        <Box component={'span'} sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box component={'span'} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {user.signInDetails?.loginId?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box component={'span'}>
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
          <Box component={'span'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* <ThemeToggle /> --- IGNORE --- */}
            <Button
              variant="outlined"
              onClick={() => router.push('/profile')}
              startIcon={<Person />}
              sx={{ mr: 1 }}
            >
              Mi Perfil
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleSignOut}
              startIcon={<Logout />}
              size="small"
            >
              Salir
            </Button>
          </Box>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {decodeURIComponent(successMessage)}
          </Alert>
        )}

        {/* Stats Overview */}
        {userProfile && (
          <Box component={'span'} sx={{
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
        <Box component={'span'} sx={{
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
        <Box component={'span'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                  {recentLogs.slice(0, 5).map((log, index) => {
                    // Parsear datos estructurados del log
                    let parsedData: ParsedLogData = { userNotes: log.notes || '' };
                    try {
                      parsedData = JSON.parse(log.notes || '{}') as ParsedLogData;
                    } catch {
                      // Si no es JSON válido, mantener las notas como están
                    }

                    return (
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
                            <Box component={'span'}  sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography component="span" variant="subtitle2">
                                {getLogLabel(log.type)}
                              </Typography>
                              {parsedData.mealType && (
                                <Chip
                                  label={parsedData.mealType}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                              {parsedData.workoutType && (
                                <Chip
                                  label={parsedData.workoutType}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                              {log.calories && (
                                <Chip
                                  label={`${log.calories} kcal`}
                                  size="small"
                                  variant="filled"
                                  sx={{ 
                                    bgcolor: log.type === 'MEAL' ? 'success.main' : 'warning.main',
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box component={'span'}>
                              {parsedData.foods && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  <strong>Alimentos:</strong> {parsedData.foods}
                                </Typography>
                              )}
                              {parsedData.duration && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  <strong>Duración:</strong> {parsedData.duration} min • <strong>Intensidad:</strong> {parsedData.intensity}
                                </Typography>
                              )}
                              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {parsedData.userNotes || 'Sin notas adicionales'}
                              </Typography>
                              <Typography component="span" variant="caption" color="text.secondary">
                                {formatDate(log.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
                {recentLogs.length > 5 && (
                  <Box component={'span'} sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
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
              <Box component={'span'} sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No hay registros aún
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comienza registrando tu primera comida o entrenamiento
                </Typography>
                <Box component={'span'} sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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