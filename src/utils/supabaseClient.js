import { createClient } from "@supabase/supabase-js/dist/index.cjs";
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = "https://wzdxstvsulbqdmevuumb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZHhzdHZzdWxicWRtZXZ1dW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQzNjgsImV4cCI6MjA5MjU0MDM2OH0.p73fT0e2zXgOj7ewomX-J0O-j-kOF5NvIAdKLj9lYpc"
export const supabase_client = createClient(supabaseUrl, supabaseKey);