const SUPABASE_URL = 'https://nqlmntpxzbllpkelqtun.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbG1udHB4emJsbHBrZWxxdHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjYzMjIsImV4cCI6MjA4MTc0MjMyMn0.57m-tGfaglpUgnNF_OlgDQQbSZ70YUWkic7kYhmTpNs';
const BREVO_API_KEY = 'REPLACE_WITH_BREVO_API_KEY'; // Pon tu API key aquí
const BREVO_SENDER_EMAIL = 'no-reply@yourdomain.com';
const BREVO_SENDER_NAME = 'Brozziano';
const BREVO_PASSWORD_RESET_URL = window.location.origin + '/ForgotPassword.html';

const supabaseclient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

