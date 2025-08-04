// pages/api/supabaseParts.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  console.log('Method: POST');
  console.log('POST isteği verisi:', req.body);

  const {
    partName,
    partCode,
    brand,     // ✅ Yeni alan
    model,     // ✅ Yeni alan
    condition,
    price,
    city,
    region,
    sellerId,
    details
  } = req.body;

  try {
    const { data, error } = await supabase.from('parts').insert([
      {
        part_name: partName,
        part_code: partCode,
        brand,         // ✅ Yeni alan
        model,         // ✅ Yeni alan
        condition,
        price,
        city,
        region,
        seller_id: sellerId,
        details,
      },
    ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ message: 'Parça eklenirken hata oluştu', error });
    }

    return res.status(200).json({ message: 'Parça başarıyla eklendi', data });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
}