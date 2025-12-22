import { initAuthSchema } from './schema'
import { registerAuthHandlers } from './handlers'
import { Database } from 'better-sqlite3'

export const AuthModule = {
  name: 'auth',
  init: (db: Database) => initAuthSchema(db),
  register: () => registerAuthHandlers()
}
