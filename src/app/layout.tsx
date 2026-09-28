import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'ClairCours — Apprendre plus vite', description: 'Transformez vos cours en résumés et quiz interactifs.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
