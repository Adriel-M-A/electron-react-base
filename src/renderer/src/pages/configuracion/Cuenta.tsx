import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../../context/AuthContext'

export function Cuenta() {
  const { user } = useAuth()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Conectado como: <strong>{user?.nombre}</strong>
        </p>
      </CardContent>
    </Card>
  )
}
