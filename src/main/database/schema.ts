import { db } from './client'
import bcrypt from 'bcryptjs'
import { FLAGS } from '../config'

export async function initDB(): Promise<void> {
  if (FLAGS.ENABLE_AUTH) {
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

    // 2. NUEVA TABLA: ROLES
    db.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY,
        label TEXT NOT NULL,
        permissions TEXT DEFAULT '[]'
      )
    `)

    // Inicializar Roles si la tabla está vacía
    const rolesCount = db.prepare('SELECT count(*) as count FROM roles').get() as any
    if (rolesCount.count === 0) {
      // Nivel 1: Admin (Tiene permiso comodín '*')
      const adminPerms = JSON.stringify(['*'])
      db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
        1,
        'Administrador',
        adminPerms
      )

      // Nivel 2: Staff (Ejemplo de permisos básicos)
      const staffPerms = JSON.stringify(['ver_dashboard', 'realizar_ventas'])
      db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
        2,
        'Staff',
        staffPerms
      )

      // Nivel 3: Auditor (Solo lectura)
      const auditorPerms = JSON.stringify(['ver_dashboard', 'ver_reportes'])
      db.prepare('INSERT INTO roles (id, label, permissions) VALUES (?, ?, ?)').run(
        3,
        'Auditor',
        auditorPerms
      )

      console.log('Roles por defecto inicializados.')
    }

    // Crear usuario administrador por defecto si no existe
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
