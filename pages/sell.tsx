// pages/sell.tsx 
import { useState } from 'react';
import Link from 'next/link';

export default function SellPage() {
  const [formData, setFormData] = useState({
    partName: '',
    partCode: '',
    condition: '',
    price: '',
    city: '',
    region: '',
    sellerId: '',
    details: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Reset message

    try {
      const res = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Parça başarıyla eklendi!');
        setFormData({
          partName: '',
          partCode: '',
          condition: '',
          price: '',
          city: '',
          region: '',
          sellerId: '',
          details: '',
        });
      } else {
        setMessage(`Hata: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Sunucu hatası oluştu.');
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Parça Sat</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="partName" placeholder="Parça Adı" onChange={handleChange} value={formData.partName} className="w-full p-2 border rounded" />
        <input name="partCode" placeholder="Parça Kodu" onChange={handleChange} value={formData.partCode} className="w-full p-2 border rounded" />
        <input name="condition" placeholder="Durum" onChange={handleChange} value={formData.condition} className="w-full p-2 border rounded" />
        <input name="price" placeholder="Fiyat" type="number" onChange={handleChange} value={formData.price} className="w-full p-2 border rounded" />
        <input name="city" placeholder="Şehir" onChange={handleChange} value={formData.city} className="w-full p-2 border rounded" />
        <input name="region" placeholder="Bölge" onChange={handleChange} value={formData.region} className="w-full p-2 border rounded" />
        <input name="sellerId" placeholder="Satıcı ID" onChange={handleChange} value={formData.sellerId} className="w-full p-2 border rounded" />
        <textarea name="details" placeholder="Detaylar" onChange={handleChange} value={formData.details} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Gönder</button>
      </form>

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