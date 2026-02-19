/**
 * Cliente Supabase - usa createClient do script UMD carregado no index.html
 * Se URL/key estiverem vazios ou script não carregou, supabase fica null
 */
const SUPABASE_URL = typeof window !== 'undefined' ? (window.SUPABASE_URL || '') : '';
const SUPABASE_ANON_KEY = typeof window !== 'undefined' ? (window.SUPABASE_ANON_KEY || '') : '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('seu-projeto')) {
  try {
    if (typeof window !== 'undefined' && window.supabase) {
      const { createClient } = window.supabase;
      if (typeof createClient === 'function') {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
    }
  } catch (e) {
    console.warn('Supabase: erro ao criar client.', e);
  }
}

export { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
