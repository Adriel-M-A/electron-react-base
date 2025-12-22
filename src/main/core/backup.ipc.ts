import { ipcMain, app } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { db, closeDB, dbPath } from './database'

export function registerBackupHandlers() {
  const backupDir = join(app.getPath('userData'), 'backups')

  // Asegurar que la carpeta existe
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }

  // 1. LISTAR BACKUPS
  ipcMain.handle('backup:list', async () => {
    try {
      const files = fs
        .readdirSync(backupDir)
        .filter((f) => f.endsWith('.backup'))
        .map((file) => {
          const stat = fs.statSync(join(backupDir, file))
          return {
            name: file,
            size: stat.size,
            createdAt: stat.birthtime
          }
        })
        // Ordenar del más nuevo al más viejo
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return { success: true, backups: files, path: backupDir }
    } catch (error) {
      return { success: false, message: 'Error leyendo backups' }
    }
  })

  // 2. CREAR BACKUP (En Caliente)
  ipcMain.handle('backup:create', async (_, label) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const name = label ? `${label}_${timestamp}.backup` : `auto_${timestamp}.backup`
      const dest = join(backupDir, name)

      // Usamos la API nativa de SQLite para backup seguro sin detener la app
      await db.backup(dest)

      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Error creando respaldo' }
    }
  })

  // 3. RESTAURAR (Zona de Peligro)
  ipcMain.handle('backup:restore', async (_, filename) => {
    try {
      const source = join(backupDir, filename)

      console.log('Iniciando restauración...')

      // A. Cerrar conexión actual
      closeDB()

      // B. Reemplazar archivo (esperamos 1s para asegurar desbloqueo)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      fs.copyFileSync(source, dbPath)

      // C. Reiniciar Aplicación
      app.relaunch()
      app.exit(0)

      return { success: true }
    } catch (error) {
      console.error('Error restaurando:', error)
      return { success: false, message: 'Falló la restauración' }
    }
  })

  // 4. ELIMINAR
  ipcMain.handle('backup:delete', async (_, filename) => {
    try {
      fs.unlinkSync(join(backupDir, filename))
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  })
}
