import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib', 'products.json');

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    let products = JSON.parse(data);

    const index = products.findIndex((p: any) => p.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = { ...products[index], ...body, id: parseInt(id) };
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));

    return NextResponse.json(products[index]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await fs.readFile(DB_PATH, 'utf-8');
    let products = JSON.parse(data);

    products = products.filter((p: any) => p.id !== parseInt(id));
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
