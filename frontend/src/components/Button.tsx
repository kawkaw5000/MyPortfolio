'use client';
import '../styles/globals.css'
import { useRouter } from 'next/navigation';

export default function Button({
  text,
  onClick,
  redirectTo,
}: {
  text: string;
  onClick?: () => void;
  redirectTo?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleClick} 
    >
      {text}
    </button>
  );
}
