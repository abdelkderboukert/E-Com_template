import fs from "fs/promises";
import path from "path";
import { safeWrite } from "./safeWrite";

export const ORDERS_PATH = path.join(process.cwd(), "lib", "orders.json");
export const ARCHIVED_ORDERS_PATH = path.join(process.cwd(), "lib", "orders_archive.json");

export async function readOrders(): Promise<any[]> {
  try {
    const data = await fs.readFile(ORDERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function readArchivedOrders(): Promise<any[]> {
  try {
    const data = await fs.readFile(ARCHIVED_ORDERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveOrders(orders: any[]): Promise<void> {
  let ordersToKeep = orders;
  let ordersToArchive: any[] = [];

  // Implement the 200 cap (FIFO - limit active orders file size)
  if (orders.length > 200) {
    ordersToKeep = orders.slice(0, 200);   // Keep newest 200
    ordersToArchive = orders.slice(200);   // Overflow goes to archive
  }

  // Atomically save active orders
  await safeWrite(ORDERS_PATH, ordersToKeep);

  // If there's overflow, push to the archive and atomically write it
  if (ordersToArchive.length > 0) {
    const archive = await readArchivedOrders();
    // Prepend oldest overflowing items to the archive (history)
    const newArchive = [...ordersToArchive, ...archive];
    await safeWrite(ARCHIVED_ORDERS_PATH, newArchive);
    console.log(`Archived ${ordersToArchive.length} orders safely.`);
  }
}
