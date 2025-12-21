import { db } from './client'

export interface Role {
  id: number
  label: string
  permissions: string[] // En la BD es string, aquí lo transformamos a array
}

export const RoleQueries = {
  obtenerRoles: () => {
    const roles = db.prepare('SELECT * FROM roles ORDER BY id ASC').all() as any[]
    // Parseamos el JSON de permisos
    return roles.map((r) => ({
      ...r,
      permissions: JSON.parse(r.permissions)
    }))
  },

  actualizarRol: (id: number, label: string, permissions: string[]) => {
    const permsString = JSON.stringify(permissions)
    db.prepare('UPDATE roles SET label = ?, permissions = ? WHERE id = ?').run(
      label,
      permsString,
      id
    )
    return { success: true }
  }
}
