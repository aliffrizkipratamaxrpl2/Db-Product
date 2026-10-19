import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products/:id -> get one product with category relation
export async function GET(request, { params }) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.category_id, 
        c.name AS category_name, 
        p.created_at 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?`,
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/products/:id -> update a product with category
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { name, description, price, category_id } = body;

    if (!name || price === undefined || price === '') {
      return NextResponse.json(
        { error: 'Field "name" dan "price" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const parsedCategoryId = category_id ? Number(category_id) : null;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
      [name, description || null, price, parsedCategoryId, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      id: Number(params.id),
      name,
      description,
      price,
      category_id: parsedCategoryId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/products/:id -> delete a product
export async function DELETE(request, { params }) {
  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
