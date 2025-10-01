import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/app/contexts/LanguageContext';
import LanguageSelector from '@/app/components/ui/LanguageSelector';

// Mock del localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => 'es',
    setItem: jest.fn(),
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageSelector', () => {
  it('should render language icon button', () => {
    render(
      <TestWrapper>
        <LanguageSelector variant="icon" />
      </TestWrapper>
    );
    
    expect(screen.getByRole('button')).toBeTruthy();
    expect(screen.getByLabelText('Idioma')).toBeTruthy();
  });

  it('should render language text in text variant', () => {
    render(
      <TestWrapper>
        <LanguageSelector variant="text" />
      </TestWrapper>
    );
    
    expect(screen.getByText('🇲🇽')).toBeTruthy();
    expect(screen.getByText('Español')).toBeTruthy();
  });
});