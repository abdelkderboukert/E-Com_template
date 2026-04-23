import fs from "fs/promises";
import path from "path";

/**
 * Ecrit un fichier de manière atomique (Safe Write Pattern).
 * Évite qu'un plantage du serveur pendant l'écriture ne corrompe le fichier.
 */
export async function safeWrite(filepath: string, data: any): Promise<void> {
  const tmpFile = `${filepath}.tmp`;
  const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  // 1. Ecrire d'abord dans un fichier temporaire
  await fs.writeFile(tmpFile, content, "utf-8");

  // 2. Renommer (mv) le fichier temporaire pour écraser l'ancien fichier
  // Sur les systèmes de production comme Linux, c'est une opération atomique.
  await fs.rename(tmpFile, filepath);
}
