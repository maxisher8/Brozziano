async function toggleAdmin(userId, currentAdminValue) {
    const { error } = await supabaseclient
        .from('usuario')
        .update({ admin: !currentAdminValue })
        .eq('id', userId)
        .select('id, admin');

    if (error) {
        alert('Error al actualizar admin: ' + error.message);
        return;
    }

    await loadUsuarios();
}

async function loadUsuarios() {
    const { data, error } = await supabaseclient
        .from('usuario')
        .select('*');

    const cont = document.getElementById('usuarioList');
    if (!cont) return;

    if (error) {
        cont.innerHTML = `<p>Error cargando usuarios: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        cont.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }

    cont.innerHTML = data.map(u => {
        const status = u.admin ? 'Sí' : 'No';
        const buttonText = u.admin ? 'Desactivar admin' : 'Activar admin';
        return `
            <div class="usuario-card">
                <div>
                    <strong>${u.nombre || 'Usuario'}</strong> (ID: ${u.id})<br>
                    <span>admin: ${status}</span>
                </div>
                <button class="save-btn" onclick="toggleAdmin(${u.id}, ${u.admin})">${buttonText}</button>
            </div>
        `;
    }).join('');
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('usuarioList')) {
        loadUsuarios();
    }
});
