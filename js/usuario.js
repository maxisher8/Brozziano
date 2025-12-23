async function usuarioAll() {
    const { data, error } = await supabaseclient
        .from('usuario')
        .select('*');

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    // Mostrar los datos en el HTML
    const contenedor = document.getElementById('usuarioGroup');
    contenedor.innerHTML = '';

    data.forEach(usuario => {
        const card = `
            <div class="card-usuario" style="border: 1px solid #ccc; margin: 10px; padding: 15px;">
                <p>nombre: ${usuario.nombre}</p>
                <button onclick="eliminarUsuario('${usuario.nombre}')" style="color: red;">
                    Eliminar a ${usuario.nombre}
                </button>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

async function eliminarUsuario(nombreUsuario) {
    // Confirmación de seguridad para el usuario
    const confirmar = confirm(`¿Estás seguro de que quieres eliminar a ${nombreUsuario}?`);
    
    if (confirmar) {
        const { error } = await supabaseclient
            .from('usuario')
            .delete()
            .eq('nombre', nombreUsuario);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            alert('Usuario eliminado correctamente');
            // Recargamos la lista automáticamente para que desaparezca de la pantalla
            usuarioAll(); 
        }
    }
}

usuarioAll();