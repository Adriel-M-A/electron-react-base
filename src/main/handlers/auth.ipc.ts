import { ipcMain } from 'electron'
import { UserQueries } from '../database/usuarios'

export function registerAuthHandlers(): void {
  ipcMain.handle('auth:login', async (_, { nombre, password }) => {
    return await UserQueries.login(nombre, password)
  })

  ipcMain.handle('auth:create-user', async (_, userData) => {
    const { nombre, apellido, password, level } = userData
    try {
      return await UserQueries.crearUsuario(nombre, apellido, password, level)
    } catch (error: unknown) {
      // Validamos si el error tiene una propiedad 'message'
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      return { success: false, error: errorMessage }
    }
  })
}
