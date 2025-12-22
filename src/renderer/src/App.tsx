import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@ui/sonner'
import { FLAGS } from '@config/flags'

// IMPORTS DEL CORE
import TitleBar from '@core/layout/TitleBar'
import AppLayout from '@core/layout/AppLayout'
import Configuracion from '@core/pages/Configuracion'

// IMPORTS DEL MÓDULO AUTH
import { AuthProvider, useAuth } from '@auth/context/AuthContext'
import Login from '@auth/pages/Login'
import Perfil from '@auth/pages/Perfil'

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

              {/* RUTA CONDICIONAL DEL MÓDULO AUTH */}
              {FLAGS.ENABLE_AUTH && <Route path="/perfil" element={<Perfil />} />}

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
