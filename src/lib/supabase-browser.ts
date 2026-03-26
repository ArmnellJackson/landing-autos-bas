/* Cliente de Supabase para el navegador: usa createBrowserClient de @supabase/ssr
   para mantener la sesión del usuario autenticado en componentes React (islands). */
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
