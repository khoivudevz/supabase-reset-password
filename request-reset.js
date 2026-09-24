const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector('#request-form');
const emailInput = document.querySelector('#email');
const submitButton = document.querySelector('#submit-button');
const message = document.querySelector('#message');

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message show ${type}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showMessage('Sending reset link...', 'info');

  // Keeps the same folder when the project is hosted in a subdirectory.
  const redirectTo = new URL('reset.html', window.location.href).href;

  const { error } = await supabaseClient.auth.resetPasswordForEmail(emailInput.value.trim(), {
    redirectTo
  });

  submitButton.disabled = false;

  if (error) {
    showMessage(error.message, 'error');
    return;
  }

  // Avoid revealing whether an email exists in the database.
  showMessage('If that email is registered, a password reset link has been sent.', 'success');
});
