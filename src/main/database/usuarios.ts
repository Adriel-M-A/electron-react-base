import { db } from './client'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

interface Usuario {
  id: number
  nombre: string
  apellido: string
  password: string
  level: number
  created_at: string
}

export const UserQueries = {
  // Crear un nuevo usuario con contraseña cifrada
  async crearUsuario(nombre, apellido, password, level) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const stmt = db.prepare(`
      INSERT INTO usuarios (nombre, apellido, password, level)
      VALUES (?, ?, ?, ?)
    `)
    return stmt.run(nombre, apellido, hashedPassword, level)
  },

  // Validar credenciales
  async login(nombre: string, password: string) {
    const user = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(nombre) as
      | Usuario
      | undefined

    if (!user) return { success: false, message: 'Usuario no encontrado' }

    // Ahora TypeScript ya sabe que user.password existe
    const match = await bcrypt.compare(password, user.password)

    if (match) {
      // Extraemos la contraseña para no enviarla al frontend
      const { password: _, ...userWithoutPassword } = user
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, message: 'Contraseña incorrecta' }
  },

  // Obtener todos los usuarios
  obtenerUsuarios() {
    return db.prepare('SELECT id, nombre, apellido, level, created_at FROM usuarios').all() as Omit<
      Usuario,
      'password'
    >[]
  }
}
