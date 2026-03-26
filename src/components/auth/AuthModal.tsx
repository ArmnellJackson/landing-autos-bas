/* Modal de autenticación: formularios de registro e inicio de sesión con validación,
   estados de carga y notificaciones toast. Alterna entre registro y login según el estado. */
import { useState, useRef, type FormEvent } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'register';

/* Errores de validación por campo */
interface FieldErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const submitRef = useRef(false);

  const supabase = getSupabaseBrowserClient();

  /* Valida los campos del formulario según el modo activo */
  function validate(formData: FormData): FieldErrors {
    const errs: FieldErrors = {};
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;

    if (!email) {
      errs.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Email no válido';
    }

    if (!password) {
      errs.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      errs.password = 'Mínimo 6 caracteres';
    }

    if (mode === 'register') {
      const fullName = (formData.get('full_name') as string)?.trim();
      if (!fullName) errs.full_name = 'El nombre es obligatorio';
    }

    return errs;
  }

  /* Maneja el envío del formulario: registro o login según el modo */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitRef.current) return;

    const formData = new FormData(e.currentTarget);
    const fieldErrors = validate(formData);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    submitRef.current = true;

    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    try {
      if (mode === 'register') {
        const fullName = (formData.get('full_name') as string).trim();
        const phone = (formData.get('phone') as string)?.trim() || null;

        /* Crear usuario en auth.users; el trigger handle_new_user se encarga
           de insertar automáticamente en la tabla clients con los metadatos */
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });

        if (authError) throw authError;

        toast.success('¡Cuenta creada exitosamente!');
        onAuthSuccess();
      } else {
        /* Login: autenticación con email y contraseña */
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('¡Inicio de sesión exitoso!');
        onAuthSuccess();
      }
    } catch (err: any) {
      /* Mapeo de errores comunes de Supabase a mensajes en español */
      const message = err?.message || 'Error inesperado';
      if (message.includes('already registered') || message.includes('already been registered')) {
        toast.error('Este email ya está registrado. Intenta iniciar sesión.');
      } else if (message.includes('Invalid login credentials')) {
        toast.error('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (message.includes('Email not confirmed')) {
        toast.error('Confirma tu email antes de iniciar sesión.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      submitRef.current = false;
    }
  }

  if (!isOpen) return null;

  return (
    /* Overlay oscuro con cierre al hacer clic fuera del modal */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md my-auto bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 shrink-0">
        {/* Cabecera del modal con título y botón de cierre */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-foreground">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {/* Campo de nombre completo, solo visible en modo registro */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-foreground">
                Nombre completo <span className="text-destructive">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                aria-invalid={!!errors.full_name}
              />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
            </div>
          )}

          {/* Campo de email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Campo de teléfono, solo visible en modo registro */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Teléfono <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (305) 555-0123"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              />
            </div>
          )}

          {/* Campo de contraseña con toggle de visibilidad */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 pr-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Botón de envío con indicador de carga */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

          {/* Enlace para alternar entre login y registro */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrors({}); }}
                  className="text-primary font-medium hover:underline"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrors({}); }}
                  className="text-primary font-medium hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
