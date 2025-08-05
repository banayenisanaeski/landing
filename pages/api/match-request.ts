// pages/api/match-request.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { buyer_id, part_id } = req.body;

  if (!buyer_id || !part_id) {
    return res.status(400).json({ message: 'Eksik bilgi gönderildi.' });
  }

  try {
    const { error } = await supabase.from('match_requests').insert([
      {
        buyer_id,
        part_id: Number(part_id),
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Bu parça için zaten talep gönderdiniz.' });
      }
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ message: 'Talep eklenirken hata oluştu', error });
    }

    return res.status(200).json({ message: 'Talebiniz gönderildi' });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
}