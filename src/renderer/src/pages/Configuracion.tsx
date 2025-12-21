import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Users, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { FLAGS } from '../config/flags'

// Importación de los componentes
import { Cuenta } from './configuracion/Cuenta'
import { Usuarios } from './configuracion/Usuarios'
import Apariencia from './configuracion/Apariencia'

export default function Configuracion() {
  const { isAdmin } = useAuth()

  // Si Auth está activo iniciamos en 'cuenta', si no, en 'apariencia'
  const defaultTab = FLAGS.ENABLE_AUTH ? 'cuenta' : 'apariencia'

  return (
    <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden bg-background">
      {/* Encabezado Principal */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm">
          Administra las preferencias de tu cuenta, el aspecto del sistema y los accesos de
          usuarios.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Navegación de Pestañas Estilizada */}
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          {FLAGS.ENABLE_AUTH && (
            <TabsTrigger value="cuenta" className="tabs-trigger-style">
              <User className="h-4 w-4 mr-2" /> Cuenta
            </TabsTrigger>
          )}

          <TabsTrigger value="apariencia" className="tabs-trigger-style">
            <Palette className="h-4 w-4 mr-2" /> Apariencia
          </TabsTrigger>

          {FLAGS.ENABLE_AUTH && (
            <TabsTrigger value="seguridad" className="tabs-trigger-style">
              <Shield className="h-4 w-4 mr-2" /> Seguridad
            </TabsTrigger>
          )}

          {/* Tab condicional: Solo visible si Auth activo y es Admin */}
          {FLAGS.ENABLE_AUTH && isAdmin && (
            <TabsTrigger value="usuarios" className="tabs-trigger-style">
              <Users className="h-4 w-4 mr-2" /> Usuarios
            </TabsTrigger>
          )}
        </TabsList>

        {/* Contenido de las Pestañas con Scroll independiente */}
        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          {FLAGS.ENABLE_AUTH && (
            <TabsContent value="cuenta" className="m-0 outline-none">
              <Cuenta />
            </TabsContent>
          )}

          <TabsContent value="apariencia" className="m-0 outline-none">
            <Apariencia />
          </TabsContent>

          {FLAGS.ENABLE_AUTH && (
            <TabsContent value="seguridad" className="m-0 outline-none">
              <div className="p-4 border rounded-lg border-dashed border-muted-foreground/20 text-center text-muted-foreground">
                Las opciones de seguridad y cambio de contraseña estarán disponibles próximamente.
              </div>
            </TabsContent>
          )}

          {FLAGS.ENABLE_AUTH && isAdmin && (
            <TabsContent value="usuarios" className="m-0 outline-none">
              <Usuarios />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
