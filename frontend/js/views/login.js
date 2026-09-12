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

      border: 1px solid var(--border-light, #3a311f);
      border-radius: 10px;

      background: var(--surface, #fffdf8);

      color: var(--text-primary, #17130b);

      font-family: inherit;

      font-size: 10px;
      font-weight: 750;

      cursor: pointer;

      box-shadow:
        0 8px 25px rgba(0, 0, 0, 0.08);

      backdrop-filter: blur(12px);

      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }


    .login-theme-toggle:hover {

      transform: translateY(-2px);

      border-color: var(--accent-primary, #c9952f);

      box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.13);
    }


    .login-theme-icon {

      width: 21px;
      height: 21px;

      display: grid;
      place-items: center;

      border-radius: 50%;

      background:
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.10
        );

      color:
        var(--accent-primary, #c9952f);

      font-size: 12px;
    }


    /* ========================================================
       DARK LOGIN PAGE
       ======================================================== */

    [data-theme="dark"] .login-page {

      background:
        radial-gradient(
          circle at 20% 20%,
          rgba(
            var(--gold-rgb, 214, 168, 58),
            0.10
          ),
          transparent 30%
        ),
        var(--bg-primary, #080807) !important;

      color:
        var(--text-primary, #fff8e5);
    }


    [data-theme="dark"] .login-panel {

      background:
        var(--bg-secondary, #10100e) !important;

      color:
        var(--text-primary, #fff8e5);
    }


    [data-theme="dark"] .login-card {

      background:
        rgba(
          16,
          16,
          14,
          0.94
        ) !important;

      border-color:
        var(
          --border-light,
          #3a311f
        ) !important;

      color:
        var(--text-primary, #fff8e5);

      box-shadow:
        0 30px 80px
        rgba(0, 0, 0, 0.35);
    }


    [data-theme="dark"] .login-heading h2,
    [data-theme="dark"] .login-mobile-brand h2 {

      color:
        var(
          --text-primary,
          #fff8e5
        ) !important;
    }


    [data-theme="dark"] .login-heading p,
    [data-theme="dark"] .login-description,
    [data-theme="dark"] .login-tagline {

      color:
        var(
          --text-secondary,
          #d8c9a3
        ) !important;
    }


    [data-theme="dark"] .form-group label {

      color:
        var(
          --text-secondary,
          #d8c9a3
        ) !important;
    }


    [data-theme="dark"] .form-control {

      background:
        var(
          --surface,
          #10100e
        ) !important;

      border-color:
        var(
          --border-light,
          #4a3a20
        ) !important;

      color:
        var(
          --text-primary,
          #fff8e5
        ) !important;
    }


    [data-theme="dark"] .form-control::placeholder {

      color:
        var(
          --text-muted,
          #a99a74
        ) !important;
    }


    [data-theme="dark"] .form-control:focus {

      border-color:
        var(
          --accent-primary,
          #c9952f
        ) !important;

      box-shadow:
        0 0 0 3px
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.14
        ) !important;
    }


    [data-theme="dark"] .login-security-message {

      background:
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.08
        ) !important;

      border-color:
        var(
          --border-light,
          #4a3a20
        ) !important;

      color:
        var(
          --text-secondary,
          #d8c9a3
        ) !important;
    }


    [data-theme="dark"] .login-divider {

      border-color:
        var(
          --border-light,
          #3d321f
        ) !important;
    }


    [data-theme="dark"] .login-divider span {

      background:
        var(
          --surface,
          #10100e
        ) !important;

      color:
        var(
          --text-muted,
          #a99a74
        ) !important;
    }


    [data-theme="dark"] .login-form-footer {

      color:
        var(
          --text-muted,
          #a99a74
        ) !important;
    }


    [data-theme="dark"] .login-theme-toggle {

      background:
        rgba(
          16,
          16,
          14,
          0.94
        );

      border-color:
        var(
          --border-light,
          #4a3a20
        );

      color:
        var(
          --text-primary,
          #fff8e5
        );

      box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.28);
    }


    [data-theme="dark"] .login-theme-icon {

      background:
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.10
        );

      color:
        var(
          --accent-primary-hover,
          #e5bd58
        );
    }


    /* ========================================================
       DARK LEFT SIDE
       ======================================================== */

    [data-theme="dark"] .login-hero {

      background:
        radial-gradient(
          circle at 50% 40%,
          rgba(
            var(--gold-rgb, 214, 168, 58),
            0.08
          ),
          transparent 42%
        ),
        var(--bg-primary, #080807) !important;
    }


    [data-theme="dark"] .login-hero-text h1 span {
    display: inline-block;

    color: #e5bd58 !important;

    background: linear-gradient(
        135deg,
        #fff4c7 0%,
        #e5bd58 50%,
        #c9952f 100%
    );

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    text-shadow:
        0 0 24px rgba(229, 189, 88, 0.18);
}


    [data-theme="dark"] .login-feature {

      background:
        rgba(
          16,
          16,
          14,
          0.65
        ) !important;

      border-color:
        var(
          --border-light,
          #3a311f
        ) !important;

      color:
        var(
          --text-primary,
          #fff8e5
        );
    }


    [data-theme="dark"] .login-feature span {

      color:
        var(
          --text-secondary,
          #b9aa83
        ) !important;
    }


    /* ========================================================
       LIGHT MODE
       ======================================================== */

    [data-theme="light"] .login-page {

      background:
        var(
          --bg-primary,
          #fbf8f0
        ) !important;

      color:
        var(
          --text-primary,
          #17130b
        );
    }


    [data-theme="light"] .login-hero {

      background:
        radial-gradient(
          circle at 50% 40%,
          rgba(
            var(--gold-rgb, 201, 149, 47),
            0.10
          ),
          transparent 42%
        ),
        var(
          --bg-primary,
          #fbf8f0
        ) !important;
    }


    [data-theme="light"] .login-panel {

      background:
        var(
          --bg-secondary,
          #fffdf8
        ) !important;

      color:
        var(
          --text-primary,
          #17130b
        );
    }


    [data-theme="light"] .login-card {

      background:
        var(
          --surface,
          #fffdf8
        ) !important;

      border-color:
        var(
          --border-light,
          #dfcfaa
        ) !important;

      color:
        var(
          --text-primary,
          #17130b
        );

      box-shadow:
        0 30px 80px
        rgba(80, 55, 15, 0.10);
    }


    [data-theme="light"] .login-heading h2,
    [data-theme="light"] .login-mobile-brand h2 {

      color:
        var(
          --text-primary,
          #17130b
        ) !important;
    }


    [data-theme="light"] .login-heading p,
    [data-theme="light"] .login-description,
    [data-theme="light"] .login-tagline {

      color:
        var(
          --text-secondary,
          #5f543f
        ) !important;
    }


    [data-theme="light"] .form-group label {

      color:
        var(
          --text-primary,
          #17130b
        ) !important;
    }


    [data-theme="light"] .form-control {

      background:
        var(
          --surface,
          #fffdf8
        ) !important;

      border-color:
        var(
          --border-light,
          #dfcfaa
        ) !important;

      color:
        var(
          --text-primary,
          #17130b
        ) !important;
    }


    [data-theme="light"] .form-control::placeholder {

      color:
        var(
          --text-muted,
          #8b7a5b
        ) !important;
    }


    [data-theme="light"] .form-control:focus {

      border-color:
        var(
          --accent-primary,
          #c9952f
        ) !important;

      box-shadow:
        0 0 0 3px
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.14
        ) !important;
    }


    [data-theme="light"] .login-security-message {

      background:
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.08
        ) !important;

      border-color:
        var(
          --border-light,
          #dfcfaa
        ) !important;

      color:
        var(
          --text-secondary,
          #5f543f
        ) !important;
    }


    [data-theme="light"] .login-divider {

      border-color:
        var(
          --border-light,
          #dfcfaa
        ) !important;
    }


    [data-theme="light"] .login-divider span {

      background:
        var(
          --surface,
          #fffdf8
        ) !important;

      color:
        var(
          --text-muted,
          #8b7a5b
        ) !important;
    }


    [data-theme="light"] .login-form-footer {

      color:
        var(
          --text-muted,
          #8b7a5b
        ) !important;
    }


    [data-theme="light"] .login-theme-toggle {

      background:
        var(
          --surface,
          #fffdf8
        );

      border-color:
        var(
          --border-light,
          #dfcfaa
        );

      color:
        var(
          --text-primary,
          #17130b
        );

      box-shadow:
        0 10px 30px
        rgba(80, 55, 15, 0.10);
    }


    [data-theme="light"] .login-theme-icon {

      background:
        rgba(
          var(--gold-rgb, 201, 149, 47),
          0.10
        );

      color:
        var(
          --accent-primary,
          #c9952f
        );
    }


    [data-theme="light"] .login-feature {

      background:
        rgba(
          255,
          253,
          248,
          0.88
        ) !important;

      border-color:
        var(
          --border-light,
          #dfcfaa
        ) !important;

      color:
        var(
          --text-primary,
          #17130b
        );
    }


    [data-theme="light"] .login-feature span {

      color:
        var(
          --text-secondary,
          #5f543f
        ) !important;
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
    /* ========================================================
       GOLD GLOBE WATERMARK — LOGIN PAGE
       ======================================================== */

    .login-page {

      background-image:
        url("assets/images/fraud-watermark.png") !important;

      background-repeat:
        no-repeat !important;

      background-position:
        center center !important;

      background-size:
        cover !important;

      background-attachment:
        fixed !important;

    }


    [data-theme="dark"] .login-page {

      background-color:
        #080807 !important;

      background-image:
        url("assets/images/fraud-watermark.png") !important;

      background-repeat:
        no-repeat !important;

      background-position:
        center center !important;

      background-size:
        cover !important;

      background-attachment:
        fixed !important;

    }


    [data-theme="dark"] .login-page .login-hero,
    [data-theme="dark"] .login-page .login-panel {

      background:
        rgba(8, 8, 7, 0.58) !important;

    }


    [data-theme="light"] .login-page {

      background-color:
        #fbf8f0 !important;

      background-image:
        url("assets/images/fraud-watermark.png") !important;

      background-repeat:
        no-repeat !important;

      background-position:
        center center !important;

      background-size:
        cover !important;

      background-attachment:
        fixed !important;

    }


    [data-theme="light"] .login-page .login-hero {

      background:
        rgba(251, 248, 240, 0.72) !important;

    }


    [data-theme="light"] .login-page .login-panel {

      background:
        rgba(255, 253, 248, 0.78) !important;

    }


    .login-page .login-card {

      position:
        relative !important;

      z-index:
        5 !important;

    }
       /* ========================================================
        GOLD LOGIN BUTTON
        ======================================================== */

    .login-page .login-submit {
     color: #17130b !important;

    background: linear-gradient(
        135deg,
        #fff4c7 0%,
        #e5bd58 45%,
        #c9952f 100%
    ) !important;

    border: 1px solid rgba(255, 231, 154, 0.80) !important;

    box-shadow:
        0 10px 28px rgba(201, 149, 47, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.38) !important;

    font-weight: 800 !important;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
}

.login-page .login-submit:hover {
    color: #17130b !important;

    background: linear-gradient(
        135deg,
        #fff8d8 0%,
        #f0cb65 45%,
        #d5a63a 100%
    ) !important;

    box-shadow:
        0 15px 35px rgba(201, 149, 47, 0.42),
        0 0 24px rgba(229, 189, 88, 0.18) !important;

    transform: translateY(-2px);
  }

   .login-page .login-submit .login-arrow {
    color: #17130b !important;
    font-weight: 900;
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
                src="assets/images/FraudShieldAI_full_logo.png"
                alt="FraudShield AI"
                class="full-brand-logo"
            >


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
              src="assets/images/FraudShieldAI_full_logo.png"
              alt="FraudShield AI"
              class="login-full-logo"
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
             <span>Log In</span>
             <span class="login-arrow">→</span>
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