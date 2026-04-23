import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib', 'products.json');

export async function GET() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const products = JSON.parse(data);
    
    // Auto-increment ID
    const nextId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    const newProduct = { ...body, id: nextId };
    
    products.push(newProduct);
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}
