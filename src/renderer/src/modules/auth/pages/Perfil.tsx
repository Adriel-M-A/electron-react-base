import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { User, Users, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Cuenta } from './perfil/Cuenta'
import { Usuarios } from './perfil/Usuarios'
import { Permisos } from './perfil/Permisos'

export default function Perfil() {
  const { hasPermission } = useAuth()

  // Verificamos permisos para cada pestaña
  const pCuenta = hasPermission('perfil_cuenta')
  const pUsuarios = hasPermission('perfil_usuarios')
  const pPermisos = hasPermission('perfil_permisos')

  // Calcular defaultTab (la primera que tenga acceso)
  let defaultTab = ''
  if (pCuenta) defaultTab = 'cuenta'
  else if (pUsuarios) defaultTab = 'usuarios'
  else if (pPermisos) defaultTab = 'permisos'

  if (!defaultTab) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Acceso restringido a esta sección.
      </div>
    )
  }

  return (
    <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden bg-background animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Perfil y Acceso</h1>
        <p className="text-muted-foreground text-sm">
          Gestiona tu información personal, seguridad y usuarios del sistema.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          {pCuenta && (
            <TabsTrigger value="cuenta" className="tabs-trigger-style">
              <User className="h-4 w-4 mr-2" /> Mi Cuenta
            </TabsTrigger>
          )}

          {pUsuarios && (
            <TabsTrigger value="usuarios" className="tabs-trigger-style">
              <Users className="h-4 w-4 mr-2" /> Gestión de Usuarios
            </TabsTrigger>
          )}

          {pPermisos && (
            <TabsTrigger value="permisos" className="tabs-trigger-style">
              <KeyRound className="h-4 w-4 mr-2" /> Permisos
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          {pCuenta && (
            <TabsContent value="cuenta" className="m-0 outline-none">
              <Cuenta />
            </TabsContent>
          )}

          {pUsuarios && (
            <TabsContent value="usuarios" className="m-0 outline-none">
              <Usuarios />
            </TabsContent>
          )}

          {pPermisos && (
            <TabsContent value="permisos" className="m-0 outline-none">
              <Permisos />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
