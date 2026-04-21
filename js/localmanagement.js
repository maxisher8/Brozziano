async function loadLocalesAdmin() {
  const localesList = document.getElementById('localesList');
  localesList.innerHTML = 'Cargando locales...';

  const { data, error } = await supabaseclient.from('local').select('*').order('nombre', { ascending: true });
  if (error) {
    localesList.innerHTML = `<div class="error">Error cargando locales: ${error.message}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    localesList.innerHTML = '<div>No hay locales registrados.</div>';
    return;
  }

  localesList.innerHTML = '';
  data.forEach((local) => {
    const row = document.createElement('div');
    row.className = 'locale-row';
    row.innerHTML = `
      <div class="locale-name">${local.nombre}</div>
      <div class="locale-address">${local.direccion || 'Sin dirección'}</div>
      <button class="secondary" data-id="${local.id}">Eliminar</button>
    `;

    row.querySelector('button').addEventListener('click', async () => {
      await deleteLocale(local.id);
    });

    localesList.appendChild(row);
  });
}

async function deleteLocale(localId) {
  if (!confirm('¿Eliminar este local? Esta acción no se puede deshacer.')) {
    return;
  }

  const { error } = await supabaseclient.from('local').delete().eq('id', localId);
  if (error) {
    alert('No se pudo eliminar el local: ' + error.message);
    return;
  }

  loadLocalesAdmin();
}

async function createLocale(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombreLocal').value.trim();
  const direccion = document.getElementById('direccionLocal').value.trim();
  const message = document.getElementById('localeMessage');

  if (!nombre) {
    message.textContent = 'El nombre del local es obligatorio.';
    return;
  }

  const { error } = await supabaseclient.from('local').insert([{ nombre, direccion }]);
  if (error) {
    message.textContent = 'No se pudo crear el local: ' + error.message;
    return;
  }

  message.textContent = 'Local agregado correctamente.';
  event.target.reset();
  loadLocalesAdmin();
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newLocaleForm');
  form.addEventListener('submit', createLocale);
  loadLocalesAdmin();
});
