import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplify from "@/utils/configureAmplify";
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
        <ConfigureAmplify />
        <AppRouterCacheProvider>

          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}