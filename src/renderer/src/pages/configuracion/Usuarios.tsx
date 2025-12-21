import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Users, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])

  const fetchUsuarios = async () => {
    // Nota: Asegúrate de tener registrado el handler 'usuarios:getAll' en main/index.ts y preload
    const res = await window.api.usuarios.getAll()
    setUsuarios(res)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <div>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Administra los accesos y niveles de permiso del sistema.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" /> Nuevo Usuario
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  {u.nombre} {u.apellido}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground">
                    NIVEL {u.level}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
