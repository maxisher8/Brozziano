const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const forgotMessage = document.getElementById('forgotMessage');

forgotPasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  forgotMessage.textContent = 'Procesando...';

  const email = document.getElementById('email').value.trim();
  if (!email) {
    forgotMessage.textContent = 'Ingresa un correo válido.';
    return;
  }

  const { data, error } = await supabaseclient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/Login.html',
  });

  if (error) {
    forgotMessage.textContent = 'No se pudo enviar el enlace: ' + error.message;
    return;
  }

  try {
    await sendPasswordResetEmail(email);
    forgotMessage.textContent = 'Revisa tu correo. Hemos enviado instrucciones para restablecer tu contraseña.';
  } catch (brevoError) {
    forgotMessage.textContent = 'El enlace de recuperación se envió, pero no pudimos notificar vía email adicional. ' + brevoError.message;
  }
});
