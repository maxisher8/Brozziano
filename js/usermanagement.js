async function toggleAdmin(userId, currentAdminValue) {
    const { data, error } = await supabaseclient
        .from('usuario')
        .update({ admin: !currentAdminValue })
        .eq('id', userId)
        .select('id, admin');

    if (error) {
        alert('Error al actualizar admin: ' + error.message);
        return;
    }

    loadUsuarios();
}

async function loadUsuarios() {
    const { data, error } = await supabaseclient
        .from('usuario')
        .select('*');
    if (error) {
        console.error('Error cargando usuarios:', error);
        return;
    }
    const cont = document.getElementById('usuarioList');
    if (!data || data.length === 0) {
        cont.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }

    cont.innerHTML = data.map(u => {
        const status = u.admin ? 'Sí' : 'No';
        const buttonText = u.admin ? 'Desactivar admin' : 'Activar admin';
        return `
            <div style='border:1px solid #ccc;padding:10px;margin:5px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;'>
                <div>
                    <strong>${u.nombre}</strong> (ID: ${u.id})<br>
                    admin: ${status}
                </div>
                <button class='save-btn' onclick='toggleAdmin(${u.id}, ${u.admin})'>${buttonText}</button>
            </div>
        `;
    }).join('');
}

loadUsuarios();
