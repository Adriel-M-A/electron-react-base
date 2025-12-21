import { useEffect, useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Search, Shield, ShieldAlert, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { User } from '@/context/AuthContext'
import { toast } from 'sonner'

export function Usuarios() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const result = await window.api.auth.getUsers()
      if (result.success) {
        setUsers(result.users)
      } else {
        toast.error('No se pudieron cargar los usuarios')
      }
    } catch (error) {
      toast.error('Error de conexión con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* BARRA DE ACCIONES SUPERIOR */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o usuario..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="gap-2 shadow-sm"
          onClick={() => toast.info('Funcionalidad próximamente')}
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* TABLA DE USUARIOS */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Directorio de Usuarios</CardTitle>
          <CardDescription>Gestión de cuentas y niveles de acceso del sistema.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Última Conexión</TableHead>
                <TableHead className="text-right pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Cargando directorio...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-4">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-[10px] font-bold bg-secondary text-secondary-foreground">
                          {user.nombre.charAt(0)}
                          {user.apellido.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      {user.nombre} {user.apellido}
                    </TableCell>

                    <TableCell>
                      <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono text-foreground">
                        @{user.usuario}
                      </code>
                    </TableCell>

                    <TableCell>
                      {user.level === 1 ? (
                        <Badge
                          variant="default"
                          className="gap-1 pl-1 pr-2 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none"
                        >
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="gap-1 pl-1 pr-2 bg-secondary text-muted-foreground hover:bg-secondary/80 border-0"
                        >
                          <ShieldAlert className="h-3 w-3" /> Staff
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : 'Nunca'}
                    </TableCell>

                    <TableCell className="text-right pr-4">
                      {/* CAMBIO: Eliminada la clase opacity-0 para que siempre se vean */}
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Editar usuario"
                          onClick={() => toast.info(`Editar a ${user.usuario}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Eliminar usuario"
                          onClick={() => toast.info(`Eliminar a ${user.usuario}`)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
