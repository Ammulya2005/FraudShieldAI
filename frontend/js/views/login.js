import { API } from '../api.js';
import { AuthState } from '../auth.js';

export function renderLogin() {
  return `
    <div style="max-width: 420px; margin: 5rem auto;" class="card">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img class="login-logo" src="assets/images/Fraud_logo.jpeg" alt="FraudShield AI logo" />
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">FraudShield<span style="color:var(--accent-primary);">AI</span></h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Real-Time Financial Anomaly Detection</p>
      </div>
      <form id="login-form">
        <div class="form-group">
          <label for="username">Username or Email</label>
          <input type="text" id="username" class="form-control" placeholder="analyst@fraudshield.ai" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-field">
            <input type="password" id="password" class="form-control" placeholder="••••••••" required />
            <button type="button" id="toggle-password" class="password-toggle" aria-label="Show password" title="Show password">Show</button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Log In</button>
      </form>
    </div>
  `;
}

export function initLoginEvents(navigate) {
  const form = document.getElementById('login-form');
  if (!form) return;

  const password = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');
  togglePassword.addEventListener('click', () => {
    const isVisible = password.type === 'text';
    password.type = isVisible ? 'password' : 'text';
    togglePassword.textContent = isVisible ? 'Show' : 'Hide';
    togglePassword.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
    togglePassword.setAttribute('title', isVisible ? 'Show password' : 'Hide password');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    try {
      const tokenData = await API.login(u, p);
      AuthState.setToken(tokenData);
      await AuthState.init();
      navigate('/dashboard');
    } catch (err) {
      alert(`Authentication failed: ${err.message}`);
    }
  });
}