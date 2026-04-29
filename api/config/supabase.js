import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Check .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection on startup
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count()', { count: 'exact' });
    if (error) {
      console.log('⚠️  Products table not found (will be created on setup)');
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
  }
}
