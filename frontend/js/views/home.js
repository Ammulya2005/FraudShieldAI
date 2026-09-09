export function renderHome() {
  return `
    <main class="home-page">

      <!-- NAVBAR -->
      <nav class="home-navbar">
        <a href="#/home" class="home-brand">
          <img
            src="assets/images/FraudShield_dashboard_logo.jpeg"
            alt="FraudShieldAI"
          />

          <span>
            FraudShield<span>AI</span>
          </span>
        </a>

        <div class="home-nav-links">
          <a href="#/home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <a href="#/login" class="home-login-btn">
          Login
        </a>
      </nav>


      <!-- HERO -->
      <section class="home-hero">

        <div class="home-hero-content">

          <div class="home-badge">
            <span class="home-badge-dot"></span>
            AI-POWERED REAL-TIME FRAUD DETECTION
          </div>

          <h1>
            Protect Every Transaction.
            <span>Detect Every Threat.</span>
          </h1>

          <p class="home-hero-description">
            FraudShieldAI combines real-time transaction streaming,
            machine-learning risk scoring, anomaly detection and
            intelligent alerts to help financial teams stop fraud
            before it becomes a loss.
          </p>

          <div class="home-hero-actions">
            <a href="#/login" class="home-primary-btn">
              Access Dashboard
              <span>→</span>
            </a>

            <a href="#features" class="home-secondary-btn">
              Explore Features
            </a>
          </div>

          <div class="home-trust">
            <div>
              <span>✓</span>
              Real-Time Monitoring
            </div>

            <div>
              <span>✓</span>
              AI Risk Scoring
            </div>

            <div>
              <span>✓</span>
              Automated Alerts
            </div>
          </div>

        </div>


        <!-- AI VISUAL -->
        <div class="home-visual">

          <div class="visual-glow"></div>

          <div class="fraud-dashboard-card">

            <div class="visual-header">
              <div>
                <span class="live-dot"></span>
                LIVE AI ENGINE
              </div>

              <span class="visual-status">
                ACTIVE
              </span>
            </div>


            <div class="visual-shield">
              <div class="shield-ring"></div>

              <div class="shield-icon">
                🛡
              </div>
            </div>


            <div class="risk-score">
              <span>Current Risk Score</span>

              <strong>92.4%</strong>

              <div class="risk-bar">
                <div></div>
              </div>

              <small>
                HIGH RISK TRANSACTION
              </small>
            </div>


            <div class="visual-data">

              <div>
                <span>Transaction</span>
                <strong>#TX-847291</strong>
              </div>

              <div>
                <span>Model</span>
                <strong>XGBoost + IF</strong>
              </div>

              <div>
                <span>Status</span>
                <strong class="danger-text">
                  FRAUD DETECTED
                </strong>
              </div>

            </div>

          </div>


          <div class="floating-card floating-card-one">
            <span>⚡</span>
            <div>
              <strong>Real-Time</strong>
              <small>Transaction Stream</small>
            </div>
          </div>


          <div class="floating-card floating-card-two">
            <span>🚨</span>
            <div>
              <strong>Alert Generated</strong>
              <small>Risk threshold exceeded</small>
            </div>
          </div>

        </div>

      </section>


      <!-- STATS -->
      <section class="home-stats">

        <div class="stat-item">
          <strong>Real-Time</strong>
          <span>Transaction Monitoring</span>
        </div>

        <div class="stat-item">
          <strong>AI + ML</strong>
          <span>Risk Intelligence</span>
        </div>

        <div class="stat-item">
          <strong>Kafka</strong>
          <span>Streaming Pipeline</span>
        </div>

        <div class="stat-item">
          <strong>RBAC</strong>
          <span>Secure Operations</span>
        </div>

      </section>


      <!-- FEATURES -->
      <section class="home-section" id="features">

        <div class="section-heading">

          <span>CAPABILITIES</span>

          <h2>
            Everything you need to
            <strong>fight financial fraud.</strong>
          </h2>

          <p>
            A complete fraud operations platform designed to
            detect suspicious activity, prioritize risk and
            support faster investigation.
          </p>

        </div>


        <div class="feature-grid">

          <article class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Real-Time Monitoring</h3>
            <p>
              Continuously ingest and monitor transactions
              through a Kafka-powered streaming pipeline.
            </p>
          </article>


          <article class="feature-card">
            <div class="feature-icon">🧠</div>
            <h3>AI Risk Scoring</h3>
            <p>
              Combine XGBoost predictions and Isolation Forest
              anomaly detection to calculate transaction risk.
            </p>
          </article>


          <article class="feature-card">
            <div class="feature-icon">🚨</div>
            <h3>Instant Alerts</h3>
            <p>
              Automatically generate alerts when transactions
              exceed configured fraud risk thresholds.
            </p>
          </article>


          <article class="feature-card">
            <div class="feature-icon">🔎</div>
            <h3>Investigator Workflows</h3>
            <p>
              Give fraud analysts the tools to review cases,
              investigate transactions and prioritize threats.
            </p>
          </article>


          <article class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Risk Intelligence</h3>
            <p>
              Visualize fraud trends, risk distributions,
              transaction activity and model performance.
            </p>
          </article>


          <article class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Role-Based Security</h3>
            <p>
              Protect sensitive operations using role-based
              access control for fraud teams and administrators.
            </p>
          </article>

        </div>

      </section>


      <!-- HOW IT WORKS -->
      <section class="home-section workflow-section" id="how-it-works">

        <div class="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            From transaction to
            <strong>fraud decision.</strong>
          </h2>

        </div>


        <div class="workflow">

          <div class="workflow-step">
            <div class="step-number">01</div>

            <div>
              <h3>Ingest</h3>
              <p>
                Transactions enter the system through
                the Kafka streaming pipeline.
              </p>
            </div>
          </div>


          <div class="workflow-line"></div>


          <div class="workflow-step">
            <div class="step-number">02</div>

            <div>
              <h3>Analyze</h3>
              <p>
                Transaction features are prepared and
                passed through the ML pipeline.
              </p>
            </div>
          </div>


          <div class="workflow-line"></div>


          <div class="workflow-step">
            <div class="step-number">03</div>

            <div>
              <h3>Detect</h3>
              <p>
                XGBoost and Isolation Forest calculate
                the final transaction risk.
              </p>
            </div>
          </div>


          <div class="workflow-line"></div>


          <div class="workflow-step">
            <div class="step-number">04</div>

            <div>
              <h3>Respond</h3>
              <p>
                High-risk transactions create alerts
                and fraud investigation cases.
              </p>
            </div>
          </div>

        </div>

      </section>


      <!-- CTA -->
      <section class="home-cta">

        <div>

          <span>READY TO DETECT FRAUD?</span>

          <h2>
            Secure your transactions
            with intelligent detection.
          </h2>

          <p>
            Access the FraudShieldAI operations console
            and start monitoring your transaction stream.
          </p>

          <a href="#/login" class="home-primary-btn">
            Open Operations Console
            <span>→</span>
          </a>

        </div>

      </section>


      <!-- FOOTER -->
      <footer class="home-footer">

        <div class="home-brand">

          <img
          class="home-logo"
         src="assets/images/FraudShield_dashboard_logo.jpeg"
          alt="FraudShield AI logo"
      >

          <span>
            FraudShield<span>AI</span>
          </span>

        </div>

        <p>
          AI-powered real-time financial fraud detection.
        </p>

        <span class="footer-copy">
          © 2026 FraudShieldAI
        </span>

      </footer>

    </main>
  `;
}

export function initHomeEvents() {
  // Public landing page does not require JavaScript events.
}