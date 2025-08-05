import { useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/supabaseClient';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const res = await fetch('/api/get-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setRequests(data.data);
      }
    };

    fetchRequests();
  }, []);

  const updateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/update-request-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId, status }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      alert(`Talep ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gelen Talepler</h1>
      {requests.length === 0 ? (
        <p>Bekleyen talep bulunmamaktadır.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Parça:</strong> {req.parts.part_name} ({req.parts.part_code})</p>
              <p><strong>Marka/Model:</strong> {req.parts.brand} / {req.parts.model}</p>
              <p><strong>Alıcı ID:</strong> {req.buyer_id}</p>
              <p><strong>Durum:</strong> {req.status}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateStatus(req.id, 'approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Onayla
                </button>
                <button
                  onClick={() => updateStatus(req.id, 'rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reddet
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}