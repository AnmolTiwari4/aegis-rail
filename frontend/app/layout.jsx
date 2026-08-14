import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 m-0 p-0 text-white">
        {children}
      </body>
    </html>
  );
}