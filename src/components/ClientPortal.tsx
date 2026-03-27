/* Portal del cliente: React island que gestiona el estado de autenticación y renderiza
   los botones de acceso, info del usuario, el modal de auth y el modal de chat.
   Soporta dos variantes: 'desktop' (compacta, en línea) y 'mobile' (expandida, en columna).
   Se hidrata en el navegador con client:load para mantener la sesión activa. */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, User, LogOut, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import AuthModal from '@/components/auth/AuthModal';
import ChatModal from '@/components/chat/ChatModal';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ClientPortalProps {
  variant?: 'desktop' | 'mobile';
}

export default function ClientPortal({ variant = 'desktop' }: ClientPortalProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [checking, setChecking] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = getSupabaseBrowserClient();

  /* Verifica la sesión actual al montar y suscribe a cambios de autenticación */
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || '');
        setUserEmail(session.user.email || '');
      }
      setChecking(false);
    }

    checkSession();
    setMounted(true);

    /* Escucha cambios de estado de autenticación (login, logout, token refresh) */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || '');
        setUserEmail(session.user.email || '');
      } else {
        setUser(null);
        setUserName('');
        setUserEmail('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* Cierra sesión y limpia el estado */
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    setUserEmail('');
    setShowChat(false);
    toast.success('Sesión cerrada');
  }

  /* Callback post-autenticación exitosa: cierra modal de auth y abre el chat */
  function handleAuthSuccess() {
    setShowAuth(false);
    setShowChat(true);
  }

  /* Abre el chat si está autenticado, o el modal de auth si no lo está */
  function handleChatClick() {
    if (user) {
      setShowChat(true);
    } else {
      setShowAuth(true);
    }
  }

  /* Extrae las iniciales del nombre para el avatar */
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /* Nombre para mostrar: prioriza full_name, luego email */
  const displayName = userName || userEmail || 'Usuario';

  /* ─── Variante móvil: layout en columna expandida dentro del menú hamburguesa ─── */
  if (variant === 'mobile') {
    return (
      <>
        <div className="flex flex-col gap-1 w-full">
          {checking ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <>
              {/* Chat directo: primer elemento */}
              <button
                onClick={handleChatClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all font-medium w-full text-left"
              >
                <MessageCircle size={18} />
                Chat directo
              </button>

              {/* Info del usuario + logout en la misma fila */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {userName || 'Usuario'}
                  </span>
                  {userEmail && (
                    <span className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-foreground/70 hover:text-destructive shrink-0 ml-3"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all font-medium w-full text-left"
            >
              <User size={18} />
              Sign In
            </button>
          )}
        </div>

        {/* Modales renderizados en el body (solo la instancia mobile los renderiza para evitar duplicados) */}
        {mounted && createPortal(
          <>
            <Toaster
              position="top-right"
              toastOptions={{ className: 'bg-card text-foreground border-border' }}
              richColors
              style={{ zIndex: 70 }}
            />

            <AuthModal
              isOpen={showAuth}
              onClose={() => setShowAuth(false)}
              onAuthSuccess={handleAuthSuccess}
            />

            {user && (
              <ChatModal
                isOpen={showChat}
                onClose={() => setShowChat(false)}
                userId={user.id}
                userName={displayName}
              />
            )}

            {/* Botón flotante de chat en mobile */}
            {user && !showChat && (
              <button
                onClick={() => setShowChat(true)}
                className="fixed bottom-12 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform sm:hidden"
                aria-label="Abrir chat"
              >
                <MessageCircle size={24} />
              </button>
            )}
          </>,
          document.body
        )}
      </>
    );
  }

  /* ─── Variante desktop: layout compacto en línea ─── */
  return (
    <div className="flex items-center gap-1.5">
      {checking ? (
        <div className="p-2">
          <Loader2 size={18} className="animate-spin text-muted-foreground" />
        </div>
      ) : user ? (
        <>
          {/* Info del usuario: avatar + nombre */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(displayName)}
            </div>
            <span className="text-sm font-medium text-foreground/80 max-w-[120px] truncate">
              {displayName}
            </span>
          </div>

          <button
            onClick={handleChatClick}
            className="relative p-2 rounded-full hover:bg-muted transition-colors text-foreground/70 hover:text-primary"
            title="Abrir chat"
          >
            <MessageCircle size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground/70 hover:text-destructive"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowAuth(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-4 h-9 text-sm font-medium border border-border hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
        >
          <User size={16} />
          Sign In
        </button>
      )}
    </div>
  );
}
