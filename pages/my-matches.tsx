import { useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/supabaseClient';

export default function MyMatchesPage() {
  const [approvedMatches, setApprovedMatches] = useState<any[]>([]);
  const [rejectedMatches, setRejectedMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const res = await fetch('/api/get-my-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();
      if (res.ok && data.data) {
        // ✅ Approved ve Interested olanlar onaylanmış sayılır
        setApprovedMatches(
          data.data.filter(
            (m: any) => m.status === 'approved' || m.status === 'interested'
          )
        );
        // ❌ Rejected olanlar reddedilmiş sayılır
        setRejectedMatches(
          data.data.filter((m: any) => m.status === 'rejected')
        );
      }
    };

    fetchMatches();
  }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Benim Eşleşmelerim</h1>

      <div className="mb-6">
        <p><strong>Onaylanan Eşleşme Sayısı:</strong> {approvedMatches.length}</p>
        <p><strong>Reddedilen Eşleşme Sayısı:</strong> {rejectedMatches.length}</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">✅ Onaylanan Eşleşmeler</h2>
        {approvedMatches.length === 0 ? (
          <p>Henüz onaylanan eşleşme yok.</p>
        ) : (
          <ul className="space-y-4">
            {approvedMatches.map((match) => (
              <li key={match.id} className="border p-4 rounded bg-white shadow">
                <p><strong>Parça:</strong> {match.parts.part_name} ({match.parts.part_code})</p>
                <p><strong>Marka/Model:</strong> {match.parts.brand} / {match.parts.model}</p>
                <p><strong>Durum:</strong> {match.status}</p>
                <p><strong>Oluşturulma:</strong> {new Date(match.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">❌ Reddedilen Eşleşmeler</h2>
        {rejectedMatches.length === 0 ? (
          <p>Henüz reddedilen eşleşme yok.</p>
        ) : (
          <ul className="space-y-4">
            {rejectedMatches.map((match) => (
              <li key={match.id} className="border p-4 rounded bg-white shadow">
                <p><strong>Parça:</strong> {match.parts.part_name} ({match.parts.part_code})</p>
                <p><strong>Marka/Model:</strong> {match.parts.brand} / {match.parts.model}</p>
                <p><strong>Durum:</strong> {match.status}</p>
                <p><strong>Oluşturulma:</strong> {new Date(match.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}