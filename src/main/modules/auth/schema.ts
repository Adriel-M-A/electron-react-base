import { Database } from 'better-sqlite3'
import bcrypt from 'bcryptjs'

export function initAuthSchema(db: Database): void {
  // 1. Tabla Usuarios
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

  // 2. Tabla Roles
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL,
      permissions TEXT DEFAULT '[]'
    )
  `)

  // Inicializar Roles por defecto
  const rolesCount = db.prepare('SELECT count(*) as count FROM roles').get() as any
  if (rolesCount.count === 0) {
    const adminPerms = JSON.stringify(['*'])
    db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
      1,
      'Administrador',
      adminPerms
    )

    const staffPerms = JSON.stringify(['ver_dashboard', 'realizar_ventas'])
    db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
      2,
      'Staff',
      staffPerms
    )

    const auditorPerms = JSON.stringify(['ver_dashboard', 'ver_reportes'])
    db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
      3,
      'Auditor',
      auditorPerms
    )
  }

  // Crear Admin por defecto
  const userCount = db.prepare('SELECT count(*) as count FROM usuarios').get() as any
  if (userCount.count === 0) {
    const pass = bcrypt.hashSync('admin123', 10) // Usamos hashSync para inicialización simple
    db.prepare(
      `
      INSERT INTO usuarios (nombre, apellido, usuario, password, level) 
      VALUES (?, ?, ?, ?, ?)
    `
    ).run('Admin', 'Principal', 'administrador', pass, 1)
  }
}
