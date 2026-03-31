document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabaseclient.auth.signUp({ email, password });
    if (error) {
        alert('Error al registrarse: ' + error.message);
    } else if (data.user) {
        const authUid = data.user.id;
        const { data: insertData, error: insertError } = await supabaseclient
            .from('usuario')
            .insert({ nombre: name, admin: false, auth_uid: authUid })
            .select('id')
            .single();
        if (insertError) {
            alert('Registro de auth exitoso, pero error guardando usuario: ' + insertError.message);
        } else {
            alert('Registro exitoso. Iniciando sesión automáticamente.');
            await supabaseclient.auth.signInWithPassword({ email, password });
            window.location.href = '/Index.html';
        }
    }
});