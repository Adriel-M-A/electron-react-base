import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import { Toaster } from '@/components/ui/sonner'
import TitleBar from './layout/TitleBar'
import Configuracion from './pages/Configuracion'

const RootRoutes = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TitleBar />
      <div className="flex-1 overflow-hidden">
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={<div className="p-10 text-2xl font-bold">Panel de Inicio</div>}
              />
              <Route path="/configuracion" element={<Configuracion />} />

              <Route
                path="*"
                element={<div className="p-10 text-red-500">Página no encontrada</div>}
              />
            </Route>
          </Routes>
        )}
      </div>
    </div>
  )
}

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <HashRouter>
        <RootRoutes />
      </HashRouter>
      <Toaster richColors position="bottom-center" />
    </AuthProvider>
  )
}

export default App
