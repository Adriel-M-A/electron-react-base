import { useState } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TitleBar(): React.ReactElement {
  const [isMaximized, setIsMaximized] = useState(true)
  const { isLogin } = useAuth() // Obtenemos el estado de login

  const handleMinimize = (): void => {
    window.api.window.minimize()
  }

  const handleMaximize = (): void => {
    // Evitamos ejecutar la lógica si estamos en login para prevenir errores visuales
    if (isLogin) return

    window.api.window.maximize()
    setIsMaximized(!isMaximized)
  }

  const handleClose = (): void => {
    window.api.window.close()
  }

  return (
    <div className="h-8 flex select-none items-center justify-between bg-sidebar text-sidebar-foreground drag-region">
      {/* Sección de Identidad: Logo y Nombre de la App */}
      <div className="flex items-center px-4 gap-2">
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
        <span className="text-xs font-semibold tracking-wide opacity-90">
          Nombre <span className="font-normal opacity-50 ml-1">v1.0</span>
        </span>
      </div>

      <div className="flex h-full no-drag">
        {/* Botón Minimizar */}
        <button
          onClick={handleMinimize}
          className="flex h-full w-10 items-center justify-center hover:bg-white/10 transition-colors focus:outline-none"
          title="Minimizar"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Botón Maximizar / Restaurar: Solo se renderiza si NO estamos en login */}
        {!isLogin && (
          <button
            onClick={handleMaximize}
            className="flex h-full w-10 items-center justify-center hover:bg-white/10 transition-colors focus:outline-none"
            title={isMaximized ? 'Restaurar' : 'Maximizar'}
          >
            {isMaximized ? (
              <Copy className="h-3.5 w-3.5 rotate-180" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="flex h-full w-10 items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors focus:outline-none"
          title="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
