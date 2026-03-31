async function preguntaAll() {
    const urlParams = new URLSearchParams(window.location.search);
    const localId = urlParams.get('localId') || 'default';

    // Obtener nombre del local
    if (localId !== 'default') {
        const { data, error } = await supabaseclient
            .from('local')
            .select('nombre')
            .eq('id', localId);

        if (data && data[0]) {
            document.getElementById('localName').textContent = data[0].nombre;
        }
    }

    const { data, error } = await supabaseclient
        .from('pregunta')
        .select('*');

    if (error) {
        console.error('Error al conectar:', error.message);
    } else {
        console.log('Conexión exitosa. Datos:', data);
    }

    window.preguntas = data; // Guardar datos globalmente
    renderPreguntas(data);
}

function renderPreguntas(preguntas) {
    // Mostrar los datos en el HTML
    const contenedor = document.getElementById('preguntaGroup');
    contenedor.innerHTML = '';

    preguntas.forEach(pregunta => {
        // Crear elementos con DOM
        const card = document.createElement('div');
        card.className = 'card-pregunta';
        card.style.border = '1px solid #ccc';
        card.style.margin = '10px';
        card.style.padding = '15px';
        card.style.display = 'flex';
        card.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `check-${pregunta.id}`;
        checkbox.style.marginRight = '10px';
        // Cargar estado desde localStorage con localId
        const urlParams = new URLSearchParams(window.location.search);
        const localId = urlParams.get('localId') || 'default';
        checkbox.checked = localStorage.getItem(`checkbox-${localId}-${pregunta.id}`) === 'true';
        // Guardar estado al cambiar
        checkbox.addEventListener('change', () => {
            localStorage.setItem(`checkbox-${localId}-${pregunta.id}`, checkbox.checked);
        });

        const span = document.createElement('span');
        span.textContent = pregunta.texto_pregunta;

        const button = document.createElement('button');
        button.textContent = '→';
        button.style.marginLeft = 'auto';
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.fontSize = '20px';
        button.style.cursor = 'pointer';
        button.onclick = () => irAInfoCat(pregunta.id);

        card.appendChild(checkbox);
        card.appendChild(span);
        card.appendChild(button);

        contenedor.appendChild(card);
    });
}

function irAInfoCat(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const localId = urlParams.get('localId');
    window.location.href = `/InfoCat.html?id=${id}&localId=${localId}`;
}

preguntaAll();

document.getElementById('searchInput').addEventListener('input', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.preguntas.filter(pregunta => pregunta.texto_pregunta.toLowerCase().includes(query));
    renderPreguntas(filtered);
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar el checklist de este local?');
    if (!confirmed) return;

    const urlParams = new URLSearchParams(window.location.search);
    const localId = urlParams.get('localId') || 'default';

    // Limpiar estado de checkboxes almacenado en localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`checkbox-${localId}-`)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Desmarcar todas las casillas visibles
    const checkboxElements = document.querySelectorAll('#preguntaGroup input[type="checkbox"]');
    checkboxElements.forEach((checkbox) => {
        checkbox.checked = false;
    });

    alert('Checklist eliminado. Todas las casillas se han desmarcado.');
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const confirmed = confirm('¿Deseas subir el checklist actual a la base de datos?');
    if (!confirmed) return;

    const { data: { session } } = await supabaseclient.auth.getSession();
    if (!session || !session.user) {
        alert('Sesión expirada. Inicia sesión nuevamente.');
        window.location.href = '/Login.html';
        return;
    }

    const authUid = session.user.id;
    const { data: userProfil, error: userError } = await supabaseclient
        .from('usuario')
        .select('id')
        .eq('auth_uid', authUid)
        .single();

    if (userError || !userProfil) {
        alert('No se encontró el perfil de usuario. Inicia sesión nuevamente.');
        window.location.href = '/Login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const localId = Number(urlParams.get('localId'));
    if (!localId) {
        alert('ID de local inválido.');
        return;
    }

    const revisionPayload = {
        hora_entrada: Date.now() / 1000,
        hora_salida: null,
        fecha: new Date().toISOString(),
        id_usuario: userProfil.id,
        id_local: localId
    };

    const { data: revisionData, error: revisionError } = await supabaseclient
        .from('revision')
        .insert(revisionPayload)
        .select('id')
        .single();

    if (revisionError || !revisionData) {
        console.error('Error creando revision:', revisionError);
        alert('No se pudo crear la revisión. Revisa consola.');
        return;
    }

    const respuestas = window.preguntas.map((pregunta) => {
        const enabled = localStorage.getItem(`checkbox-${localId}-${pregunta.id}`) === 'true';
        const observacion = localStorage.getItem(`observacion-${localId}-${pregunta.id}`) || '';
        return {
            id_revision: revisionData.id,
            id_pregunta: pregunta.id,
            observacion,
            enabled,
            fotos: ''
        };
    });

    const { error: respuestaError } = await supabaseclient
        .from('respuesta')
        .insert(respuestas);

    if (respuestaError) {
        console.error('Error creando respuestas:', respuestaError);
        alert('No se pudo subir el checklist. Revisa consola.');
        return;
    }

    // Limpiar estado local
    window.preguntas.forEach((pregunta) => {
        localStorage.removeItem(`checkbox-${localId}-${pregunta.id}`);
        localStorage.removeItem(`observacion-${localId}-${pregunta.id}`);
    });

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`checkbox-${localId}-`)) {
            keysToRemove.push(key);
        }
        if (key && key.startsWith(`observacion-${localId}-`)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    alert('Checklist subido con éxito');
    window.location.reload();
});