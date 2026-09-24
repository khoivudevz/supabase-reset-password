# Supabase Reset Password - HTML/CSS/JS

A minimal password recovery flow using Supabase Auth and plain HTML/CSS/JavaScript.

## Files

- `index.html` - request reset email
- `reset.html` - set a new password after clicking the email link
- `request-reset.js` - calls `resetPasswordForEmail`
- `reset-password.js` - reads the recovery session and calls `updateUser`
- `config.js` - Supabase project URL and anon/publishable key
- `styles.css` - shared UI

## 1. Configure Supabase

Edit `config.js`:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY"
};
```

Use the project's browser-safe anon/publishable key. Never put the service-role key in frontend code.

## 2. Configure redirect URLs

In Supabase Dashboard:

`Authentication -> URL Configuration`

For this local example add:

- Site URL: `http://localhost:5500`
- Redirect URL: `http://localhost:5500/reset.html`

For production, add your real reset URL, for example:

`https://example.com/reset.html`

## 3. Email template

The Recovery email can keep using:

```html
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

Supabase will generate the verification link and then redirect the browser to the `redirectTo` URL supplied by `resetPasswordForEmail()`.

## 4. Run locally

From this folder:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

Do not test by double-clicking `index.html` as a `file://` URL.

## Flow

1. User enters email in `index.html`.
2. Supabase sends a recovery email.
3. User clicks `{{ .ConfirmationURL }}`.
4. Supabase verifies the recovery token and redirects to `reset.html`.
5. Supabase JS restores the recovery session from the redirect URL.
6. User enters a new password.
7. `supabase.auth.updateUser({ password })` updates it.
8. The demo signs the user out after success.
