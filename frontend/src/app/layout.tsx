import '../styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50 flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Header</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main className="min-h-screen pt-20 p-4">{children}</main>

        <footer className="fixed bottom-0 right-0 w-full bg-blue-600 text-white shadow-md z-50 ">
          <h1 className="text-xl font-bold p-4">Footer</h1>
        </footer>
      </body>
    </html>
  );
}
