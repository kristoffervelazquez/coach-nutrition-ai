"use client";

import { useState } from 'react';
import {
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { deleteLogAction } from '../../logs/actions';
import { useRouter } from 'next/navigation';
import LogsHeader from './LogsHeader';
import LogsStats from './LogsStats';
import LogsControls from './LogsControls';
import EmptyLogsState from './EmptyLogsState';
import LogsList from './LogsList';
import DeleteDialog from './DeleteDialog';

interface LogEntry {
  PK: string;
  SK: string;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string;
  notes: string;
  calories: number;
  userId?: string;
}

interface Stats {
  total: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
    calorieBalance: number;
  };
  thisWeek: {
    meals: number;
    workouts: number;
    caloriesConsumed: number;
    caloriesBurned: number;
  };
}

interface LogsViewProps {
  initialLogs: LogEntry[];
  stats: Stats;
  success?: string;
  error?: string;
}



export default function LogsView({ initialLogs, stats, success, error }: LogsViewProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; logId: string; logType: string }>({
    open: false,
    logId: '',
    logType: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Parsear datos estructurados de los logs
  const parsedLogs = initialLogs.map(log => {
    try {
      const parsedNotes = JSON.parse(log.notes);
      return {
        ...log,
        parsedData: parsedNotes
      };
    } catch {
      // Si no es JSON válido, mantener las notas como están
      return {
        ...log,
        parsedData: { userNotes: log.notes }
      };
    }
  });

  // Filtrar logs según la pestaña activa
  const filteredLogs = parsedLogs.filter(log => {
    const matchesTab = currentTab === 0 || 
      (currentTab === 1 && log.type === 'MEAL') || 
      (currentTab === 2 && log.type === 'WORKOUT');
    
    const matchesSearch = !searchTerm || 
      log.parsedData.userNotes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.foods?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.workoutType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parsedData.mealType?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleDeleteClick = (logId: string, logType: string) => {
    const id = logId.replace('LOG#', '');
    setDeleteDialog({ open: true, logId: id, logType });
  };

  const handleDeleteConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append('logId', deleteDialog.logId);
      await deleteLogAction(formData);
      setSnackbar({ open: true, message: 'Registro eliminado con éxito', severity: 'success' });
      router.refresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
    }
    setDeleteDialog({ open: false, logId: '', logType: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <LogsHeader />

      {/* Estadísticas */}
      <LogsStats stats={stats} />

      {/* Alertas de success/error */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controles */}
      <LogsControls 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Lista de registros */}
      {filteredLogs.length === 0 ? (
        <EmptyLogsState searchTerm={searchTerm} />
      ) : (
        <LogsList 
          logs={filteredLogs}
          onDeleteLog={handleDeleteClick}
        />
      )}

      {/* Dialog de confirmación de eliminación */}
      <DeleteDialog 
        open={deleteDialog.open}
        logType={deleteDialog.logType}
        onClose={() => setDeleteDialog({ open: false, logId: '', logType: '' })}
        onConfirm={handleDeleteConfirm}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}