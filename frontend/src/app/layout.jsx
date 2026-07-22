import '@/app/globals.css';

export const metadata = {
  title: 'KasBon Digital & Inventaris Warung',
  description: 'Aplikasi pembukuan hutang dan stok barang terintegrasi untuk UMKM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          * {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}