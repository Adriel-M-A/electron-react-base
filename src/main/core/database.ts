import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

// Singleton de la base de datos
let dbInstance: Database.Database

export function getDB(): Database.Database {
  if (!dbInstance) {
    // CORRECCIÓN AQUÍ:
    // En Producción (Empaquetado): Se guarda en AppData (oculto y seguro)
    // En Desarrollo: Se guarda en la raíz del proyecto (junto al package.json)
    const dbPath = app.isPackaged
      ? join(app.getPath('userData'), 'app.db')
      : join(process.cwd(), 'app.db')

    console.log('📂 Base de datos ubicada en:', dbPath)

    // @ts-ignore
    dbInstance = new Database(dbPath)
    dbInstance.pragma('journal_mode = WAL')
  }
  return dbInstance
}

export const db: Database.Database = getDB()
