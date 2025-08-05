import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { seller_id } = req.body;
  if (!seller_id) {
    return res.status(400).json({ message: 'Eksik bilgi' });
  }

  const { data, error } = await supabase
    .from('match_requests')
    .select(`
      id,
      buyer_id,
      part_id,
      status,
      created_at,
      parts!inner(part_name, part_code, brand, model)
    `)
    .eq('status', 'pending')
    .eq('parts.user_id', seller_id);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'Veri çekilirken hata oluştu' });
  }

  return res.status(200).json({ data });
}