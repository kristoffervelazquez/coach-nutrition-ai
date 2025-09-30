'use client';

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment
} from '@mui/material';
import { Person, Today, Male, Female, QuestionMark } from '@mui/icons-material';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    age: number;
    gender: string;
  };
  isEditing: boolean;
  onInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string) => (event: any) => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino', icon: <Male /> },
  { value: 'female', label: 'Femenino', icon: <Female /> },
  { value: 'not_specified', label: 'Prefiero no especificar', icon: <QuestionMark /> }
];

export default function PersonalInfoSection({ 
  formData, 
  isEditing, 
  onInputChange, 
  onSelectChange 
}: PersonalInfoSectionProps) {
  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}
      >
        <Person color="action" />
        Información Personal
      </Typography>
      
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Nombre completo"
          name="name"
          value={formData.name}
          onChange={onInputChange('name')}
          disabled={!isEditing}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          helperText="Tu nombre será usado para personalizar la experiencia"
        />

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
          gap: 3 
        }}>
          <TextField
            fullWidth
            label="Edad"
            name="age"
            type="number"
            value={formData.age}
            onChange={onInputChange('age')}
            disabled={!isEditing}
            required
            inputProps={{ min: 10, max: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Today color="action" />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">años</InputAdornment>
            }}
          />

          <FormControl fullWidth disabled={!isEditing}>
            <InputLabel>Género</InputLabel>
            <Select
              value={formData.gender}
              label="Género"
              onChange={onSelectChange('gender')}
              name="gender"
            >
              {GENDER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.icon}
                    <Typography>{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
}