import { contextBridge, ipcRenderer } from 'electron'

const api = {
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    setLoginSize: () => ipcRenderer.send('window:set-login-size'),
    setAppSize: () => ipcRenderer.send('window:set-app-size')
  },
  auth: {
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    createUser: (userData) => ipcRenderer.invoke('auth:create-user', userData),
    updateUser: (id, data) => ipcRenderer.invoke('auth:update-user', { id, data }),
    changePassword: (id, currentPassword, newPassword) =>
      ipcRenderer.invoke('auth:change-password', { id, currentPassword, newPassword }),
    getUsers: () => ipcRenderer.invoke('auth:get-users'),
    deleteUser: (id) => ipcRenderer.invoke('auth:delete-user', id)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.api = api
}
