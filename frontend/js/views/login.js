import { API } from '../api.js';
import { AuthState } from '../auth.js';


export function renderLogin() {

  return `
    <div class="login-page">

      <!-- =================================================
           LEFT - FRAUDSHIELD AI INFORMATION
           ================================================= -->

      <section class="login-hero">

        <div class="login-hero-content">

          <div class="login-brand">

            <img
              src="assets/images/Fraud_logo.jpeg"
              alt="FraudShield AI logo"
              class="login-hero-logo"
            />

            <div class="login-brand-name">
              FraudShield<span>AI</span>
            </div>

          </div>


          <div class="login-hero-text">

            <div class="login-security-badge">
              <span class="security-pulse"></span>
              AI-POWERED FRAUD DETECTION
            </div>


            <h1>
              Protect every
              <span>transaction.</span>
            </h1>


            <p class="login-tagline">
              Detect suspicious financial activity in real time
              before it becomes a threat.
            </p>


            <p class="login-description">
              FraudShield AI combines machine learning, anomaly
              detection and real-time transaction monitoring to
              identify high-risk activity faster.
            </p>

          </div>


          <!-- =================================================
               ANIMATED NETWORK
               ================================================= -->

          <div class="fraud-network">

            <div class="network-grid"></div>

            <svg
              class="network-lines"
              viewBox="0 0 600 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >

              <line x1="70" y1="150" x2="190" y2="80" />
              <line x1="70" y1="150" x2="190" y2="220" />

              <line x1="190" y1="80" x2="310" y2="150" />
              <line x1="190" y1="220" x2="310" y2="150" />

              <line x1="310" y1="150" x2="430" y2="80" />
              <line x1="310" y1="150" x2="430" y2="220" />

              <line x1="430" y1="80" x2="540" y2="150" />
              <line x1="430" y1="220" x2="540" y2="150" />

            </svg>


            <div class="network-node node-1">
              <span></span>
            </div>

            <div class="network-node node-2">
              <span></span>
            </div>

            <div class="network-node node-3">
              <span></span>
            </div>


            <div class="network-shield">

              <div class="shield-glow"></div>

              <div class="shield-icon">
                🛡
              </div>

            </div>


            <div class="network-node node-4">
              <span></span>
            </div>

            <div class="network-node node-5">
              <span></span>
            </div>

            <div class="network-node node-6">
              <span></span>
            </div>

          </div>


          <!-- =================================================
               FEATURES
               ================================================= -->

          <div class="login-features">

            <div class="login-feature">

              <div class="feature-icon">
                ⚡
              </div>

              <div>
                <strong>Real-Time Monitoring</strong>
                <span>Continuous transaction surveillance</span>
              </div>

            </div>


            <div class="login-feature">

              <div class="feature-icon">
                🧠
              </div>

              <div>
                <strong>AI Risk Scoring</strong>
                <span>XGBoost & Isolation Forest intelligence</span>
              </div>

            </div>


            <div class="login-feature">

              <div class="feature-icon">
                🚨
              </div>

              <div>
                <strong>Instant Alerts</strong>
                <span>Identify suspicious activity automatically</span>
              </div>

            </div>

          </div>


          <div class="login-hero-footer">
            <span class="footer-dot"></span>
            Secure AI Detection Platform
          </div>

        </div>

      </section>


      <!-- =================================================
           RIGHT - LOGIN FORM
           ================================================= -->

      <section class="login-panel">

        <div class="login-card">

          <div class="login-mobile-brand">

            <img
              src="assets/images/Fraud_logo.jpeg"
              alt="FraudShield AI logo"
            />

            <h2>
              FraudShield<span>AI</span>
            </h2>

          </div>


          <div class="login-heading">

            <div class="login-welcome-icon">
              🔐
            </div>

            <div>
              <h2>Welcome Back</h2>

              <p>
                Sign in to access your fraud detection dashboard.
              </p>
            </div>

          </div>


          <div class="login-security-message">

            <span class="security-check">
              ✓
            </span>

            <span>
              Your session is protected by secure authentication.
            </span>

          </div>


          <form id="login-form">

            <div class="form-group">

              <label for="username">
                Username or Email
              </label>

              <input
                type="text"
                id="username"
                class="form-control"
                placeholder="analyst@fraudshield.ai"
                autocomplete="username"
                required
              />

            </div>


            <div class="form-group">

              <label for="password">
                Password
              </label>

              <div class="password-field">

                <input
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />

                <button
                  type="button"
                  id="toggle-password"
                  class="password-toggle"
                  aria-label="Show password"
                  title="Show password"
                >
                  Show
                </button>

              </div>

            </div>


            <button
              type="submit"
              class="btn btn-primary login-submit"
            >

              <span>
                Log In
              </span>

              <span class="login-arrow">
                →
              </span>

            </button>

          </form>


          <div class="login-divider">
            <span>SECURE ACCESS</span>
          </div>


          <div class="login-form-footer">

            <span class="login-status-dot"></span>

            FraudShield AI Detection Engine

          </div>

        </div>

      </section>

    </div>
  `;
}


export function initLoginEvents(navigate) {

  const form =
    document.getElementById(
      'login-form'
    );

  if (!form) return;


  const password =
    document.getElementById(
      'password'
    );


  const togglePassword =
    document.getElementById(
      'toggle-password'
    );


  togglePassword?.addEventListener(
    'click',
    () => {

      const isVisible =
        password.type === 'text';


      password.type =
        isVisible
          ? 'password'
          : 'text';


      togglePassword.textContent =
        isVisible
          ? 'Show'
          : 'Hide';


      togglePassword.setAttribute(
        'aria-label',
        isVisible
          ? 'Show password'
          : 'Hide password'
      );


      togglePassword.setAttribute(
        'title',
        isVisible
          ? 'Show password'
          : 'Hide password'
      );

    }
  );


  form.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();


      const u =
        document
          .getElementById('username')
          .value
          .trim();


      const p =
        document
          .getElementById('password')
          .value;


      const submitButton =
        form.querySelector(
          '.login-submit'
        );


      try {

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.innerHTML = `
            <span class="login-spinner"></span>
            <span>Authenticating...</span>
          `;

        }


        const tokenData =
          await API.login(
            u,
            p
          );


        AuthState.setToken(
          tokenData
        );


        await AuthState.init();


        navigate(
          '/dashboard'
        );


      } catch (err) {

        console.error(
          'Authentication error:',
          err
        );


        alert(
          `Authentication failed: ${err.message}`
        );


        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML = `
            <span>Log In</span>
            <span class="login-arrow">→</span>
          `;

        }

      }

    }
  );
}