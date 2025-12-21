import { ElectronAPI } from '@electron-toolkit/preload'

export {}

declare global {
  interface Window {
    api: {
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        setLoginSize: () => void
        setAppSize: () => void
      }
      auth: {
        login: (credentials: { nombre: string; password: string }) => Promise<{
          success: boolean
          message?: string
          user?: { id: number; nombre: string; apellido: string; level: number }
        }>
        createUser: (userData: {
          nombre: string
          apellido: string
          password: string
          level: number
        }) => Promise<{ success: boolean; error?: string }>
        getUsers: () => Promise<{ success: boolean; users: any[] }>
        deleteUser: (id: number) => Promise<{ success: boolean; error?: string }>
      }
    }
  }
}
