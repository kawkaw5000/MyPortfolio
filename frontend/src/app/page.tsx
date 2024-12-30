'use client';
import '../styles/globals.css'
import Button from '../components/Button';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to My Website</h2>
      <p>This is the homepage content.</p>
      <Button text="Go to About" redirectTo="/about" />
      <Button text="Go to Contact" redirectTo="/contact" />
    </div>
  );
}
