export function renderHome() {
  return `
    <main class="home-page">
      <section class="home-hero">
        <div>
          <p class="eyebrow">FraudShield AI</p>
          <h1>See suspicious activity before it becomes a loss.</h1>
          <p class="home-copy">A real-time fraud operations workspace combining streaming ingestion, machine-learning risk scoring, alerts, and investigator workflows.</p>
          <a class="btn btn-primary" href="#/login">Open the operations console</a>
        </div>
        <img src="assets/images/fraudshield-hero.jpg" alt="Fraud monitoring operations dashboard" />
      </section>
      <section class="home-highlights">
        <article><strong>Stream</strong><span>Ingest transactions through Kafka.</span></article>
        <article><strong>Score</strong><span>Evaluate risk with the ML pipeline.</span></article>
        <article><strong>Respond</strong><span>Route alerts and cases to the right role.</span></article>
      </section>
    </main>
  `;
}

export function initHomeEvents() {}