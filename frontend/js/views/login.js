import { API } from '../api.js';
import { AuthState } from '../auth.js';


// ============================================================
// LOGIN THEME STYLES
// ============================================================

const LOGIN_THEME_STYLE_ID =
  "fraudshield-login-theme-style";


function injectLoginThemeStyles() {

  if (
    document.getElementById(
      LOGIN_THEME_STYLE_ID
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    LOGIN_THEME_STYLE_ID;


  style.textContent = `

    /* ========================================================
       THEME BUTTON
       ======================================================== */

    .login-theme-toggle {

      position: absolute;

      top: 22px;
      right: 25px;

      z-index: 50;

      height: 40px;

      display: inline-flex;
      align-items: center;
      gap: 8px;

      padding: 0 13px;

      border: 1px solid #dce5f1;
      border-radius: 10px;

      background: rgba(255, 255, 255, 0.90);

      color: #18243b;

      font-family: inherit;

      font-size: 10px;
      font-weight: 750;

      cursor: pointer;

      box-shadow:
        0 8px 25px rgba(20, 48, 85, 0.08);

      backdrop-filter: blur(12px);

      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }


    .login-theme-toggle:hover {

      transform: translateY(-2px);

      border-color: #347ff1;

      box-shadow:
        0 12px 30px rgba(20, 48, 85, 0.13);
    }


    .login-theme-icon {

      width: 21px;
      height: 21px;

      display: grid;
      place-items: center;

      border-radius: 50%;

      background: rgba(52, 127, 241, 0.10);

      color: #347ff1;

      font-size: 12px;
    }


    /* ========================================================
       DARK LOGIN PAGE
       ======================================================== */

    [data-theme="dark"] .login-page {

      background:
        radial-gradient(
          circle at 20% 20%,
          rgba(52, 127, 241, 0.15),
          transparent 30%
        ),
        #07111f !important;

      color: #edf5ff;
    }


    [data-theme="dark"] .login-panel {

      background: #0b1728 !important;

      color: #edf5ff;
    }


    [data-theme="dark"] .login-card {

      background:
        rgba(14, 27, 45, 0.94) !important;

      border-color: #223750 !important;

      color: #edf5ff;

      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.35);
    }


    [data-theme="dark"] .login-heading h2,
    [data-theme="dark"] .login-mobile-brand h2 {

      color: #edf5ff !important;
    }


    [data-theme="dark"] .login-heading p,
    [data-theme="dark"] .login-description,
    [data-theme="dark"] .login-tagline {

      color: #9aacc3 !important;
    }


    [data-theme="dark"] .form-group label {

      color: #cbd8e8 !important;
    }


    [data-theme="dark"] .form-control {

      background: #091525 !important;

      border-color: #29415d !important;

      color: #edf5ff !important;
    }


    [data-theme="dark"] .form-control::placeholder {

      color: #687c95 !important;
    }


    [data-theme="dark"] .form-control:focus {

      border-color: #347ff1 !important;

      box-shadow:
        0 0 0 3px
        rgba(52, 127, 241, 0.14) !important;
    }


    [data-theme="dark"] .login-security-message {

      background: rgba(52, 127, 241, 0.08) !important;

      border-color: #29415d !important;

      color: #a8bad0 !important;
    }


    [data-theme="dark"] .login-divider {

      border-color: #263b54 !important;
    }


    [data-theme="dark"] .login-divider span {

      background: #0e1b2d !important;

      color: #71869f !important;
    }


    [data-theme="dark"] .login-form-footer {

      color: #71869f !important;
    }


    [data-theme="dark"] .login-theme-toggle {

      background:
        rgba(14, 27, 45, 0.94);

      border-color: #29415d;

      color: #edf5ff;

      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.28);
    }


    [data-theme="dark"] .login-theme-icon {

      background:
        rgba(57, 217, 255, 0.10);

      color: #39d9ff;
    }


    /* ========================================================
       DARK LEFT SIDE
       ======================================================== */

    [data-theme="dark"] .login-hero {

      background:
        radial-gradient(
          circle at 50% 40%,
          rgba(52, 127, 241, 0.13),
          transparent 42%
        ),
        #07111f !important;
    }


    [data-theme="dark"] .login-hero-text h1 {

      color: #edf5ff !important;
    }


    [data-theme="dark"] .login-feature {

      background:
        rgba(14, 27, 45, 0.65) !important;

      border-color: #223750 !important;

      color: #edf5ff;
    }


    [data-theme="dark"] .login-feature span {

      color: #8ea2ba !important;
    }


    /* ========================================================
       MOBILE
       ======================================================== */

    @media (max-width: 700px) {

      .login-theme-toggle {

        top: 15px;
        right: 15px;

        height: 36px;

        padding: 0 10px;
      }

      .login-theme-toggle
      .login-theme-text {

        display: none;
      }

    }

  `;


  document.head.appendChild(style);
}



// ============================================================
// THEME SYSTEM
// ============================================================

function applyTheme(theme) {

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );


  localStorage.setItem(
    "fraudshield-theme",
    theme
  );


  const icon =
    document.querySelector(
      ".login-theme-icon"
    );


  const text =
    document.querySelector(
      ".login-theme-text"
    );


  const button =
    document.querySelector(
      "#login-theme-toggle"
    );


  if (theme === "dark") {

    if (icon) {
      icon.textContent = "☀";
    }

    if (text) {
      text.textContent = "Light";
    }

    button?.setAttribute(
      "aria-label",
      "Switch to light theme"
    );

    button?.setAttribute(
      "title",
      "Switch to light theme"
    );

  } else {

    if (icon) {
      icon.textContent = "☾";
    }

    if (text) {
      text.textContent = "Dark";
    }

    button?.setAttribute(
      "aria-label",
      "Switch to dark theme"
    );

    button?.setAttribute(
      "title",
      "Switch to dark theme"
    );

  }

}



// ============================================================
// RENDER LOGIN
// ============================================================

export function renderLogin() {

  injectLoginThemeStyles();


  return `

    <div class="login-page">


      <!-- =================================================
           THEME SWITCHER
           ================================================= -->

      <button
        type="button"
        id="login-theme-toggle"
        class="login-theme-toggle"
        aria-label="Switch theme"
        title="Switch theme"
      >

        <span class="login-theme-icon">
          ☾
        </span>

        <span class="login-theme-text">
          Dark
        </span>

      </button>


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

              <line
                x1="70"
                y1="150"
                x2="190"
                y2="80"
              />

              <line
                x1="70"
                y1="150"
                x2="190"
                y2="220"
              />

              <line
                x1="190"
                y1="80"
                x2="310"
                y2="150"
              />

              <line
                x1="190"
                y1="220"
                x2="310"
                y2="150"
              />

              <line
                x1="310"
                y1="150"
                x2="430"
                y2="80"
              />

              <line
                x1="310"
                y1="150"
                x2="430"
                y2="220"
              />

              <line
                x1="430"
                y1="80"
                x2="540"
                y2="150"
              />

              <line
                x1="430"
                y1="220"
                x2="540"
                y2="150"
              />

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

                <strong>
                  Real-Time Monitoring
                </strong>

                <span>
                  Continuous transaction surveillance
                </span>

              </div>

            </div>


            <div class="login-feature">

              <div class="feature-icon">
                🧠
              </div>

              <div>

                <strong>
                  AI Risk Scoring
                </strong>

                <span>
                  XGBoost & Isolation Forest intelligence
                </span>

              </div>

            </div>


            <div class="login-feature">

              <div class="feature-icon">
                🚨
              </div>

              <div>

                <strong>
                  Instant Alerts
                </strong>

                <span>
                  Identify suspicious activity automatically
                </span>

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

              <h2>
                Welcome Back
              </h2>

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
            <span>
              SECURE ACCESS
            </span>
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



// ============================================================
// LOGIN EVENTS
// ============================================================

export function initLoginEvents(navigate) {


  // ----------------------------------------------------------
  // Apply saved theme
  // ----------------------------------------------------------

  const savedTheme =
    localStorage.getItem(
      "fraudshield-theme"
    );


  const initialTheme =
    savedTheme === "dark"
      ? "dark"
      : "light";


  applyTheme(
    initialTheme
  );


  // ----------------------------------------------------------
  // Theme toggle
  // ----------------------------------------------------------

  const themeToggle =
    document.getElementById(
      "login-theme-toggle"
    );


  themeToggle?.addEventListener(
    "click",
    () => {

      const currentTheme =
        document.documentElement.getAttribute(
          "data-theme"
        );


      applyTheme(
        currentTheme === "dark"
          ? "light"
          : "dark"
      );

    }
  );


  // ----------------------------------------------------------
  // Existing login functionality
  // ----------------------------------------------------------

  const form =
    document.getElementById(
      "login-form"
    );


  if (!form) return;


  const password =
    document.getElementById(
      "password"
    );


  const togglePassword =
    document.getElementById(
      "toggle-password"
    );


  togglePassword?.addEventListener(
    "click",
    () => {

      const isVisible =
        password.type === "text";


      password.type =
        isVisible
          ? "password"
          : "text";


      togglePassword.textContent =
        isVisible
          ? "Show"
          : "Hide";


      togglePassword.setAttribute(
        "aria-label",
        isVisible
          ? "Show password"
          : "Hide password"
      );


      togglePassword.setAttribute(
        "title",
        isVisible
          ? "Show password"
          : "Hide password"
      );

    }
  );


  // ----------------------------------------------------------
  // LOGIN SUBMISSION
  // ----------------------------------------------------------

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const u =
        document
          .getElementById(
            "username"
          )
          .value
          .trim();


      const p =
        document
          .getElementById(
            "password"
          )
          .value;


      const submitButton =
        form.querySelector(
          ".login-submit"
        );


      try {


        if (submitButton) {

          submitButton.disabled =
            true;


          submitButton.innerHTML = `

            <span class="login-spinner"></span>

            <span>
              Authenticating...
            </span>

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
          "/dashboard"
        );


      } catch (err) {


        console.error(
          "Authentication error:",
          err
        );


        alert(
          `Authentication failed: ${err.message}`
        );


        if (submitButton) {

          submitButton.disabled =
            false;


          submitButton.innerHTML = `

            <span>
              Log In
            </span>

            <span class="login-arrow">
              →
            </span>

          `;

        }

      }

    }
  );

}