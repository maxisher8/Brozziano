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
    if (confirmed) {
        // Aquí irá la funcionalidad de eliminación
        alert('Checklist eliminado (funcionalidad pendiente)');
    }
});

document.getElementById('uploadBtn').addEventListener('click', () => {
    alert('Checklist subido exitosamente (funcionalidad pendiente)');
});