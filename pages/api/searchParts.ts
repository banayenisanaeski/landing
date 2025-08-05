import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // GET isteği gelirse tüm parçaları döndür
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('parts').select(`
      id,
      part_name,
      part_code,
      brand,
      model,
      condition,
      price,
      city,
      region,
      user_id,
      details
    `);

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(500).json({ message: 'Veri alınırken hata oluştu', error });
    }

    return res.status(200).json({ data });
  }

  // POST isteği filtreli arama
  const {
    partName,
    partCode,
    condition,
    city,
    region,
    priceMin,
    priceMax,
    brand,
    model,
  } = req.body;

  try {
    let query = supabase.from('parts').select(`
      id,
      part_name,
      part_code,
      brand,
      model,
      condition,
      price,
      city,
      region,
      user_id,
      details
    `);

    if (partName) query = query.ilike('part_name', `%${partName}%`);
    if (partCode) query = query.ilike('part_code', `%${partCode}%`);
    if (condition) query = query.eq('condition', condition);
    if (city) query = query.ilike('city', `%${city}%`);
    if (region) query = query.ilike('region', `%${region}%`);
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