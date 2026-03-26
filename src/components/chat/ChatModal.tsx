/* Modal de chat en tiempo real: permite al cliente autenticado comunicarse con el equipo
   del dealer. Usa Supabase Realtime para recibir respuestas instantáneas del staff.
   Crea conversación nueva o retoma la existente según el estado en la base de datos. */
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

/* Estructura de un mensaje del chat */
interface Mensaje {
  id: string;
  conversacion_id: string;
  autor_id: string;
  es_staff: boolean;
  contenido: string;
  read_at: string | null;
  created_at: string;
}

export default function ChatModal({ isOpen, onClose, userId, userName }: ChatModalProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* Refs para scroll automático, prevención de doble envío y canal Realtime */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = getSupabaseBrowserClient();

  /* Desplaza el contenedor de mensajes hacia el final */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Efecto principal: busca conversación abierta existente y suscribe a Realtime */
  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;

    async function inicializarChat() {
      setLoading(true);

      /* Busca si el cliente ya tiene una conversación abierta */
      const { data: conversaciones, error: convError } = await supabase
        .from('conversaciones')
        .select('id')
        .eq('cliente_id', userId)
        .eq('status', 'abierta')
        .order('created_at', { ascending: false })
        .limit(1);

      if (convError) {
        toast.error('Error al cargar la conversación');
        setLoading(false);
        return;
      }

      if (!mounted) return;

      if (conversaciones && conversaciones.length > 0) {
        const convId = conversaciones[0].id;
        setConversacionId(convId);

        /* Carga los mensajes existentes de la conversación */
        const { data: msgs, error: msgsError } = await supabase
          .from('mensajes')
          .select('*')
          .eq('conversacion_id', convId)
          .order('created_at', { ascending: true });

        if (msgsError) {
          toast.error('Error al cargar los mensajes');
        } else if (mounted) {
          setMensajes(msgs || []);
        }

        /* Suscripción a Realtime para recibir nuevos mensajes en esta conversación */
        suscribirRealtime(convId);
      }

      if (mounted) setLoading(false);
    }

    inicializarChat();

    return () => {
      mounted = false;
      /* Limpia la suscripción Realtime al desmontar o cerrar el modal */
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isOpen, userId]);

  /* Scroll automático cuando llegan nuevos mensajes */
  useEffect(() => {
    scrollToBottom();
  }, [mensajes, scrollToBottom]);

  /* Configura la suscripción Realtime filtrando por conversacion_id */
  function suscribirRealtime(convId: string) {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`mensajes:${convId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mensajes',
          filter: `conversacion_id=eq.${convId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const nuevoMensaje = payload.new as Mensaje;
            /* Solo agrega si no existe ya en el estado (previene duplicados) */
            setMensajes((prev) => {
              if (prev.some((m) => m.id === nuevoMensaje.id)) return prev;
              return [...prev, nuevoMensaje];
            });
          } else if (payload.eventType === 'UPDATE') {
            /* Actualiza el mensaje existente (ej: cuando read_at se establece) */
            const updated = payload.new as Mensaje;
            setMensajes((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }

  /* Envía un mensaje: crea conversación si no existe, inserta el mensaje */
  async function enviarMensaje() {
    const contenido = inputValue.trim();
    if (!contenido || sendingRef.current) return;

    sendingRef.current = true;
    setSending(true);

    try {
      let convId = conversacionId;

      /* Si no hay conversación abierta, crea una nueva al enviar el primer mensaje */
      if (!convId) {
        const { data: nuevaConv, error: convError } = await supabase
          .from('conversaciones')
          .insert({ cliente_id: userId })
          .select('id')
          .single();

        if (convError) throw convError;

        convId = nuevaConv.id;
        setConversacionId(convId);
        suscribirRealtime(convId);
      }

      /* Inserta el mensaje con es_staff=false y autor_id del cliente autenticado */
      const { error: msgError } = await supabase.from('mensajes').insert({
        conversacion_id: convId,
        autor_id: userId,
        es_staff: false,
        contenido,
      });

      if (msgError) throw msgError;

      setInputValue('');
      inputRef.current?.focus();
    } catch (err: any) {
      toast.error(err?.message || 'Error al enviar el mensaje');
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  /* Formatea timestamp a hora legible (HH:MM) */
  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /* Formatea timestamp a fecha legible para separadores de día */
  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  /* Determina si se debe mostrar un separador de fecha entre mensajes */
  function shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;
    const current = new Date(mensajes[index].created_at).toDateString();
    const previous = new Date(mensajes[index - 1].created_at).toDateString();
    return current !== previous;
  }

  if (!isOpen) return null;

  return (
    /* Overlay del modal de chat */
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Fondo oscuro semitransparente */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Contenedor principal del chat: ocupa toda la pantalla en móvil, modal centrado en desktop */}
      <div className="relative w-full h-full sm:h-[600px] sm:max-w-lg bg-card border-0 sm:border sm:border-border sm:rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 slide-in-from-bottom-2">
        {/* Cabecera del chat */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Autos Bas Dealer</h3>
              <p className="text-xs text-muted-foreground">Equipo de ventas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de mensajes con scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {loading ? (
            /* Indicador de carga mientras se obtienen los mensajes */
            <div className="flex items-center justify-center h-full">
              <Loader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : mensajes.length === 0 ? (
            /* Estado vacío: sin mensajes previos */
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">¡Bienvenido, {userName}!</h4>
              <p className="text-sm text-muted-foreground">
                Envía un mensaje para iniciar una conversación con nuestro equipo de ventas.
              </p>
            </div>
          ) : (
            /* Lista de mensajes con separadores de fecha */
            <>
              {mensajes.map((msg, index) => (
                <div key={msg.id}>
                  {/* Separador de fecha entre días distintos */}
                  {shouldShowDateSeparator(index) && (
                    <div className="flex items-center justify-center my-3">
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                  )}

                  {/* Burbuja de mensaje: derecha para el cliente, izquierda para el staff */}
                  <div className={`flex ${msg.es_staff ? 'justify-start' : 'justify-end'} mb-1.5`}>
                    <div
                      className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm break-words ${
                        msg.es_staff
                          ? 'bg-muted text-foreground rounded-bl-md'
                          : 'bg-primary text-primary-foreground rounded-br-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.contenido}</p>
                      <div
                        className={`flex items-center gap-1 mt-0.5 ${
                          msg.es_staff ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <span
                          className={`text-[10px] ${
                            msg.es_staff ? 'text-muted-foreground' : 'text-primary-foreground/70'
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </span>
                        {/* Indicador de lectura: doble check azul cuando read_at no es null */}
                        {!msg.es_staff && (
                          msg.read_at ? (
                            <CheckCheck size={14} className="text-blue-300" />
                          ) : (
                            <Check size={14} className="text-primary-foreground/50" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Barra de entrada de texto con botón de envío */}
        <div className="p-3 border-t border-border shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 h-10 rounded-full border border-input bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !inputValue.trim()}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {sending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
