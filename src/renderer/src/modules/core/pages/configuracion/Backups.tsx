import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card'
import { Button } from '@ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@ui/alert-dialog'
import { ShieldCheck, AlertTriangle, Save, RotateCcw, Trash2, HardDrive } from 'lucide-react'
import { toast } from 'sonner'

export default function Backups() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [backupPath, setBackupPath] = useState('')

  const fetchBackups = async () => {
    const res = await window.electron.ipcRenderer.invoke('backup:list')
    if (res.success) {
      setBackups(res.backups)
      setBackupPath(res.path)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    const toastId = toast.loading('Creando copia de seguridad...')
    try {
      const res = await window.electron.ipcRenderer.invoke('backup:create', 'manual')
      if (res.success) {
        toast.success('Respaldo creado correctamente', { id: toastId })
        fetchBackups()
      } else {
        toast.error('Error al crear respaldo', { id: toastId })
      }
    } catch (e) {
      toast.error('Error de conexión', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (filename: string) => {
    toast.info('Restaurando sistema... la aplicación se reiniciará.')
    await window.electron.ipcRenderer.invoke('backup:restore', filename)
  }

  const handleDelete = async (filename: string) => {
    await window.electron.ipcRenderer.invoke('backup:delete', filename)
    toast.success('Archivo eliminado')
    fetchBackups()
  }

  // Cálculos de estado
  const lastBackup = backups.length > 0 ? new Date(backups[0].createdAt) : null
  const isHealthy = lastBackup
    ? new Date().getTime() - lastBackup.getTime() < 7 * 24 * 60 * 60 * 1000 // 7 días
    : false

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. STATUS CARD */}
      <Card
        className={
          isHealthy
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-orange-500/10 border-orange-500/20'
        }
      >
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${isHealthy ? 'bg-green-500/20 text-green-600' : 'bg-orange-500/20 text-orange-600'}`}
            >
              {isHealthy ? (
                <ShieldCheck className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                Estado del Sistema: {isHealthy ? 'Protegido' : 'En Riesgo'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {backups.length === 0
                  ? 'No tienes ninguna copia de seguridad.'
                  : `Última copia: ${lastBackup?.toLocaleDateString()} ${lastBackup?.toLocaleTimeString()}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{backupPath}</p>
            </div>
          </div>
          <Button size="lg" onClick={handleCreate} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Procesando...' : 'Generar Copia Ahora'}
          </Button>
        </CardContent>
      </Card>

      {/* 2. HISTORY TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" /> Puntos de Restauración
          </CardTitle>
          <CardDescription>
            Historial de copias disponibles. Restaurar una versión antigua reemplazará los datos
            actuales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de Archivo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay copias de seguridad disponibles
                  </TableCell>
                </TableRow>
              )}
              {backups.map((backup) => (
                <TableRow key={backup.name}>
                  <TableCell className="font-medium font-mono text-xs">{backup.name}</TableCell>
                  <TableCell>{new Date(backup.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{(backup.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {/* Botón Restaurar con Alerta */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/20"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Restaurar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción reemplazará tu base de datos actual por la versión del
                            <b> {new Date(backup.createdAt).toLocaleDateString()}</b>.
                            <br />
                            <br />
                            Cualquier venta o dato ingresado después de esa fecha se perderá
                            permanentemente. El programa se reiniciará automáticamente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleRestore(backup.name)}
                          >
                            Sí, Restaurar y Reiniciar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Botón Eliminar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(backup.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
