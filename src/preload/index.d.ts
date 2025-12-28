/// <reference types="vite/client" />
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        setLoginSize: () => void
        setAppSize: () => void
      }
      auth: {
        login: (credentials: any) => Promise<any>
        createUser: (userData: any) => Promise<any>
        updateUser: (id: number, data: any) => Promise<any>
        changePassword: (id: number, current: string, newPass: string) => Promise<any>
        getUsers: () => Promise<{ success: boolean; users: any[] }>
        deleteUser: (id: number) => Promise<{ success: boolean; message?: string }>
      }
      roles: {
        getAll: () => Promise<{ success: boolean; roles: any[] }>
        update: (data: {
          id: number
          label: string
          permissions: string[]
        }) => Promise<{ success: boolean; message?: string }>
      }
    }
  }
}
