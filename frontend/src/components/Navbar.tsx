export default function Navbar() {
    return (
      <nav className="p-4 bg-gray-100 border-b">
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-blue-600 hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="text-blue-600 hover:underline">
              About
            </a>
          </li>
        </ul>
      </nav>
    );
  }
  