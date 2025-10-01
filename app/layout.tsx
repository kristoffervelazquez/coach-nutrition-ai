import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplify from "@/utils/configureAmplify";
import MuiProvider from './components/layout/MuiProvider';
import Header from './components/layout/Header';
import { LanguageProvider } from './contexts/LanguageContext';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarchentu - Coach Nutrition AI",
  description: "AI-powered nutrition coaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ConfigureAmplify />
          <LanguageProvider>
            <MuiProvider>
              {children}
            </MuiProvider>
          </LanguageProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}