import { ipcMain } from 'electron'
import { UserQueries } from '../database/usuarios'

export function registerAuthHandlers(): void {
  // Login recibe ahora 'usuario' en lugar de 'nombre'
  ipcMain.handle('auth:login', async (_, { usuario, password }) => {
    return await UserQueries.login(usuario, password)
  })

  // Nuevo handler para actualizar
  ipcMain.handle('auth:update-user', async (_, { id, data }) => {
    return await UserQueries.actualizarUsuario(id, data)
  })

  // Cambiar contraseña
  ipcMain.handle('auth:change-password', async (_, { id, currentPassword, newPassword }) => {
    return await UserQueries.cambiarPassword(id, currentPassword, newPassword)
  })

  // Crear usuario
  ipcMain.handle('auth:create-user', async (_, userData) => {
    const { nombre, apellido, usuario, password, level } = userData
    try {
      return await UserQueries.crearUsuario(nombre, apellido, usuario, password, level)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      return { success: false, error: errorMessage }
    }
  })
}
