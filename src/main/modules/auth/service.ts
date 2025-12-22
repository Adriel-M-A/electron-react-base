import { db } from '../../core/database'
import bcrypt from 'bcrypt'

// FUNCIÓN DE AYUDA (Helper)
// Convierte "juAN" -> "Juan"
const formatName = (text: string): string => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const AuthService = {
  // --- USUARIOS ---
  login: (usuario: string, password: string) => {
    const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario) as any
    if (!user) return { success: false, message: 'Usuario no encontrado' }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) return { success: false, message: 'Contraseña incorrecta' }

    // Actualizar last_login
    db.prepare('UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id)

    const { password: _, ...userData } = user
    return { success: true, user: userData }
  },

  getUsers: () => {
    return db
      .prepare('SELECT id, nombre, apellido, usuario, level, last_login, created_at FROM usuarios')
      .all()
  },

  createUser: (data: any) => {
    const { nombre, apellido, usuario, password, level } = data

    // APLICAMOS EL FORMATO AQUÍ
    const nombreFmt = formatName(nombre)
    const apellidoFmt = formatName(apellido)

    try {
      const hashedPassword = bcrypt.hashSync(password, 10)
      const info = db
        .prepare(
          `
        INSERT INTO usuarios (nombre, apellido, usuario, password, level)
        VALUES (?, ?, ?, ?, ?)
      `
        )
        // Usamos las variables formateadas (nombreFmt, apellidoFmt)
        .run(nombreFmt, apellidoFmt, usuario, hashedPassword, level)

      return { success: true, id: info.lastInsertRowid }
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'El usuario ya existe' }
      }
      return { success: false, message: 'Error al crear usuario' }
    }
  },

  updateUser: (id: number, data: any) => {
    const updates: string[] = []
    const params: any[] = []

    if (data.nombre) {
      updates.push('nombre = ?')
      // Aplicamos formato también al editar
      params.push(formatName(data.nombre))
    }
    if (data.apellido) {
      updates.push('apellido = ?')
      // Aplicamos formato también al editar
      params.push(formatName(data.apellido))
    }
    if (data.usuario) {
      updates.push('usuario = ?')
      params.push(data.usuario)
    }
    if (data.level) {
      updates.push('level = ?')
      params.push(data.level)
    }

    if (updates.length === 0) return { success: true }

    params.push(id)
    try {
      db.prepare(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`).run(...params)
      const updatedUser = db
        .prepare('SELECT id, nombre, apellido, usuario, level FROM usuarios WHERE id = ?')
        .get(id)
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, message: 'Error al actualizar' }
    }
  },

  deleteUser: (id: number) => {
    try {
      db.prepare('DELETE FROM usuarios WHERE id = ?').run(id)
      return { success: true }
    } catch (error) {
      return { success: false, message: 'Error al eliminar' }
    }
  },

  changePassword: (id: number, currentPass: string, newPass: string) => {
    const user = db.prepare('SELECT password FROM usuarios WHERE id = ?').get(id) as any
    if (!user) return { success: false, message: 'Usuario no encontrado' }

    if (!bcrypt.compareSync(currentPass, user.password)) {
      return { success: false, message: 'La contraseña actual es incorrecta' }
    }

    const hashedNew = bcrypt.hashSync(newPass, 10)
    db.prepare('UPDATE usuarios SET password = ? WHERE id = ?').run(hashedNew, id)
    return { success: true }
  },

  // --- ROLES ---
  getRoles: () => {
    const roles = db.prepare('SELECT * FROM roles ORDER BY id ASC').all() as any[]
    return roles.map((r) => ({ ...r, permissions: JSON.parse(r.permissions) }))
  },

  updateRole: (id: number, label: string, permissions: string[]) => {
    const permsString = JSON.stringify(permissions)
    db.prepare('UPDATE roles SET label = ?, permissions = ? WHERE id = ?').run(
      label,
      permsString,
      id
    )
    return { success: true }
  }
}
