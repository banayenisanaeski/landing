import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-green-800 font-bold text-xl">
        <Link href="/">Banayenisanaeski</Link>
      </div>
      <div className="space-x-6">
        <Link href="/search" className="text-gray-700 hover:text-green-600">
          Parça Ara
        </Link>
        <Link href="/sell" className="text-gray-700 hover:text-green-600">
          Parça Sat
        </Link>
      </div>
    </nav>
  );
}