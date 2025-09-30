'use client';

import { List } from '@mui/material';
import LogListItem from './LogListItem';

interface LogEntry {
  PK: string;
  SK: string;
  type: 'MEAL' | 'WORKOUT';
  timestamp: string;
  notes: string;
  calories: number;
  parsedData: any;
}

interface LogsListProps {
  logs: LogEntry[];
  onDeleteLog: (logId: string, logType: string) => void;
}

export default function LogsList({ logs, onDeleteLog }: LogsListProps) {
  return (
    <List sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 2,
      p: { xs: 1, sm: 2 }
    }}>
      {logs.map((log, index) => {
        const isLast = index === logs.length - 1;
        
        return (
          <LogListItem
            key={log.SK}
            log={log}
            isLast={isLast}
            onDelete={onDeleteLog}
          />
        );
      })}
    </List>
  );
}