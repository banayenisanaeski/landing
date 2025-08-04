import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    partName: '',
    partCode: '',
    condition: '',
    city: '',
    region: '',
    sellerId: '',
    priceMin: '',
    priceMax: '',
    brand: '',
    model: '',
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setMessage('');
    setResults([]);

    try {
      const res = await fetch('/api/searchParts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.data);
        if (data.data.length === 0) {
          setMessage('Sonuç bulunamadı.');
        }
      } else {
        setMessage(data.message || 'Hata oluştu.');
      }
    } catch (err) {
      setMessage('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Parça Ara</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="partName" placeholder="Parça Adı" onChange={handleChange} className="p-2 border rounded" />
        <input name="partCode" placeholder="Parça Kodu" onChange={handleChange} className="p-2 border rounded" />
        <select name="condition" onChange={handleChange} className="p-2 border rounded">
          <option value="">Durum Seç</option>
          <option value="Kullanılabilir">Kullanılabilir</option>
          <option value="Arızalı">Arızalı</option>
        </select>
        <input name="sellerId" placeholder="Satıcı ID" onChange={handleChange} className="p-2 border rounded" />
        <input name="city" placeholder="Şehir" onChange={handleChange} className="p-2 border rounded" />
        <input name="region" placeholder="Bölge" onChange={handleChange} className="p-2 border rounded" />
        <input name="brand" placeholder="Marka" onChange={handleChange} className="p-2 border rounded" />
        <input name="model" placeholder="Model" onChange={handleChange} className="p-2 border rounded" />
        <input name="priceMin" type="number" placeholder="Min Fiyat" onChange={handleChange} className="p-2 border rounded" />
        <input name="priceMax" type="number" placeholder="Max Fiyat" onChange={handleChange} className="p-2 border rounded" />
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={handleSearch} className="bg-green-600 text-white px-4 py-2 rounded">
          Ara
        </button>
        <Link href="/">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">
            Ana Sayfaya Dön
          </button>
        </Link>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {message && <p className="text-red-500">{message}</p>}

      <ul className="space-y-4">
        {results.map((item, idx) => (
          <li key={idx} className="border p-4 rounded bg-white shadow">
            <h2 className="text-xl font-semibold">{item.part_name}</h2>
            <p>Kod: {item.part_code}</p>
            <p>Marka: {item.brand}</p>
            <p>Model: {item.model}</p>
            <p>Durum: {item.condition}</p>
            <p>Fiyat: {item.price} TL</p>
            <p>Şehir: {item.city}</p>
            <p>Bölge: {item.region}</p>
            <p>Satıcı ID: {item.seller_id}</p>
            <p className="text-sm text-gray-600">{item.details}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}