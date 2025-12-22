import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// IMPORTS
import { getDB } from './core/database'
import { registerWindowHandlers } from './core/window.ipc'
import { registerBackupHandlers } from './core/backup.ipc'
import { runMigrations } from './core/migrations'
import { AuthModule } from './modules/auth'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // --- INICIALIZACIÓN DEL BACKEND ---

  // 1. Core: Handlers de ventana
  registerWindowHandlers(mainWindow)
  registerBackupHandlers()

  // 2. Core: Base de Datos y Migraciones
  const db = getDB()

  console.log('Verificando migraciones de base de datos...')
  runMigrations(db) // <--- ESTO CREA/ACTUALIZA LAS TABLAS

  // 3. Módulos: Registrar Handlers IPC
  AuthModule.register()

  // ----------------------------------

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
