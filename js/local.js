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