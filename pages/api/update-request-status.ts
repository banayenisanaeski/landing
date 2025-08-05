import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { request_id, status } = req.body;
  if (!request_id || !status) {
    return res.status(400).json({ message: 'Eksik bilgi' });
  }

  const { error } = await supabase
    .from('match_requests')
    .update({ status })
    .eq('id', request_id);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'Durum güncellenirken hata oluştu' });
  }

  return res.status(200).json({ message: 'Durum güncellendi' });
}