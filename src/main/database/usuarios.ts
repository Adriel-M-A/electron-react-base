import { db } from './client'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

// Helper para capitalizar (ej: "juan" -> "Juan")
const capitalize = (text: string) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Interfaz actualizada
interface Usuario {
  id: number
  nombre: string
  apellido: string
  usuario: string
  password: string
  level: number
  last_login: string
  created_at: string
}

export const UserQueries = {
  async login(usuarioInput: string, passwordInput: string) {
    const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuarioInput) as
      | Usuario
      | undefined

    if (!user) return { success: false, message: 'Usuario no encontrado' }

    const match = await bcrypt.compare(passwordInput, user.password)

    if (match) {
      db.prepare('UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id)

      const updatedUser = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(user.id) as Usuario
      const { password: _, ...userWithoutPassword } = updatedUser

      return { success: true, user: userWithoutPassword }
    }

    return { success: false, message: 'Contraseña incorrecta' }
  },

  async actualizarUsuario(id: number, data: Partial<Usuario>) {
    const { nombre, apellido, usuario, level, password } = data

    // APLICAMOS CAPITALIZACIÓN AQUÍ
    const nombreCap = nombre ? capitalize(nombre) : undefined
    const apellidoCap = apellido ? capitalize(apellido) : undefined

    try {
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        db.prepare(
          `
          UPDATE usuarios 
          SET nombre = COALESCE(?, nombre),
              apellido = COALESCE(?, apellido),
              usuario = COALESCE(?, usuario),
              level = COALESCE(?, level),
              password = ?
          WHERE id = ?
        `
        ).run(nombreCap, apellidoCap, usuario, level, hashedPassword, id)
      } else {
        db.prepare(
          `
          UPDATE usuarios 
          SET nombre = COALESCE(?, nombre),
              apellido = COALESCE(?, apellido),
              usuario = COALESCE(?, usuario),
              level = COALESCE(?, level)
          WHERE id = ?
        `
        ).run(nombreCap, apellidoCap, usuario, level, id)
      }

      const updatedUser = db
        .prepare(
          'SELECT id, nombre, apellido, usuario, level, last_login, created_at FROM usuarios WHERE id = ?'
        )
        .get(id)
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, message: 'El nombre de usuario ya está en uso' }
    }
  },

  async crearUsuario(nombre, apellido, usuario, password, level) {
    // APLICAMOS CAPITALIZACIÓN AQUÍ
    const nombreCap = capitalize(nombre)
    const apellidoCap = capitalize(apellido)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try {
      const stmt = db.prepare(`
        INSERT INTO usuarios (nombre, apellido, usuario, password, level)
        VALUES (?, ?, ?, ?, ?)
      `)

      const info = stmt.run(nombreCap, apellidoCap, usuario, hashedPassword, level)
      return { success: true, id: info.lastInsertRowid }
    } catch (error: any) {
      console.error('Error al crear usuario:', error)
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'El nombre de usuario ya existe' }
      }
      return { success: false, message: 'Error en la base de datos' }
    }
  },

  async eliminarUsuario(id: number) {
    try {
      // Opcional: Evitar borrar al último admin, pero por ahora simple:
      // Evitar borrar al usuario ID 1 (Admin por defecto) si quieres seguridad extra
      if (id === 1) {
        return { success: false, message: 'No se puede eliminar al Administrador Principal' }
      }

      const info = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id)

      if (info.changes > 0) {
        return { success: true }
      }
      return { success: false, message: 'Usuario no encontrado' }
    } catch (error) {
      return { success: false, message: 'Error al eliminar usuario' }
    }
  },

  async cambiarPassword(id: number, currentPassword, newPassword) {
    const user = db.prepare('SELECT password FROM usuarios WHERE id = ?').get(id) as Usuario

    // 1. Verificar contraseña actual
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return { success: false, message: 'La contraseña actual es incorrecta' }

    // 2. Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    // 3. Actualizar
    db.prepare('UPDATE usuarios SET password = ? WHERE id = ?').run(hashedNewPassword, id)
    return { success: true }
  },

  obtenerUsuarios() {
    return db
      .prepare(
        `
      SELECT id, nombre, apellido, usuario, level, last_login, created_at 
      FROM usuarios 
      ORDER BY created_at DESC
    `
      )
      .all() as Omit<Usuario, 'password'>[]
  }
}
