import { cn } from '@/lib/utils'
import { useAuth } from '@auth/context/AuthContext'
import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Separator } from '@ui/separator'
import { FLAGS } from '@config/flags'
import { APP_NAVIGATION } from '@config/navigation'
import SidebarUser from './SidebarUser'

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onMobileClick?: () => void
}

export function Sidebar({ className, collapsed = false, onMobileClick }: SidebarProps) {
  const { hasPermission } = useAuth()

  const visibleNavItems = APP_NAVIGATION.filter(
    (item) => !item.hiddenInSidebar && hasPermission(item.id)
  )

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-17.5' : 'w-65',
        className
      )}
    >
      {/* Header */}
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

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleNavItems.map((item) => (
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
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </>
                )}

                {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Usuario */}
      {FLAGS.ENABLE_AUTH && <SidebarUser collapsed={collapsed} onMobileClick={onMobileClick} />}
    </aside>
  )
}
