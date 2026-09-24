const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true
  }
});

const loadingState = document.querySelector('#loading-state');
const resetState = document.querySelector('#reset-state');
const invalidState = document.querySelector('#invalid-state');
const successState = document.querySelector('#success-state');
const form = document.querySelector('#reset-form');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const resetButton = document.querySelector('#reset-button');
const message = document.querySelector('#message');

let recoveryReady = false;
let resolvedInitialSession = false;

function showOnly(section) {
  [loadingState, resetState, invalidState, successState].forEach((item) => {
    item.classList.toggle('hidden', item !== section);
  });
}

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message show ${type}`;
}

function clearMessage() {
  message.textContent = '';
  message.className = 'message';
}

function enableResetForm() {
  recoveryReady = true;
  clearMessage();
  showOnly(resetState);
}

// PASSWORD_RECOVERY is emitted when Supabase consumes a recovery link.
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY' && session) {
    enableResetForm();
  }
});

async function initialize() {
  const { data, error } = await supabaseClient.auth.getSession();
  resolvedInitialSession = true;

  if (error) {
    showOnly(invalidState);
    return;
  }

  // Depending on flow/configuration, the recovery session may already exist
  // by the time this script runs.
  if (data.session) {
    enableResetForm();
    return;
  }

  // Give detectSessionInUrl/onAuthStateChange a brief moment to process the URL.
  setTimeout(() => {
    if (!recoveryReady && resolvedInitialSession) {
      showOnly(invalidState);
    }
  }, 1200);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password.length < 8) {
    showMessage('Password must be at least 8 characters.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Passwords do not match.', 'error');
    return;
  }

  resetButton.disabled = true;
  showMessage('Updating password...', 'info');

  const { error } = await supabaseClient.auth.updateUser({ password });

  resetButton.disabled = false;

  if (error) {
    showMessage(error.message, 'error');
    return;
  }

  await supabaseClient.auth.signOut();
  clearMessage();
  showOnly(successState);
});

initialize();
