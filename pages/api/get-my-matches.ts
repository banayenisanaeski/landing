import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: 'Eksik bilgi' });
  }

  // Önce alıcı olduğu eşleşmeler
  const { data: buyerMatches, error: buyerError } = await supabase
    .from('matches')
    .select(`
      id,
      buyer_id,
      part_id,
      status,
      created_at,
      parts!inner(part_name, part_code, brand, model, user_id)
    `)
    .eq('buyer_id', user_id);

  if (buyerError) {
    console.error(buyerError);
    return res.status(500).json({ message: 'Veri çekilirken hata oluştu', error: buyerError });
  }

  // Sonra satıcı olduğu eşleşmeler
  const { data: sellerMatches, error: sellerError } = await supabase
    .from('matches')
    .select(`
      id,
      buyer_id,
      part_id,
      status,
      created_at,
      parts!inner(part_name, part_code, brand, model, user_id)
    `)
    .eq('parts.user_id', user_id);

  if (sellerError) {
    console.error(sellerError);
    return res.status(500).json({ message: 'Veri çekilirken hata oluştu', error: sellerError });
  }

  // İki listeyi birleştir
  const allMatches = [...(buyerMatches || []), ...(sellerMatches || [])];

  return res.status(200).json({ data: allMatches });
}