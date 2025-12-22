import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

let dbInstance: Database.Database

export function getDB(): Database.Database {
  if (!dbInstance) {
    const dbPath = app.isPackaged
      ? join(app.getPath('userData'), 'app.db')
      : join(__dirname, '../../resources/app.db')

    // @ts-ignore: A veces TS se queja del constructor, esto lo silencia si es necesario
    dbInstance = new Database(dbPath)
    dbInstance.pragma('journal_mode = WAL')
  }
  return dbInstance
}

export const db: Database.Database = getDB()
