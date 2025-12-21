import { db } from './client'
import bcrypt from 'bcrypt'
import { FLAGS } from '../config'

export async function initDB(): Promise<void> {
  if (FLAGS.ENABLE_AUTH) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        usuario TEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL,
        level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const row = db.prepare('SELECT count(*) as count FROM usuarios').get() as any
    if (row.count === 0) {
      const pass = await bcrypt.hash('admin123', 10)
      db.prepare(
        `
        INSERT INTO usuarios (nombre, apellido, usuario, password, level) 
        VALUES (?, ?, ?, ?, ?)
      `
      ).run('Admin', 'Principal', 'administrador', pass, 1)
      console.log('Usuario admin creado: administrador / admin123')
    }
  }
}
