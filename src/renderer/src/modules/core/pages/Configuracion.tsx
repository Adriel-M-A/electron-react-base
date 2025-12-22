import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { Palette, Database, Lock } from 'lucide-react'
import Apariencia from './configuracion/Apariencia'
import { useAuth } from '@auth/context/AuthContext'

export default function Configuracion() {
  const { hasPermission } = useAuth()

  // Calculamos qué pestaña mostrar por defecto
  const canSeeApariencia = hasPermission('config_apariencia')
  const canSeeSistema = hasPermission('config_sistema')

  const defaultTab = canSeeApariencia ? 'apariencia' : canSeeSistema ? 'sistema' : ''

  if (!defaultTab) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <Lock className="h-12 w-12 mb-4 opacity-20" />
        <h2 className="text-xl font-bold">Acceso Restringido</h2>
        <p>No tienes permisos para ver las opciones de configuración.</p>
      </div>
    )
  }

  return (
    <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden bg-background">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm">
          Ajustes generales del sistema y preferencias visuales.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          {canSeeApariencia && (
            <TabsTrigger value="apariencia" className="tabs-trigger-style">
              <Palette className="h-4 w-4 mr-2" /> Apariencia
            </TabsTrigger>
          )}

          {canSeeSistema && (
            <TabsTrigger value="sistema" className="tabs-trigger-style">
              <Database className="h-4 w-4 mr-2" /> Sistema
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          {canSeeApariencia && (
            <TabsContent value="apariencia" className="m-0 outline-none">
              <Apariencia />
            </TabsContent>
          )}

          {canSeeSistema && (
            <TabsContent value="sistema" className="m-0 outline-none">
              <div className="p-4 border rounded-lg border-dashed border-muted-foreground/20 text-center text-muted-foreground">
                Opciones de base de datos y logs del sistema próximamente.
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
