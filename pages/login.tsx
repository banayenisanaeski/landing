import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const upsertUserToTable = async (user: any) => {
    if (!user) return;

    const { error } = await supabase.from('users').upsert(
      {
        id: user.id, // UUID
        email: user.email,
        username: user.email ? user.email.split('@')[0] : 'kullanici', // 👈 username eklendi
      },
      { onConflict: 'id' } // aynı id varsa günceller
    );

    if (error) {
      console.error('Users tablosuna ekleme/güncelleme hatası:', error);
    } else {
      console.log('Users tablosu güncellendi:', user);
    }
  };

  const handleAuth = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Lütfen e-posta ve şifre girin.');
      return;
    }

    if (isLogin) {
      // Giriş
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage('Giriş hatası: ' + error.message);
      } else {
        setMessage('Giriş başarılı!');
        await upsertUserToTable(data.user); // 👈 Users tablosuna ekle
      }
    } else {
      // Kayıt
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage('Kayıt hatası: ' + error.message);
      } else {
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        await upsertUserToTable(data.user); // 👈 Users tablosuna ekle
        setIsLogin(true);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessage('Çıkış yapıldı.');
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h1>

      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        onClick={handleAuth}
        className="bg-green-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
      </button>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-600 underline mb-4"
      >
        {isLogin ? 'Hesabınız yok mu? Kayıt Olun' : 'Hesabınız var mı? Giriş Yapın'}
      </button>

      <button
        onClick={handleLogout}
        className="bg-gray-300 text-black px-4 py-2 rounded w-full"
      >
        Çıkış Yap
      </button>

      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

      <div className="mt-6">
        <Link href="/">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">
            Ana Sayfaya Dön
          </button>
        </Link>
      </div>
    </main>
  );
}