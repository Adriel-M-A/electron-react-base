import React, { createContext, useContext, useState, useEffect } from 'react'
import { FLAGS } from '../config/flags'

interface User {
  id: number
  nombre: string
  apellido: string
  level: number
}

interface AuthContextType {
  user: User | null
  login: (nombre: string, password: string) => Promise<{ success: boolean; message?: string }>
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

  const login = async (nombre: string, password: string) => {
    const response = await window.api.auth.login({ nombre, password })

    if (response.success && response.user) {
      setUser(response.user)
      localStorage.setItem('user_session', JSON.stringify(response.user))
      window.api.window.setAppSize()
      return { success: true }
    }

    return { success: false, message: response.message }
  }

  const logout = () => {
    if (!FLAGS.ENABLE_AUTH) return

    setUser(null)
    localStorage.removeItem('user_session')
    window.api.window.setLoginSize()
  }

  const isAdmin = user?.level === 1

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return context
}
