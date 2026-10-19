import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/categories -> Ambil semua kategori
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, name AS nama_kategori, created_at FROM categories ORDER BY name ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/categories -> Tambah kategori baru
export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name || body.nama_kategori;
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Field "name" atau "nama_kategori" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim(), nama_kategori: name.trim() },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
