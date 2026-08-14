import './globals.css';

export const metadata = {
  title: 'Aegis-Rail | Infrastructure & Transit Simulation',
  description: 'Enterprise-grade rail transit simulation, bottleneck prediction, and rerouting control center.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 antialiased selection:bg-cyan-500 selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}