// pages/api/match.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { buyer_id, part_id, status } = req.body;

  // Eksik veri kontrolü
  if (!buyer_id || !part_id || !status) {
    return res.status(400).json({ message: 'Eksik bilgi gönderildi.' });
  }

  try {
    const { error } = await supabase.from('matches').insert([
      {
        buyer_id,
        part_id: Number(part_id), // 👈 bigint'e dönüştürüyoruz
        status,
      },
    ]);

    if (error) {
      // Unique constraint ihlali (aynı kullanıcı aynı parçaya tekrar oy verirse)
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Bu ürün için ilgileniyoruma tıklamıştınız' });
      }

      console.error('Supabase Match Insert Error:', error);
      return res.status(500).json({ message: 'Eşleşme eklenirken hata oluştu', error });
    }

    return res.status(200).json({ message: 'Eşleşme kaydedildi' });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
}