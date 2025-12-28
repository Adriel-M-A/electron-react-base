import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    setLoginSize: () => ipcRenderer.send('window:setLoginSize'),
    setAppSize: () => ipcRenderer.send('window:setAppSize')
  },
  auth: {
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    createUser: (userData) => ipcRenderer.invoke('auth:createUser', userData),
    updateUser: (id, data) => ipcRenderer.invoke('auth:updateUser', { id, data }),
    changePassword: (id, currentPassword, newPassword) =>
      ipcRenderer.invoke('auth:changePassword', { id, currentPassword, newPassword }),
    getUsers: () => ipcRenderer.invoke('auth:getUsers'),
    deleteUser: (id) => ipcRenderer.invoke('auth:deleteUser', id)
  },
  roles: {
    getAll: () => ipcRenderer.invoke('roles:getAll'),
    update: (data) => ipcRenderer.invoke('roles:update', data)
  },
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    setMany: (settings) => ipcRenderer.invoke('settings:setMany', settings)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
