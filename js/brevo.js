async function sendBrevoMail(toEmail, subject, htmlContent, textContent) {
  if (!BREVO_API_KEY || BREVO_API_KEY === 'REPLACE_WITH_BREVO_API_KEY') {
    throw new Error('Brevo API key is required in config.js');
  }

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    to: [{ email: toEmail }],
    subject,
    htmlContent,
    textContent,
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo send failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

async function sendValidationEmail(email, name) {
  const subject = 'Valida tu cuenta en Brozziano';
  const htmlContent = `<!DOCTYPE html>
  <html>
    <body>
      <p>Hola ${name || 'amigo'},</p>
      <p>Gracias por registrarte en Brozziano.</p>
      <p>Para finalizar tu registro, por favor confirma tu dirección de correo electrónico.</p>
      <p>Si aún no has iniciado sesión, vuelve a abrir la aplicación e inicia sesión con tu correo.</p>
      <p>Gracias,<br/>El equipo de Brozziano</p>
    </body>
  </html>`;
  const textContent = `Hola ${name || 'amigo'},\n\nGracias por registrarte en Brozziano. Para finalizar tu registro, por favor confirma tu dirección de correo electrónico.\n\nSi aún no has iniciado sesión, vuelve a abrir la aplicación e inicia sesión con tu correo.\n\nGracias,\nEl equipo de Brozziano`;

  return sendBrevoMail(email, subject, htmlContent, textContent);
}

async function sendPasswordResetEmail(email) {
  const subject = 'Solicitud de restablecimiento de contraseña';
  const htmlContent = `<!DOCTYPE html>
  <html>
    <body>
      <p>Hola,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p>Si no iniciaste esta solicitud, ignora este correo.</p>
      <p>Para restablecerla, visita este enlace:</p>
      <p><a href="${BREVO_PASSWORD_RESET_URL}">${BREVO_PASSWORD_RESET_URL}</a></p>
      <p>Gracias,<br/>El equipo de Brozziano</p>
    </body>
  </html>`;
  const textContent = `Hola,\n\nHemos recibido una solicitud para restablecer tu contraseña. Si no iniciaste esta solicitud, ignora este correo.\n\nPara restablecerla, visita este enlace: ${BREVO_PASSWORD_RESET_URL}\n\nGracias,\nEl equipo de Brozziano`;

  return sendBrevoMail(email, subject, htmlContent, textContent);
}
