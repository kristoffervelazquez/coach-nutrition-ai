"use client";

import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { 
  Language as LanguageIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useLanguageInfo, useTranslation } from '@/app/hooks/useTranslation';

interface LanguageSelectorProps {
  variant?: 'icon' | 'text' | 'full';
  size?: 'small' | 'medium' | 'large';
}

export default function LanguageSelector({ 
  variant = 'icon', 
  size = 'medium' 
}: LanguageSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguageInfo();
  const t = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode as any);
    handleClose();
  };

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={t('language.label')}>
          <IconButton 
            onClick={handleClick}
            size={size}
            sx={{ 
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {t('language.label')}
            </Typography>
          </Box>
          <Divider />
          
          {availableLanguages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={currentLanguage === language.code}
              sx={{ minWidth: 150 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Typography variant="body1" sx={{ fontSize: '1.2em' }}>
                  {language.flag}
                </Typography>
              </ListItemIcon>
              <ListItemText 
                primary={language.name}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: currentLanguage === language.code ? 600 : 400
                }}
              />
              {currentLanguage === language.code && (
                <CheckIcon sx={{ ml: 1, color: 'primary.main', fontSize: 18 }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        <Box
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            py: 1,
            px: 2,
            borderRadius: 1,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '1.2em' }}>
            {currentLang?.flag}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currentLang?.name}
          </Typography>
        </Box>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {availableLanguages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={currentLanguage === language.code}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Typography variant="body1" sx={{ fontSize: '1.2em' }}>
                  {language.flag}
                </Typography>
              </ListItemIcon>
              <ListItemText primary={language.name} />
              {currentLanguage === language.code && (
                <CheckIcon sx={{ ml: 1, color: 'primary.main', fontSize: 18 }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // variant === 'full'
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {t('language.label')}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {availableLanguages.map((language) => (
          <Box
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: currentLanguage === language.code ? 'primary.main' : 'divider',
              bgcolor: currentLanguage === language.code ? 'primary.50' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { 
                borderColor: 'primary.main',
                bgcolor: currentLanguage === language.code ? 'primary.50' : 'primary.25'
              }
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '1.5em' }}>
              {language.flag}
            </Typography>
            <Typography 
              variant="body1" 
              fontWeight={currentLanguage === language.code ? 600 : 400}
            >
              {language.name}
            </Typography>
            {currentLanguage === language.code && (
              <CheckIcon sx={{ ml: 'auto', color: 'primary.main' }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}