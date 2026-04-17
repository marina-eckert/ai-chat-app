import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full w-full flex bg-gray-100 text-gray-800 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
