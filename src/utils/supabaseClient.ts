import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient(supabaseUrl, publicAnonKey);

export default supabase;
