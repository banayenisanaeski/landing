import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser, supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    };

    fetchUser();

    // Oturum değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-200 p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-green-800 font-bold text-lg">
        BanaYeni SanaEski
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/search">
          <span className="hover:underline">Parça Ara</span>
        </Link>
        <Link href="/sell">
          <span className="hover:underline">Parça Sat</span>
        </Link>

        {userEmail ? (
          <>
            <Link href="/requests">
              <span className="hover:underline">Taleplerim</span>
            </Link>
            <Link href="/my-matches">
              <span className="hover:underline">Eşleşmelerim</span>
            </Link>
            <span className="text-gray-700">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">
              Giriş / Kayıt
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
