import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { LogIn, Loader2, ShieldCheck, NotebookPen } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()

  // React Hook Form para validación limpia
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    defaultValues: {
      nombre: '',
      password: ''
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const result = await login(data.nombre, data.password)
      if (result.success) {
        toast.success('Acceso autorizado')
      } else {
        toast.error(result.message || 'Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error crítico del sistema')
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-background select-none overflow-hidden">
      {/* Contenedor principal ajustado al tamaño 400x550.
        Usamos las variables de tu main.css: bg-background, text-foreground, etc. 
      */}

      <div className="flex flex-col items-center justify-center flex-1 px-8 pt-4">
        {/* Logo minimalista con color Primary de main.css */}
        <div className="mb-6 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            <NotebookPen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">Bienvenido</h2>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Gestión de Acceso
          </p>
        </div>

        {/* Formulario con React Hook Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-5 animate-in fade-in zoom-in duration-700"
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase ml-1">
              Usuario
            </label>
            <Input
              {...register('nombre', { required: true })}
              placeholder="Ingresa tu usuario"
              disabled={isSubmitting}
              className={`h-11 bg-secondary/30 border-input focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.nombre ? 'border-destructive' : ''
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase ml-1">
              Contraseña
            </label>
            <Input
              {...register('password', { required: true })}
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`h-11 bg-secondary/30 border-input focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.password ? 'border-destructive' : ''
              }`}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full font-bold text-sm tracking-wide bg-primary hover:opacity-90 shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span>INICIAR SESIÓN</span>
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* Footer minimalista pegado al borde inferior */}
      <div className="p-6 flex flex-col items-center opacity-30">
        <div className="h-[1px] w-12 bg-border mb-3" />
        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
          Terminal v1.0
        </span>
      </div>
    </div>
  )
}
