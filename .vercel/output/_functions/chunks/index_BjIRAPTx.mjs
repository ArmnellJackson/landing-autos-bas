import { c as createComponent } from './astro-component_BkHWJn7n.mjs';
import 'piccolore';
import { l as createRenderInstruction, r as renderTemplate, n as renderSlot, o as renderHead, h as addAttribute, m as maybeRenderHead, p as renderComponent } from './entrypoint_DzlvFwUC.mjs';
import { clsx } from 'clsx';
import { X, EyeOff, Eye, Loader2, MessageCircle, CheckCheck, Check, Send, LogOut, User, ChevronDown, Menu, Sun, Moon, ChevronDownIcon, CheckIcon, ChevronUpIcon, Car, Calendar } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { toast, Toaster } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { Select as Select$1 } from 'radix-ui';
import { twMerge } from 'tailwind-merge';
import { useMotionValue, motion, useTransform } from 'motion/react';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Autos Bas Dealer Miami - Premium luxury car sales in South Florida" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><meta name="description"', "><title>", "</title><!-- Script de inicialización de tema: evita parpadeo leyendo preferencia antes del render --><script>\n			(function() {\n				const stored = localStorage.getItem('theme');\n				if (stored === 'dark') {\n					document.documentElement.classList.add('dark');\n				} else {\n					document.documentElement.classList.remove('dark');\n				}\n			})();\n		<\/script>", '</head> <body class="bg-background text-foreground antialiased overflow-x-hidden" data-astro-cid-sckkx6r4> ', "</body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/layouts/Layout.astro", void 0);

const supabaseUrl$1 = "https://gfxmrzwulvozkijpbihu.supabase.co";
const supabaseAnonKey$1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeG1yend1bHZvemtpanBiaWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjEwMjQsImV4cCI6MjA4OTU5NzAyNH0.YViKc0a-OYvh8CnG7DO6YLkTlul2PPbbChXAk5e0XQ4";
function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl$1, supabaseAnonKey$1);
}

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const submitRef = useRef(false);
  const supabase = getSupabaseBrowserClient();
  function validate(formData) {
    const errs = {};
    const email = formData.get("email")?.trim();
    const password = formData.get("password");
    if (!email) {
      errs.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Email no válido";
    }
    if (!password) {
      errs.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      errs.password = "Mínimo 6 caracteres";
    }
    if (mode === "register") {
      const fullName = formData.get("full_name")?.trim();
      if (!fullName) errs.full_name = "El nombre es obligatorio";
    }
    return errs;
  }
  async function handleSubmit(e) {
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
    const email = formData.get("email").trim();
    const password = formData.get("password");
    try {
      if (mode === "register") {
        const fullName = formData.get("full_name").trim();
        const phone = formData.get("phone")?.trim() || null;
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone }
          }
        });
        if (authError) throw authError;
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (loginError) throw loginError;
        toast.success("¡Cuenta creada exitosamente!");
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("¡Inicio de sesión exitoso!");
        onAuthSuccess();
      }
    } catch (err) {
      const message = err?.message || "Error inesperado";
      if (message.includes("already registered") || message.includes("already been registered")) {
        toast.error("Este email ya está registrado. Intenta iniciar sesión.");
      } else if (message.includes("Invalid login credentials")) {
        toast.error("Credenciales inválidas. Verifica tu email y contraseña.");
      } else if (message.includes("Email not confirmed")) {
        toast.error("Confirma tu email antes de iniciar sesión.");
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
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto",
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
        children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md my-auto bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 pb-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: mode === "login" ? "Iniciar Sesión" : "Crear Cuenta" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsx(X, { size: 20 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 pt-4 space-y-4", children: [
            mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "full_name", className: "text-sm font-medium text-foreground", children: [
                "Nombre completo ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "full_name",
                  name: "full_name",
                  type: "text",
                  placeholder: "John Doe",
                  className: "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30",
                  "aria-invalid": !!errors.full_name
                }
              ),
              errors.full_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.full_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "text-sm font-medium text-foreground", children: [
                "Email ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "email",
                  name: "email",
                  type: "email",
                  placeholder: "tu@email.com",
                  autoComplete: "email",
                  className: "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30",
                  "aria-invalid": !!errors.email
                }
              ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.email })
            ] }),
            mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "phone", className: "text-sm font-medium text-foreground", children: [
                "Teléfono ",
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: "(opcional)" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "phone",
                  name: "phone",
                  type: "tel",
                  placeholder: "+1 (305) 555-0123",
                  className: "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "password", className: "text-sm font-medium text-foreground", children: [
                "Contraseña ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "password",
                    name: "password",
                    type: showPassword ? "text" : "password",
                    placeholder: "Mínimo 6 caracteres",
                    autoComplete: mode === "login" ? "current-password" : "new-password",
                    className: "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 pr-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30",
                    "aria-invalid": !!errors.password
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    tabIndex: -1,
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                  }
                )
              ] }),
              errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.password })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                children: [
                  loading && /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
                  mode === "login" ? "Entrar" : "Crear cuenta"
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-muted-foreground", children: mode === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "¿No tienes cuenta?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setMode("register");
                    setErrors({});
                  },
                  className: "text-primary font-medium hover:underline",
                  children: "Regístrate aquí"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "¿Ya tienes cuenta?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setMode("login");
                    setErrors({});
                  },
                  className: "text-primary font-medium hover:underline",
                  children: "Inicia sesión"
                }
              )
            ] }) })
          ] })
        ] })
      }
    )
  );
}

function ChatModal({ isOpen, onClose, userId, userName }) {
  const [mensajes, setMensajes] = useState([]);
  const [conversacionId, setConversacionId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);
  const channelRef = useRef(null);
  const inputRef = useRef(null);
  const supabase = getSupabaseBrowserClient();
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (!isOpen || !userId) return;
    let mounted = true;
    async function inicializarChat() {
      setLoading(true);
      const { data: conversaciones, error: convError } = await supabase.from("conversaciones").select("id").eq("cliente_id", userId).eq("status", "abierta").order("created_at", { ascending: false }).limit(1);
      if (convError) {
        toast.error("Error al cargar la conversación");
        setLoading(false);
        return;
      }
      if (!mounted) return;
      if (conversaciones && conversaciones.length > 0) {
        const convId = conversaciones[0].id;
        setConversacionId(convId);
        const { data: msgs, error: msgsError } = await supabase.from("mensajes").select("*").eq("conversacion_id", convId).order("created_at", { ascending: true });
        if (msgsError) {
          toast.error("Error al cargar los mensajes");
        } else if (mounted) {
          setMensajes(msgs || []);
        }
        suscribirRealtime(convId);
      }
      if (mounted) setLoading(false);
    }
    inicializarChat();
    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isOpen, userId]);
  useEffect(() => {
    if (!loading && isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, isOpen]);
  useEffect(() => {
    scrollToBottom();
  }, [mensajes, scrollToBottom]);
  function suscribirRealtime(convId) {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    const channel = supabase.channel(`mensajes:${convId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mensajes",
        filter: `conversacion_id=eq.${convId}`
      },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const nuevoMensaje = payload.new;
          setMensajes((prev) => {
            if (prev.some((m) => m.id === nuevoMensaje.id)) return prev;
            return [...prev, nuevoMensaje];
          });
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new;
          setMensajes(
            (prev) => prev.map((m) => m.id === updated.id ? updated : m)
          );
        }
      }
    ).subscribe();
    channelRef.current = channel;
  }
  async function enviarMensaje() {
    const contenido = inputValue.trim();
    if (!contenido || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    try {
      let convId = conversacionId;
      if (!convId) {
        const { data: nuevaConv, error: convError } = await supabase.from("conversaciones").insert({ cliente_id: userId }).select("id").single();
        if (convError) throw convError;
        convId = nuevaConv.id;
        setConversacionId(convId);
        suscribirRealtime(convId);
      }
      const { data: msgData, error: msgError } = await supabase.from("mensajes").insert({
        conversacion_id: convId,
        autor_id: userId,
        es_staff: false,
        contenido
      }).select().single();
      if (msgError) throw msgError;
      if (msgData) {
        setMensajes((prev) => {
          if (prev.some((m) => m.id === msgData.id)) return prev;
          return [...prev, msgData];
        });
      }
      setInputValue("");
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (err) {
      toast.error(err?.message || "Error al enviar el mensaje");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }
  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = /* @__PURE__ */ new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Hoy";
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  function shouldShowDateSeparator(index) {
    if (index === 0) return true;
    const current = new Date(mensajes[index].created_at).toDateString();
    const previous = new Date(mensajes[index - 1].created_at).toDateString();
    return current !== previous;
  }
  if (!isOpen) return null;
  return (
    /* Overlay del modal de chat */
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4",
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full sm:h-[600px] sm:max-w-lg bg-card border-0 sm:border sm:border-border sm:rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 slide-in-from-bottom-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(MessageCircle, { size: 20, className: "text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Autos Bas Dealer" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Equipo de ventas" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsx(X, { size: 20 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-1", children: loading ? (
              /* Indicador de carga mientras se obtienen los mensajes */
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx(Loader2, { size: 28, className: "animate-spin text-primary" }) })
            ) : mensajes.length === 0 ? (
              /* Estado vacío: sin mensajes previos */
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-6", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(MessageCircle, { size: 32, className: "text-primary" }) }),
                /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-1", children: [
                  "¡Bienvenido, ",
                  userName,
                  "!"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Envía un mensaje para iniciar una conversación con nuestro equipo de ventas." })
              ] })
            ) : (
              /* Lista de mensajes con separadores de fecha */
              /* @__PURE__ */ jsxs(Fragment, { children: [
                mensajes.map((msg, index) => /* @__PURE__ */ jsxs("div", { children: [
                  shouldShowDateSeparator(index) && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center my-3", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full", children: formatDate(msg.created_at) }) }),
                  /* @__PURE__ */ jsx("div", { className: `flex ${msg.es_staff ? "justify-start" : "justify-end"} mb-1.5`, children: /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `max-w-[80%] px-3.5 py-2 rounded-2xl text-sm break-words ${msg.es_staff ? "bg-muted text-foreground rounded-bl-md" : "bg-primary text-primary-foreground rounded-br-md"}`,
                      children: [
                        /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap", children: msg.contenido }),
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `flex items-center gap-1 mt-0.5 ${msg.es_staff ? "justify-start" : "justify-end"}`,
                            children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-[10px] ${msg.es_staff ? "text-muted-foreground" : "text-primary-foreground/70"}`,
                                  children: formatTime(msg.created_at)
                                }
                              ),
                              !msg.es_staff && (msg.read_at ? /* @__PURE__ */ jsx(CheckCheck, { size: 14, className: "text-blue-300" }) : /* @__PURE__ */ jsx(Check, { size: 14, className: "text-primary-foreground/50" }))
                            ]
                          }
                        )
                      ]
                    }
                  ) })
                ] }, msg.id)),
                /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
              ] })
            ) }),
            /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-border shrink-0", children: /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  enviarMensaje();
                },
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: inputRef,
                      type: "text",
                      value: inputValue,
                      onChange: (e) => setInputValue(e.target.value),
                      placeholder: "Escribe un mensaje...",
                      className: "flex-1 h-10 rounded-full border border-input bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: sending || !inputValue.trim(),
                      className: "h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                      children: sending ? /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 18 })
                    }
                  )
                ]
              }
            ) })
          ] })
        ]
      }
    )
  );
}

function ClientPortal({ variant = "desktop" }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = getSupabaseBrowserClient();
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || "");
        setUserEmail(session.user.email || "");
      }
      setChecking(false);
    }
    checkSession();
    setMounted(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || "");
        setUserEmail(session.user.email || "");
      } else {
        setUser(null);
        setUserName("");
        setUserEmail("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUserName("");
    setUserEmail("");
    setShowChat(false);
    toast.success("Sesión cerrada");
  }
  function handleAuthSuccess() {
    setShowAuth(false);
    setShowChat(true);
  }
  function handleChatClick() {
    if (user) {
      setShowChat(true);
    } else {
      setShowAuth(true);
    }
  }
  function getInitials(name) {
    return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }
  const displayName = userName || userEmail || "Usuario";
  if (variant === "mobile") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 w-full", children: checking ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-3", children: /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin text-muted-foreground" }) }) : user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleChatClick,
            className: "flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all font-medium w-full text-left",
            children: [
              /* @__PURE__ */ jsx(MessageCircle, { size: 18 }),
              "Chat directo"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: userName || "Usuario" }),
            userEmail && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground truncate", children: userEmail })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleLogout,
              className: "p-2 rounded-full hover:bg-destructive/10 transition-colors text-foreground/70 hover:text-destructive shrink-0 ml-3",
              title: "Cerrar sesión",
              children: /* @__PURE__ */ jsx(LogOut, { size: 18 })
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowAuth(true),
          className: "flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all font-medium w-full text-left",
          children: [
            /* @__PURE__ */ jsx(User, { size: 18 }),
            "Sign In"
          ]
        }
      ) }),
      mounted && createPortal(
        /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Toaster,
            {
              position: "top-right",
              toastOptions: { className: "bg-card text-foreground border-border" },
              richColors: true,
              style: { zIndex: 70 }
            }
          ),
          /* @__PURE__ */ jsx(
            AuthModal,
            {
              isOpen: showAuth,
              onClose: () => setShowAuth(false),
              onAuthSuccess: handleAuthSuccess
            }
          ),
          user && /* @__PURE__ */ jsx(
            ChatModal,
            {
              isOpen: showChat,
              onClose: () => setShowChat(false),
              userId: user.id,
              userName: displayName
            }
          ),
          user && !showChat && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowChat(true),
              className: "fixed bottom-12 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform sm:hidden",
              "aria-label": "Abrir chat",
              children: /* @__PURE__ */ jsx(MessageCircle, { size: 24 })
            }
          )
        ] }),
        document.body
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    checking ? /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin text-muted-foreground" }) }) : user ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowDropdown(!showDropdown),
            className: "flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-muted transition-colors",
            title: "Mi cuenta",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0", children: getInitials(displayName) }),
              /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: `text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}` })
            ]
          }
        ),
        showDropdown && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-2 w-64 bg-background border border-border/60 rounded-xl shadow-xl py-3 px-4 z-50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: userName || "Usuario" }),
            userEmail && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground truncate", children: userEmail })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border/40 pt-2", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                handleLogout();
                setShowDropdown(false);
              },
              className: "flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors",
              children: [
                /* @__PURE__ */ jsx(LogOut, { size: 16 }),
                "Cerrar sesión"
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleChatClick,
          className: "relative p-2 rounded-full hover:bg-muted transition-colors text-foreground/70 hover:text-primary",
          title: "Abrir chat",
          children: /* @__PURE__ */ jsx(MessageCircle, { size: 20 })
        }
      )
    ] }) : (
      /* Sign In: va primero (antes del tema que está en el Navbar) */
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowAuth(true),
          className: "inline-flex items-center gap-1.5 rounded-full px-4 h-9 text-sm font-medium border border-border hover:bg-muted transition-colors text-foreground/80 hover:text-foreground",
          children: [
            /* @__PURE__ */ jsx(User, { size: 16 }),
            "Sign In"
          ]
        }
      )
    ),
    mounted && createPortal(
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Toaster,
          {
            position: "top-right",
            toastOptions: { className: "bg-card text-foreground border-border" },
            richColors: true,
            style: { zIndex: 70 }
          }
        ),
        /* @__PURE__ */ jsx(
          AuthModal,
          {
            isOpen: showAuth,
            onClose: () => setShowAuth(false),
            onAuthSuccess: handleAuthSuccess
          }
        ),
        user && /* @__PURE__ */ jsx(
          ChatModal,
          {
            isOpen: showChat,
            onClose: () => setShowChat(false),
            userId: user.id,
            userName: displayName
          }
        )
      ] }),
      document.body
    )
  ] });
}

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300 h-16 flex items-center"> <div class="container mx-auto px-4 md:px-6 flex items-center justify-between"> <!-- Izquierda: hamburguesa en móvil, elementos visibles en sm+ --> <div class="flex items-center gap-2 sm:gap-3 w-1/4"> <!-- Botón hamburguesa: visible solo en móvil --> <button id="mobile-menu-toggle" class="sm:hidden p-2 rounded-full hover:bg-muted transition-colors text-foreground/70" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu"> <span id="icon-menu">${renderComponent($$result, "Menu", Menu, { "size": 22 })}</span> <span id="icon-close" style="display:none;">${renderComponent($$result, "X", X, { "size": 22 })}</span> </button> <!-- Elementos visibles en desktop: auth/chat primero, luego tema --> <div class="hidden sm:flex items-center gap-2 md:gap-3"> ${renderComponent($$result, "ClientPortal", ClientPortal, { "client:load": true, "variant": "desktop", "client:component-hydration": "load", "client:component-path": "@/components/ClientPortal", "client:component-export": "default" })} <button id="theme-toggle" class="p-2 rounded-full hover:bg-muted transition-colors text-foreground/70 hover:text-primary" aria-label="Toggle theme"> <span id="icon-sun">${renderComponent($$result, "Sun", Sun, { "size": 20 })}</span> <span id="icon-moon" style="display:none;">${renderComponent($$result, "Moon", Moon, { "size": 20 })}</span> </button> </div> </div> <!-- Centro: logo --> <a href="/" class="flex items-center gap-2 group"> <div class="bg-primary p-1.5 rounded-sm group-hover:scale-110 transition-transform duration-300"> <span class="text-white font-black text-xl leading-none">B</span> </div> <div class="flex flex-col leading-none"> <span class="text-foreground font-bold text-lg uppercase tracking-tighter italic">Autos Bas</span> <span class="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Dealer Miami</span> </div> </a> <!-- Derecha: WhatsApp --> <div class="flex items-center justify-end w-1/4"> <a href="https://wa.me/51929438206?text=Hello!%20I'm%20visiting%20your%20website%20Autos%20Bas%20Dealer%20Miami%20and%20I'd%20like%20to%20get%20more%20information%20about%20your%20vehicles.%20Thank%20you!" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 rounded-full px-3 sm:px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 bg-primary text-primary-foreground h-9 sm:h-10 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg> <span class="hidden sm:inline">Contact Us</span> </a> </div> </div> <!-- Menú móvil desplegable: chat, info usuario, tema (en columna) --> <nav id="mobile-menu" class="sm:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-xl overflow-hidden transition-all duration-300 ease-out" style="max-height: 0; opacity: 0;"> <div class="container mx-auto px-4 py-4 flex flex-col gap-1"> <!-- Auth/Chat en móvil (chat primero, luego info usuario) --> ${renderComponent($$result, "ClientPortal", ClientPortal, { "client:load": true, "variant": "mobile", "client:component-hydration": "load", "client:component-path": "@/components/ClientPortal", "client:component-export": "default" })} <!-- Separador visual --> <div class="border-t border-border/40 my-1"></div> <!-- Tema claro/oscuro: último elemento --> <button id="theme-toggle-mobile" class="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all font-medium w-full text-left"> <span id="icon-sun-mobile">${renderComponent($$result, "Sun", Sun, { "size": 18 })}</span> <span id="icon-moon-mobile" style="display:none;">${renderComponent($$result, "Moon", Moon, { "size": 18 })}</span> <span id="theme-label">Light Mode</span> </button> </div> </nav> </header> <!-- Script para tema claro/oscuro, menú hamburguesa y cierre al pulsar fuera --> ${renderScript($$result, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/components/Navbar.astro", void 0);

const supabaseUrl = "https://gfxmrzwulvozkijpbihu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeG1yend1bHZvemtpanBiaWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjEwMjQsImV4cCI6MjA4OTU5NzAyNH0.YViKc0a-OYvh8CnG7DO6YLkTlul2PPbbChXAk5e0XQ4";
const supabase = createClient(supabaseUrl, supabaseAnonKey) ;

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Select$1.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Portal, { children: /* @__PURE__ */ jsxs(
    Select$1.Content,
    {
      "data-slot": "select-content",
      "data-align-trigger": position === "item-aligned",
      className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          Select$1.Viewport,
          {
            "data-position": position,
            className: cn(
              "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
              position === "popper" && ""
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx(Select$1.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" }) }) }),
        /* @__PURE__ */ jsx(Select$1.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ChevronUpIcon,
        {}
      )
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {}
      )
    }
  );
}

function SearchFilters({ marcas, anios, onMarcaChange, onAnioChange }) {
  return /* @__PURE__ */ jsx("div", { className: "bg-background rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-border/50 p-1.5 max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-4 place-items-center", children: [
    /* @__PURE__ */ jsxs(Select, { onValueChange: (val) => onMarcaChange(val === "all" ? null : val), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-10 bg-muted/30 border-none rounded-xl focus:ring-primary/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Car, { size: 16, className: "text-primary" }),
        /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Brands" })
      ] }) }),
      /* @__PURE__ */ jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Brands" }),
        marcas.map((marca) => /* @__PURE__ */ jsx(SelectItem, { value: marca.toLowerCase(), children: marca }, marca))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Select, { onValueChange: (val) => onAnioChange(val === "all" ? null : Number(val)), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-10 bg-muted/30 border-none rounded-xl focus:ring-primary/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-primary" }),
        /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Years" })
      ] }) }),
      /* @__PURE__ */ jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Years" }),
        anios.map((anio) => /* @__PURE__ */ jsx(SelectItem, { value: String(anio), children: anio }, anio))
      ] })
    ] })
  ] }) });
}

const DEFAULT_ITEMS = [];
const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };
function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });
  const esImagen = !!item.image;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: `relative shrink-0 flex flex-col ${esImagen ? "items-center justify-center rounded-[12px]" : round ? "items-center justify-center text-center bg-[#060010] border-0" : "items-start justify-between bg-[#222] border border-[#222] rounded-[12px]"} overflow-hidden cursor-grab active:cursor-grabbing`,
      style: {
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...round && { borderRadius: "50%" }
      },
      transition,
      children: esImagen ? (
        /* Imagen del vehículo ocupando todo el slide */
        /* @__PURE__ */ jsx(
          "img",
          {
            src: item.image,
            alt: item.alt ?? "",
            className: "w-full h-full object-cover",
            loading: "lazy"
          }
        )
      ) : (
        /* Contenido genérico: icono + título + descripción */
        /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: `${round ? "p-0 m-0" : "mb-4 p-5"}`, children: /* @__PURE__ */ jsx("span", { className: "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060010]", children: item.icon }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-1 font-black text-lg text-white", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-white", children: item.description })
          ] })
        ] })
      )
    },
    `${item?.id ?? index}-${index}`
  );
}
function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3e3,
  pauseOnHover = false,
  loop = false,
  round = false
}) {
  const modoImagen = items.length > 0 && items.every((item) => !!item.image);
  const containerRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  useEffect(() => {
    if (!modoImagen || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setMeasuredWidth(w);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [modoImagen]);
  const containerPadding = modoImagen ? 0 : 16;
  const effectiveWidth = modoImagen && measuredWidth > 0 ? measuredWidth : baseWidth;
  const itemWidth = effectiveWidth - containerPadding * 2;
  const effectiveGap = modoImagen ? 0 : GAP;
  const trackItemOffset = itemWidth + effectiveGap;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);
  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return void 0;
    if (pauseOnHover && isHovered) return void 0;
    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);
  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);
  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;
  const handleAnimationStart = () => {
    setIsAnimating(true);
  };
  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;
    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }
    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }
    setIsAnimating(false);
  };
  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const direction = offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1 : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    if (direction === 0) return;
    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };
  const dragProps = loop ? {} : {
    dragConstraints: {
      left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
      right: 0
    }
  };
  const activeIndex = items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);
  const goPrev = () => {
    setPosition((prev) => {
      const next = prev - 1;
      return loop ? Math.max(0, next) : Math.max(0, next);
    });
  };
  const goNext = () => {
    setPosition((prev) => {
      const next = prev + 1;
      const max = itemsForRender.length - 1;
      return Math.min(next, max);
    });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `group/carousel relative overflow-hidden ${modoImagen ? "w-full h-full p-0" : `p-4 ${round ? "rounded-full border border-white" : "rounded-[24px] border border-[#222]"}`}`,
      style: {
        ...!modoImagen && { width: `${baseWidth}px` },
        ...round && { height: `${baseWidth}px` }
      },
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "flex h-full",
            drag: isAnimating ? false : "x",
            ...dragProps,
            style: {
              width: modoImagen ? "100%" : itemWidth,
              gap: `${effectiveGap}px`,
              perspective: 1e3,
              perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
              x
            },
            onDragEnd: handleDragEnd,
            animate: { x: -(position * trackItemOffset) },
            transition: effectiveTransition,
            onAnimationStart: handleAnimationStart,
            onAnimationComplete: handleAnimationComplete,
            children: itemsForRender.map((item, index) => /* @__PURE__ */ jsx(
              CarouselItem,
              {
                item,
                index,
                itemWidth,
                round,
                trackItemOffset,
                x,
                transition: effectiveTransition
              },
              `${item?.id ?? index}-${index}`
            ))
          }
        ),
        modoImagen && items.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goPrev,
              className: "hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/70",
              "aria-label": "Imagen anterior",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goNext,
              className: "hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/70",
              "aria-label": "Imagen siguiente",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: `flex w-full justify-center ${modoImagen ? "absolute z-20 bottom-2 left-1/2 -translate-x-1/2" : round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""}`, children: /* @__PURE__ */ jsx("div", { className: `flex gap-1.5 ${modoImagen ? "" : "mt-4 w-[150px] justify-between px-8"}`, children: items.map((_, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            className: `h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${activeIndex === index ? modoImagen ? "bg-white" : round ? "bg-white" : "bg-[#333333]" : modoImagen ? "bg-white/50" : round ? "bg-[#555]" : "bg-[rgba(51,51,51,0.4)]"}`,
            animate: {
              scale: activeIndex === index ? 1.2 : 1
            },
            onClick: () => setPosition(loop ? index + 1 : index),
            transition: { duration: 0.15 }
          },
          index
        )) }) })
      ]
    }
  );
}

function prepararCardData(car) {
  const nombre = `${car.marca.trim()} ${car.modelo.trim()}`;
  const sorted = [...car.inventario_imagenes].sort((a, b) => a.orden - b.orden);
  const imagenes = sorted.filter((img) => !img.url.endsWith(".mp4")).map((img, idx) => ({
    id: idx + 1,
    image: img.url,
    alt: `${nombre} - foto ${idx + 1}`
  }));
  if (imagenes.length === 0) {
    imagenes.push({ id: 1, image: "/placeholder-car.jpg", alt: nombre });
  }
  return {
    id: car.id,
    nombre,
    imagenes,
    anio: car.anio,
    carroceria: car.carroceria ?? "Auto"
  };
}
const CarIcon = /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-muted-foreground", children: [
  /* @__PURE__ */ jsx("path", { d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" }),
  /* @__PURE__ */ jsx("circle", { cx: "7", cy: "17", r: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M9 17h6" }),
  /* @__PURE__ */ jsx("circle", { cx: "17", cy: "17", r: "2" })
] });
const VehicleCard = React.memo(function VehicleCard2({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background rounded-2xl sm:rounded-3xl h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 sm:h-56 overflow-hidden shrink-0", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-20", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center bg-primary/90 text-white font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs", children: data.carroceria }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-full", children: /* @__PURE__ */ jsx(
        Carousel,
        {
          items: data.imagenes,
          baseWidth: 400,
          autoplay: false,
          autoplayDelay: 3e3,
          pauseOnHover: true,
          loop: true,
          round: false
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs("p", { className: "text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight text-center", children: [
      data.nombre,
      " · ",
      data.anio
    ] }) })
  ] });
});
function InventoryCarousel({ cars }) {
  const cardsData = useMemo(() => cars.map(prepararCardData), [cars]);
  if (cardsData.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      CarIcon,
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg font-medium", children: "No vehicles available at this time. Check back soon!" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: cardsData.map((data) => /* @__PURE__ */ jsx(VehicleCard, { data }, data.id)) });
}

function InventoryGrid({ cars }) {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState(null);
  const marcasDisponibles = useMemo(() => {
    const filtrados = anioSeleccionado ? cars.filter((c) => c.anio === anioSeleccionado) : cars;
    return [...new Set(filtrados.map((c) => c.marca.trim()))].sort();
  }, [cars, anioSeleccionado]);
  const aniosDisponibles = useMemo(() => {
    const filtrados = marcaSeleccionada ? cars.filter((c) => c.marca.trim().toLowerCase() === marcaSeleccionada) : cars;
    return [...new Set(filtrados.map((c) => c.anio))].sort((a, b) => b - a);
  }, [cars, marcaSeleccionada]);
  const carsFiltrados = useMemo(() => {
    return cars.filter((car) => {
      const cumpleMarca = !marcaSeleccionada || car.marca.trim().toLowerCase() === marcaSeleccionada;
      const cumpleAnio = !anioSeleccionado || car.anio === anioSeleccionado;
      return cumpleMarca && cumpleAnio;
    });
  }, [cars, marcaSeleccionada, anioSeleccionado]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx(
      SearchFilters,
      {
        marcas: marcasDisponibles,
        anios: aniosDisponibles,
        onMarcaChange: setMarcaSeleccionada,
        onAnioChange: setAnioSeleccionado
      }
    ) }),
    /* @__PURE__ */ jsx(InventoryCarousel, { cars: carsFiltrados })
  ] });
}

const $$Inventory = createComponent(async ($$result, $$props, $$slots) => {
  let cars = [];
  if (supabase) {
    const { data: vehiculos, error } = await supabase.from("inventario").select(`
      id, marca, modelo, anio, precio, color_exterior, transmision,
      combustible, millaje, carroceria, down_payment,
      inventario_imagenes ( url, orden )
    `).eq("status", "disponible").order("created_at", { ascending: false });
    if (error) {
      console.error("Error al consultar inventario:", error.message);
    }
    cars = vehiculos ?? [];
  }
  const marcas = [...new Set(cars.map((c) => c.marca.trim()))].sort();
  const anios = [...new Set(cars.map((c) => c.anio))].sort((a, b) => b - a);
  return renderTemplate`${maybeRenderHead()}<section id="inventory" class="pt-20 sm:pt-20 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 bg-muted/30"> <div class="container mx-auto px-4 md:px-6"> <!-- Filtros + grilla vertical: componente React con estado compartido para filtrado dinámico --> ${renderComponent($$result, "InventoryGrid", InventoryGrid, { "client:load": true, "cars": cars, "marcas": marcas, "anios": anios, "client:component-hydration": "load", "client:component-path": "@/components/InventoryGrid", "client:component-export": "default" })} </div> </section>`;
}, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/components/Inventory.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="sticky bottom-0 z-40 bg-[#050505] text-white py-2 border-t border-white/5"> <div class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0"> <!-- Redes sociales --> <div class="flex gap-2"> <a href="#" class="bg-white/5 p-1.5 rounded-full hover:bg-primary transition-all" aria-label="Facebook"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> </a> <a href="#" class="bg-white/5 p-1.5 rounded-full hover:bg-primary transition-all" aria-label="Instagram"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg> </a> <a href="#" class="bg-white/5 p-1.5 rounded-full hover:bg-primary transition-all" aria-label="TikTok"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg> </a> <a href="https://wa.me/51929438206?text=Hello!%20I'm%20visiting%20your%20website%20Autos%20Bas%20Dealer%20Miami%20and%20I'd%20like%20to%20get%20more%20information%20about%20your%20vehicles.%20Thank%20you!" target="_blank" rel="noopener noreferrer" class="bg-white/5 p-1.5 rounded-full hover:bg-primary transition-all" aria-label="WhatsApp"> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg> </a> </div> <!-- Copyright --> <p class="text-gray-500 text-[10px] font-medium">
&copy; 2026 <span class="text-white/70 font-bold">Autos Bas Dealer Miami</span>. All rights reserved.
</p> </div> </footer>`;
}, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/components/Footer.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Autos Bas Dealer Miami | Luxury & Premium Car Sales" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex flex-col"> ${renderComponent($$result2, "Navbar", $$Navbar, {})} <main class="flex-1"> ${renderComponent($$result2, "Inventory", $$Inventory, {})} </main> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/pages/index.astro", void 0);

const $$file = "C:/Users/armne/OneDrive/Escritorio/proyectos/AutosBasDealerMiami/landing-autos-bas/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
