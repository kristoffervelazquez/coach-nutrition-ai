import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/app/contexts/LanguageContext';
import StatsCard from '@/app/components/ui/StatsCard';

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

describe('StatsCard', () => {
  it('should render stats card with value and label', () => {
    render(
      <TestWrapper>
        <StatsCard value={70} label="Peso (kg)" color="primary" />
      </TestWrapper>
    );
    
    expect(screen.getByText('70')).toBeTruthy();
    expect(screen.getByText('Peso (kg)')).toBeTruthy();
  });

  it('should render different values correctly', () => {
    render(
      <TestWrapper>
        <StatsCard value={25} label="Edad (años)" color="primary" />
      </TestWrapper>
    );
    
    expect(screen.getByText('25')).toBeTruthy();
    expect(screen.getByText('Edad (años)')).toBeTruthy();
  });
});