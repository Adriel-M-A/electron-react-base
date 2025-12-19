import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// Determinamos la ruta de la base de datos según el entorno
const dbPath = is.dev
  ? join(process.cwd(), 'database.db')
  : join(app.getPath('userData'), 'database.db')

export const db: Database.Database = new Database(dbPath)

// Configuración de rendimiento
db.pragma('journal_mode = WAL')
