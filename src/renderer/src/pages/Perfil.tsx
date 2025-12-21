import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Users, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Cuenta } from './perfil/Cuenta'
import { Usuarios } from './perfil/Usuarios'

export default function Perfil() {
  const { isAdmin } = useAuth()

  return (
    <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden bg-background animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Perfil y Acceso</h1>
        <p className="text-muted-foreground text-sm">
          Gestiona tu información personal, seguridad y usuarios del sistema.
        </p>
      </div>

      <Tabs defaultValue="cuenta" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          <TabsTrigger value="cuenta" className="tabs-trigger-style">
            <User className="h-4 w-4 mr-2" /> Mi Cuenta
          </TabsTrigger>

          <TabsTrigger value="seguridad" className="tabs-trigger-style">
            <Lock className="h-4 w-4 mr-2" /> Seguridad
          </TabsTrigger>

          {isAdmin && (
            <TabsTrigger value="usuarios" className="tabs-trigger-style">
              <Users className="h-4 w-4 mr-2" /> Gestión de Usuarios
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          <TabsContent value="cuenta" className="m-0 outline-none">
            <Cuenta />
          </TabsContent>

          <TabsContent value="seguridad" className="m-0 outline-none">
            <div className="p-4 border rounded-lg border-dashed border-muted-foreground/20 text-center text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aquí puedes poner opciones avanzadas como 2FA o sesiones activas.</p>
              <p className="text-xs mt-1">Tu contraseña ya se puede cambiar en "Mi Cuenta".</p>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="usuarios" className="m-0 outline-none">
              <Usuarios />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
