import Providers from './providers';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='light'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
