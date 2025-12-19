import { cn } from '@/lib/utils'
import { menuConfig } from './menu'
import { NavLink } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NotebookPen, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  className?: string
  onMobileClick?: () => void
  collapsed?: boolean
}

export function Sidebar({ className, onMobileClick, collapsed = false }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header / Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-accent',
          collapsed ? 'justify-center px-0' : 'px-6'
        )}
      >
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <NotebookPen className="h-6 w-6" />
          {!collapsed && <span className="animate-in fade-in duration-300">Titulo</span>}
        </div>
      </div>

      {/* Cuerpo del Menú */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          {menuConfig.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onMobileClick}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md py-2.5 transition-colors',
                  collapsed ? 'justify-center px-0' : 'gap-3 px-4',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer: Usuario y Logout */}
      <div
        className={cn(
          'p-2 border-t border-sidebar-accent',
          collapsed ? 'flex flex-col items-center gap-2' : 'px-4 py-4'
        )}
      >
        <div
          className={cn('flex items-center gap-3 mb-2 px-2', collapsed && 'justify-center px-0')}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            <User className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{user?.nombre}</span>
              <span className="text-xs text-muted-foreground uppercase">Nivel {user?.level}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          onClick={logout}
          title={collapsed ? 'Cerrar Sesión' : undefined}
          className={cn(
            'w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            collapsed ? 'justify-center' : 'justify-start gap-3'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
