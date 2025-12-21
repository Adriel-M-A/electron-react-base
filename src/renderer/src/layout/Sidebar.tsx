import { cn } from '@/lib/utils'
import { useAuth } from '../context/AuthContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, User, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onMobileClick?: () => void
}

export function Sidebar({ className, collapsed, onMobileClick }: SidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Configuración', path: '/configuracion', icon: Settings }
  ]

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[260px]',
        className
      )}
    >
      {/* Header / Logo Section */}
      <div className="h-16 flex items-center px-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-sm tracking-tight text-foreground uppercase">
              System Admin
            </span>
          )}
        </div>
      </div>

      <Separator className="mx-4 w-auto bg-border/50" />

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClick}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all relative',
                isActive
                  ? 'bg-secondary text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </>
                )}
                {/* Indicador lateral activo */}
                {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Section */}
      <div className="p-3 mt-auto">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border/40',
            collapsed ? 'justify-center' : 'px-3'
          )}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {user?.nombre?.charAt(0)}
              {user?.apellido?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.nombre} {user?.apellido}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {user?.level === 1 ? 'Administrator' : 'Staff'}
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors gap-3 justify-start px-3',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  )
}
