async function cargaCategoria() {
    const params = new URLSearchParams(window.location.search);
    const preguntaId = params.get('id');
    const localId = params.get('localId') || 'default';

    if (!preguntaId) {
        document.getElementById('preguntaTitle').textContent = 'Pregunta no especificada';
        return;
    }

    const { data, error } = await supabaseclient
        .from('pregunta')
        .select('texto_pregunta')
        .eq('id', preguntaId)
        .single();

    if (error) {
        console.error('Error al cargar pregunta:', error);
        document.getElementById('preguntaTitle').textContent = 'Error cargando pregunta';
        return;
    }

    document.getElementById('preguntaTitle').textContent = data.texto_pregunta;
    // Guardar localId y preguntaId para evento input
    document.body.dataset.localId = localId;
    document.body.dataset.preguntaId = preguntaId;

    const observacionKey = `observacion-${localId}-${preguntaId}`;
    const observacionGuardada = localStorage.getItem(observacionKey);
    console.log('Cargando observacion para key:', observacionKey, 'valor:', observacionGuardada);
    if (observacionGuardada) {
        document.getElementById('observaciones').value = observacionGuardada;
        console.log('Seteando value en textarea:', observacionGuardada);
    }

    const observacionesElement = document.getElementById('observaciones');
    observacionesElement.oninput = (event) => {
        localStorage.setItem(observacionKey, event.target.value);
        console.log('Guardando observacion oninput:', observacionKey, event.target.value);
    };
}

document.getElementById('saveCatBtn').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const localId = params.get('localId');
    window.location.href = '/CheckList.html?localId=' + localId;
});

cargaCategoria();