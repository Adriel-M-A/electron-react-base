import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Database } from 'lucide-react'
import Apariencia from './configuracion/Apariencia'

export default function Configuracion() {
  return (
    <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden bg-background">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm">
          Ajustes generales del sistema y preferencias visuales.
        </p>
      </div>

      <Tabs defaultValue="apariencia" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6 w-full">
          <TabsTrigger value="apariencia" className="tabs-trigger-style">
            <Palette className="h-4 w-4 mr-2" /> Apariencia
          </TabsTrigger>

          {/* Ejemplo de futura expansión modular */}
          <TabsTrigger value="sistema" className="tabs-trigger-style">
            <Database className="h-4 w-4 mr-2" /> Sistema
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
          <TabsContent value="apariencia" className="m-0 outline-none">
            <Apariencia />
          </TabsContent>

          <TabsContent value="sistema" className="m-0 outline-none">
            <div className="p-4 border rounded-lg border-dashed border-muted-foreground/20 text-center text-muted-foreground">
              Opciones de base de datos y logs del sistema próximamente.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
