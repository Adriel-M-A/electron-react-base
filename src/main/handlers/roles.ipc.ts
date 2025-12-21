import { ipcMain } from 'electron'
import { RoleQueries } from '../database/roles'

export function registerRoleHandlers(): void {
  ipcMain.handle('roles:get', async () => {
    try {
      return { success: true, roles: RoleQueries.obtenerRoles() }
    } catch (error) {
      return { success: false, roles: [] }
    }
  })

  ipcMain.handle('roles:update', async (_, { id, label, permissions }) => {
    try {
      return RoleQueries.actualizarRol(id, label, permissions)
    } catch (error) {
      return { success: false, message: 'Error al actualizar rol' }
    }
  })
}
