import { cn } from '@/lib/utils'
import { useAuth } from '@auth/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronsRight } from 'lucide-react'
import { Button } from '@ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar'
import { FLAGS } from '@config/flags'
import { PERMISSIONS } from '@config/navigation'

interface SidebarUserProps {
  collapsed?: boolean
  onMobileClick?: () => void
}

function SidebarUser({ collapsed = false, onMobileClick }: SidebarUserProps) {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()

  const canAccessProfile = hasPermission(PERMISSIONS.PERFIL.ROOT)

  const handleProfileClick = () => {
    if (!canAccessProfile) return

    navigate('/perfil')
    if (onMobileClick) onMobileClick()
  }

  if (!FLAGS.ENABLE_AUTH) return null

  return (
    <div className="p-3 mt-auto space-y-2">
      <div
        onClick={handleProfileClick}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border/40 transition-colors group',
          canAccessProfile ? 'cursor-pointer hover:bg-secondary/80' : 'cursor-default opacity-80',
          collapsed ? 'justify-center' : 'px-3'
        )}
        title={canAccessProfile ? 'Ir a mi perfil' : ''}
      >
        <Avatar className="h-8 w-8 border border-border group-hover:border-primary/50 transition-colors">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
            {user?.nombre?.charAt(0)}
            {user?.apellido?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {!collapsed && (
          <>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {user?.nombre} {user?.apellido}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {user?.level === 1 ? 'Administrator' : 'Staff'}
              </span>
            </div>

            {canAccessProfile && (
              <ChevronsRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={logout}
        className={cn(
          'w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors gap-3 justify-start px-3',
          collapsed && 'justify-center px-0'
        )}
        title="Cerrar Sesión"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="text-xs font-medium">Cerrar Sesión</span>}
      </Button>
    </div>
  )
}

export default SidebarUser
