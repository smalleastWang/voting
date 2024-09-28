import path from 'node:path'
import mysql from 'mysql2/promise'

export function getPath(filePath: string) {
  return path.resolve(process.cwd(), filePath)
}


export async function DBVertor() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'vertor',
  });
};