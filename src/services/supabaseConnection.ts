import { createClient } from '@supabase/supabase-js'

// CORRIGIDO: Agora aponta para o subdomínio correto do seu projeto ("mtesplmwdukyabotmbry")
const supabaseUrl = 'https://mtesplmwdukyabotmbry.supabase.co'

// Sua chave anon permanente
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZXNwbG13ZHVreWFib3RtYnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NzYwNzMsImV4cCI6MjEwMTM1MjA3M30._k-_h57V74z0eZf_oyMZ9XLrpIkWNcCL271FRNqnXuE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
