import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { partName, partCode, condition, price, city, region, sellerId, details } = req.body;

  if (!partName || !partCode || !condition || !price || !city || !region || !sellerId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input('PartName', partName)
      .input('PartCode', partCode)
      .input('Condition', condition)
      .input('Price', price)
      .input('City', city)
      .input('Region', region)
      .input('SellerID', sellerId)
      .input('Details', details || '')
      .query(`
        INSERT INTO Parts (PartName, PartCode, Condition, Price, City, Region, SellerID, Details)
        VALUES (@PartName, @PartCode, @Condition, @Price, @City, @Region, @SellerID, @Details)
      `);

    return res.status(200).json({ message: 'Part added successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
}