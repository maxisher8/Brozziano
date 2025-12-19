const SUPABASE_URL = 'https://nqlmntpxzbllpkelqtun.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbG1udHB4emJsbHBrZWxxdHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjYzMjIsImV4cCI6MjA4MTc0MjMyMn0.57m-tGfaglpUgnNF_OlgDQQbSZ70YUWkic7kYhmTpNs';

const supabaseclient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// Función para traer datos de supabase
async function localall() {
    const { data, error } = await supabaseclient
        .from('local')
        .select('*');

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    // Mostrar los datos en el HTML
    const contenedor = document.getElementById('localGroup');
    contenedor.innerHTML = '';

   
    data.forEach(local => {
        //diseño de las tarjetas con los datos obtenidos
        const card = `
            <div class="card-local" style="border: 1px solid #ccc; margin: 10px; padding: 15px; border-radius: 8px;">
                <a href="/CheckList.html">${local.nombre}</a>
                <h3>${local.id}</h3>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

localall();