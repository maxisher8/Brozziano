document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabaseclient.auth.signInWithPassword({ email, password });
    if (error) {
        alert('Error al iniciar sesión: ' + error.message);
    } else {
        alert('Sesión iniciada correctamente');
        window.location.href = '/Index.html';
    }
});