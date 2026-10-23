import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

export const isConfigured = () => SUPABASE_URL.startsWith('https://');

// Każdy telefon ma anonimowe konto. Nie trzeba e-maila ani hasła.
export async function ensureSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: d, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return d.session;
}
