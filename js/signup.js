document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert('Completa todos los campos.');
        return;
    }

    const { data, error } = await supabaseclient.auth.signUp({
        email,
        password,
    }, {
        options: {
            emailRedirectTo: window.location.origin + '/Login.html',
        },
    });

    if (error) {
        alert('Error al registrarse: ' + error.message);
        return;
    }

    const authUid = data?.user?.id || data?.session?.user?.id;
    if (!authUid) {
        alert('Registro completado. Si no recibes correo, revisa la configuración de email en Supabase o Brevo.');
        window.location.href = '/Login.html';
        return;
    }
    const { data: insertData, error: insertError } = await supabaseclient
        .from('usuario')
        .insert({ nombre: name, admin: false, auth_uid: authUid })
        .select('id')
        .single();

    if (insertError) {
        alert('Registro de auth exitoso, pero error guardando usuario: ' + insertError.message);
        return;
    }

    try {
        await sendValidationEmail(email, name);
        alert('Registro exitoso. Se envió un correo de validación.');
    } catch (brevoError) {
        console.warn('No se pudo enviar el correo de validación:', brevoError);
        alert('Registro exitoso, pero no se pudo enviar el correo de validación adicional. Revisa tu usuario en el panel.');
    }

    window.location.href = '/Login.html';
});