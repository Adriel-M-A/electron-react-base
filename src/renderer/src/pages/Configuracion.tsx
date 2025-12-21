import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Users, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Importación de los componentes de pestaña que creamos
// Asegúrate de que las rutas coincidan con tu estructura de carpetas
import { Cuenta } from './configuracion/Cuenta'
import { Usuarios } from './configuracion/Usuarios'
import Apariencia from './configuracion/Apariencia'

export default function Configuracion() {
  const { isAdmin } = useAuth()

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

      <Tabs defaultValue="cuenta" className="flex-1 flex flex-col overflow-hidden">
        {/* Navegación de Pestañas Estilizada */}
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          <TabsTrigger value="cuenta" className="tabs-trigger-style">
            <User className="h-4 w-4 mr-2" /> Cuenta
          </TabsTrigger>

          <TabsTrigger value="apariencia" className="tabs-trigger-style">
            <Palette className="h-4 w-4 mr-2" /> Apariencia
          </TabsTrigger>

          <TabsTrigger value="seguridad" className="tabs-trigger-style">
            <Shield className="h-4 w-4 mr-2" /> Seguridad
          </TabsTrigger>

          {/* Tab condicional: Solo visible para administradores */}
          {isAdmin && (
            <TabsTrigger value="usuarios" className="tabs-trigger-style">
              <Users className="h-4 w-4 mr-2" /> Usuarios
            </TabsTrigger>
          )}
        </TabsList>

        {/* Contenido de las Pestañas con Scroll independiente */}
        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          <TabsContent value="cuenta" className="m-0 outline-none">
            <Cuenta />
          </TabsContent>

          <TabsContent value="apariencia" className="m-0 outline-none">
            <Apariencia />
          </TabsContent>

          <TabsContent value="seguridad" className="m-0 outline-none">
            {/* Aquí puedes crear luego un componente Seguridad.tsx o poner el contenido directo */}
            <div className="p-4 border rounded-lg border-dashed border-muted-foreground/20 text-center text-muted-foreground">
              Las opciones de seguridad y cambio de contraseña estarán disponibles próximamente.
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
