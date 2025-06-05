import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecfhihpyvludqozrapfi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZmhpaHB5dmx1ZHFvenJhcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDk0MDgsImV4cCI6MjA2NDcyNTQwOH0.UTar3wCHCM1Pa9SopBHcQqiBxDX-CpDCaZarGBR_oAc'

export const supabase = createClient(supabaseUrl, supabaseKey)
