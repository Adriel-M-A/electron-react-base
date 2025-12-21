import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Users, Settings2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Importación de tus nuevos componentes de pestaña
import { Usuarios } from './configuracion/Usuarios'
import { Cuenta } from './configuracion/Cuenta'

export default function Configuracion() {
  const { isAdmin } = useAuth()

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      {/* Encabezado fijo */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm">
          Gestiona tu perfil y las preferencias globales del sistema.
        </p>
      </div>

      <Tabs defaultValue="cuenta" className="flex-1 flex flex-col overflow-hidden">
        {/* Lista de Tabs Estilizada */}
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          <TabsTrigger
            value="cuenta"
            className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 shadow-none transition-all hover:text-primary"
          >
            <User className="h-4 w-4 mr-2" /> Cuenta
          </TabsTrigger>

          {/* Tab condicional para Administradores */}
          {isAdmin && (
            <TabsTrigger
              value="usuarios"
              className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 shadow-none transition-all hover:text-primary"
            >
              <Users className="h-4 w-4 mr-2" /> Usuarios
            </TabsTrigger>
          )}

          <TabsTrigger
            value="apariencia"
            className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 shadow-none transition-all hover:text-primary"
          >
            <Settings2 className="h-4 w-4 mr-2" /> Sistema
          </TabsTrigger>
        </TabsList>

        {/* Contenedor del contenido con Scroll independiente */}
        <div className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
          <TabsContent value="cuenta" className="m-0 outline-none">
            <Cuenta />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="usuarios" className="m-0 outline-none">
              <Usuarios />
            </TabsContent>
          )}

          <TabsContent value="apariencia" className="m-0 outline-none">
            {/* Aquí iría tu componente Apariencia.tsx cuando lo crees */}
            <div className="text-sm text-muted-foreground">
              Configuración de apariencia en desarrollo...
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
