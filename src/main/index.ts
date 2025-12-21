import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { FLAGS } from './config'

// Importaciones de base de datos y handlers
import { initDB } from './database'
import { registerWindowHandlers } from './handlers/window.ipc'
import { registerAuthHandlers } from './handlers/auth.ipc'

function createWindow(): void {
  // Creamos la ventana con el tamaño inicial de Login
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 550,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Frameless para usar nuestra TitleBar
    resizable: false, // Iniciamos sin redimensión para el Login
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    // No maximizamos aquí, dejamos que el AuthContext decida el tamaño
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 1. Inicializamos base de datos (tablas y admin por defecto)
  initDB()

  // 2. Registramos Handlers IPC
  registerWindowHandlers(mainWindow)

  if (FLAGS.ENABLE_AUTH) {
    registerAuthHandlers()
  }

  // Carga de la aplicación
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
