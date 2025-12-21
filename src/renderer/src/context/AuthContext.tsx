import React, { createContext, useContext, useState, useEffect } from 'react'
import { FLAGS } from '../config/flags'

export interface User {
  id: number
  nombre: string
  apellido: string
  usuario: string
  level: number
  last_login?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  login: (usuario: string, password: string) => Promise<{ success: boolean; message?: string }>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  changePassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAdmin: boolean
  isLogin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const isLogin = !user

  useEffect(() => {
    if (!FLAGS.ENABLE_AUTH) {
      setUser({
        id: 0,
        nombre: 'Sistema',
        apellido: 'Admin',
        usuario: 'system',
        level: 1
      })
      window.api.window.setAppSize()
      return
    }

    const savedUser = localStorage.getItem('user_session')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      window.api.window.setAppSize()
    } else {
      window.api.window.setLoginSize()
    }
  }, [])

  const login = async (usuario: string, password: string) => {
    const response = await window.api.auth.login({ usuario, password })
    if (response.success && response.user) {
      setUser(response.user)
      localStorage.setItem('user_session', JSON.stringify(response.user))
      window.api.window.setAppSize()
      return { success: true }
    }
    return { success: false, message: response.message }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false
    const response = await window.api.auth.updateUser(user.id, data)
    if (response.success && response.user) {
      const newUser = { ...user, ...response.user }
      setUser(newUser)
      localStorage.setItem('user_session', JSON.stringify(newUser))
      return true
    }
    return false
  }

  // NUEVA FUNCIÓN
  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user) return { success: false, message: 'No hay sesión' }
    return await window.api.auth.changePassword(user.id, currentPass, newPass)
  }

  const logout = () => {
    if (!FLAGS.ENABLE_AUTH) return
    setUser(null)
    localStorage.removeItem('user_session')
    window.api.window.setLoginSize()
  }

  const isAdmin = user?.level === 1

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, changePassword, isAdmin, isLogin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return context
}
