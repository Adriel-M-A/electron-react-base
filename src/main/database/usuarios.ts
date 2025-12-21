import { db } from './client'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

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
    const { nombre, apellido, usuario } = data
    try {
      db.prepare(
        `
        UPDATE usuarios 
        SET nombre = COALESCE(?, nombre),
            apellido = COALESCE(?, apellido),
            usuario = COALESCE(?, usuario)
        WHERE id = ?
      `
      ).run(nombre, apellido, usuario, id)

      const updatedUser = db
        .prepare(
          'SELECT id, nombre, apellido, usuario, level, last_login, created_at FROM usuarios WHERE id = ?'
        )
        .get(id)
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, message: 'Error al actualizar (quizás el usuario ya existe)' }
    }
  },

  async crearUsuario(nombre, apellido, usuario, password, level) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const stmt = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, usuario, password, level)
      VALUES (?, ?, ?, ?, ?)
    `)
    return stmt.run(nombre, apellido, usuario, hashedPassword, level)
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
