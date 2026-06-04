import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Real client only when env vars are present
export const supabase =
  supabaseUrl && supabaseAnon
    ? createClient(supabaseUrl, supabaseAnon)
    : null;

export const isSupabaseEnabled = Boolean(supabase);

if (!supabase) {
  console.warn(
    'Kannada Seva: Supabase env vars missing — using mock auth. ' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable real auth.'
  );
}
