
async function localall() {
    const { data, error } = await supabaseclient
        .from('local')
        .select('*');

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    window.locales = data; // Guardar datos globalmente
    renderLocales(data);
}

function renderLocales(locales) {
    // Mostrar los datos en el HTML
    const contenedor = document.getElementById('localGroup');
    contenedor.innerHTML = '';

   
    locales.forEach(local => {
        //diseño de las tarjetas con los datos obtenidos
        const card = `
            <div style="display: flex; align-items: center; margin: 10px;">
                <div class="card-local" style="border: 1px solid #ccc; margin: 10px; padding: 15px; border-radius: 8px; flex: 1;">
                    <a href="/CheckList.html?localId=${local.id}">${local.nombre}</a>
                    <h3>${local.id}</h3>
                </div>
                <button onclick="window.location.href='/CheckList.html?localId=${local.id}';" style="margin-left: 10px; background: #800000; color: white; border: none; padding: 10px; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">+</button>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

async function GetAllFromLocal(IdLocal) {
    const { data, error } = await supabaseclient
        .from('local')
        .select('*')
        .eq('id', IdLocal);

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    window.locales = data; // Guardar datos globalmente
    renderLocales(data);
}

localall();

document.getElementById('searchInput').addEventListener('input', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.locales.filter(local => local.nombre.toLowerCase().includes(query));
    renderLocales(filtered);
});