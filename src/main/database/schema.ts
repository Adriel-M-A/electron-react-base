// src/main/database/schema.ts
import { db } from './client'
import bcrypt from 'bcrypt'

export async function initDB(): Promise<void> {
  // 1. Crear tabla
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      password TEXT NOT NULL,
      level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 2. Crear admin por defecto si no hay usuarios
  const row = db.prepare('SELECT count(*) as count FROM usuarios').get() as any
  if (row.count === 0) {
    const pass = await bcrypt.hash('admin123', 10)
    db.prepare('INSERT INTO usuarios (nombre, apellido, password, level) VALUES (?, ?, ?, ?)').run(
      'Admin',
      'Principal',
      pass,
      1
    )
    console.log('Usuario admin creado: Admin / admin123')
  }
}
