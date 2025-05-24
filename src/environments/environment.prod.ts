declare const process: {
  env: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
};

export const environment = {
  production: true,
  supabaseUrl: process.env['SUPABASE_URL'] || '',
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] || ''
};
