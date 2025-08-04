// pages/api/searchParts.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const {
    partName,
    partCode,
    condition,
    city,
    region,
    sellerId,
    priceMin,
    priceMax,
    brand,
    model,
  } = req.body;

  try {
    let query = supabase.from('parts').select(`
      part_name,
      part_code,
      brand,
      model,
      condition,
      price,
      city,
      region,
      seller_id,
      details
    `);

    if (partName) query = query.ilike('part_name', `%${partName}%`);
    if (partCode) query = query.ilike('part_code', `%${partCode}%`);
    if (condition) query = query.eq('condition', condition);
    if (city) query = query.ilike('city', `%${city}%`);
    if (region) query = query.ilike('region', `%${region}%`);
    if (sellerId) query = query.ilike('seller_id', `%${sellerId}%`);
    if (brand) query = query.ilike('brand', `%${brand}%`);
    if (model) query = query.ilike('model', `%${model}%`);
    if (priceMin) query = query.gte('price', priceMin);
    if (priceMax) query = query.lte('price', priceMax);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(500).json({ message: 'Veri çekilirken hata oluştu', error });
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.error('API Hatası:', err);
    return res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
}