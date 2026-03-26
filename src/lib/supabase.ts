/* Cliente de Supabase: inicializa la conexión usando las variables de entorno públicas del proyecto.
   Valida que las variables existan antes de crear el cliente para evitar errores en build. */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables de entorno de Supabase no configuradas. PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY son requeridas.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
