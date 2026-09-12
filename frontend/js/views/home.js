// ============================================================
// FraudShieldAI - Modern Landing Page
// Replace the entire contents of:
// frontend/js/views/home.js
// ============================================================

const HOME_STYLE_ID = "fraudshield-home-modern-style";

function injectHomeStyles() {
  if (document.getElementById(HOME_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = HOME_STYLE_ID;

  style.textContent = `
    /* ========================================================
       FRAUDSHIELD AI - MODERN HOME PAGE
       ======================================================== */

    .fs-home {
      --fs-blue: var(--accent-primary);
      --fs-blue-dark: var(--accent-primary-hover);
      --fs-cyan: var(--accent-primary);
      --fs-navy: var(--bg-secondary);
      --fs-text: var(--text-primary);
      --fs-muted: var(--text-muted);
      --fs-border: var(--border-light);
      --fs-bg: var(--bg-primary);
      --fs-card: var(--surface);
      --fs-danger: var(--risk-critical);

      min-height: 100vh;
      background:
        radial-gradient(
          circle at 80% 8%,
          rgba(var(--gold-rgb), 0.10),
          transparent 28%
        ),
        radial-gradient(
          circle at 10% 25%,
          rgba(var(--gold-rgb), 0.06),
          transparent 25%
        ),
        var(--fs-bg);

      color: var(--fs-text);
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      overflow: visible;
    }

    .fs-home *,
    .fs-home *::before,
    .fs-home *::after {
      box-sizing: border-box;
    }

    .fs-home a {
      color: inherit;
      text-decoration: none;
    }

    /* ========================================================
       NAVBAR
       ======================================================== */

    .fs-nav {
      width: min(1180px, calc(100% - 48px));
      min-height: 78px;
      margin: auto;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;

      border-bottom: 1px solid var(--fs-border);
    }

    .fs-brand {
      display: flex;
      align-items: center;
      gap: 10px;

      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.04em;
      white-space: nowrap;
    }

    .fs-brand img.full-brand-logo {
    width: 190px;
    height: auto;
    max-height: 65px;
    object-fit: contain;
    border-radius: 0;
    box-shadow: none;
  }
    .fs-brand {
    display: flex;
    align-items: center;
    gap: 0;
   }

    .fs-brand span span {
      color: var(--fs-blue);
    }

    .fs-nav-links {
      display: flex;
      align-items: center;
      gap: 34px;

      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
    }

    .fs-nav-links a {
      position: relative;
      padding: 28px 0;
      transition: color 0.2s ease;
    }

    .fs-nav-links a::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 19px;

      height: 2px;
      border-radius: 99px;

      background: var(--fs-blue);

      transform: scaleX(0);
      transition: transform 0.2s ease;
    }

    .fs-nav-links a:hover {
      color: var(--fs-blue);
    }

    .fs-nav-links a:hover::after {
      transform: scaleX(1);
    }
/* ========================================================
   THEME SWITCHER
   ======================================================== */

.fs-nav-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}

.fs-theme-toggle {
  height: 38px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 0 11px;

  border: 1px solid var(--fs-border);
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.75);

  color: var(--fs-text);

  font-family: inherit;
  font-size: 10px;
  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.fs-theme-toggle:hover {
  transform: translateY(-2px);

  border-color: rgba(var(--gold-rgb), 0.30);

  box-shadow:
    0 8px 22px rgba(var(--gold-rgb), 0.10);
}

.fs-theme-icon {
  width: 20px;
  height: 20px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: rgba(var(--gold-rgb), 0.10);

  color: var(--fs-blue);

  font-size: 12px;
}

[data-theme="dark"] .fs-theme-toggle {
  background: rgba(16, 16, 14, 0.90);

  border-color: var(--border-light);
}

[data-theme="dark"] .fs-theme-icon {
  background: rgba(var(--gold-rgb), 0.10);

  color: var(--accent-primary);
}
    .fs-nav-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      padding: 10px 16px;

      border: 1px solid rgba(var(--gold-rgb), 0.22);
      border-radius: 10px;

      background: rgba(255, 255, 255, 0.75);

      color: var(--fs-blue);
      font-size: 12px;
      font-weight: 750;

      box-shadow: 0 7px 22px rgba(var(--gold-rgb), 0.06);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }

    .fs-nav-cta:hover {
      transform: translateY(-2px);
      background: #fff;
      box-shadow: 0 12px 28px rgba(var(--gold-rgb), 0.12);
    }

    /* ========================================================
       HERO
       ======================================================== */

    .fs-hero {
      width: min(1180px, calc(100% - 48px));
      min-height: 630px;
      margin: auto;

      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      align-items: center;
      gap: 70px;

      padding: 78px 0 75px;
    }

    .fs-hero-copy {
      position: relative;
      z-index: 5;
    }

    .fs-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 9px;

      margin-bottom: 18px;

      color: var(--text-secondary);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: 0.13em;
    }

    .fs-pulse {
      width: 8px;
      height: 8px;

      border-radius: 50%;
      background: #2acb73;

      box-shadow: 0 0 0 5px rgba(42, 203, 115, 0.12);

      animation: fsPulse 1.8s ease-in-out infinite;
    }

    @keyframes fsPulse {
      50% {
        transform: scale(0.72);
        box-shadow: 0 0 0 9px rgba(42, 203, 115, 0.03);
      }
    }

    .fs-hero h1 {
      max-width: 680px;

      margin: 0;

      font-size: clamp(3.6rem, 6vw, 6.2rem);
      line-height: 0.94;

      letter-spacing: -0.075em;
      font-weight: 850;
    }

     .fs-hero h1 span {
    display: block;

    color: #e5bd58;

    background: linear-gradient(
        135deg,
        #fff4c7 0%,
        #e5bd58 45%,
        #c9952f 100%
    );

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    text-shadow:
        0 0 28px rgba(229, 189, 88, 0.16);
}
    .fs-hero-text {
      max-width: 590px;

      margin: 25px 0 0;

      color: var(--fs-muted);
      font-size: 15px;
      line-height: 1.75;
    }

    .fs-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      margin-top: 28px;
    }

    .fs-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      min-height: 46px;
      padding: 0 19px;

      border-radius: 11px;

      font-size: 12px;
      font-weight: 800;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .fs-btn:hover {
      transform: translateY(-2px);
    }

    .fs-btn-primary {
    color: #17130b !important;

    background: linear-gradient(
        135deg,
        #fff1b8 0%,
        #e5bd58 45%,
        #c9952f 100%
    ) !important;

    border: 1px solid rgba(255, 231, 154, 0.75);

    box-shadow:
        0 10px 28px rgba(201, 149, 47, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);

    font-weight: 800;
}

   .fs-btn-primary:hover {
    color: #17130b !important;

    background: linear-gradient(
        135deg,
        #fff6d0 0%,
        #f0cb65 45%,
        #d5a63a 100%
    ) !important;

    box-shadow:
        0 15px 35px rgba(201, 149, 47, 0.40),
        0 0 22px rgba(229, 189, 88, 0.18);

    transform: translateY(-2px);
}

    .fs-btn-ghost {
      color: var(--fs-text);
      background: #fff;
      border: 1px solid var(--fs-border);
    }

    .fs-proof {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;

      margin-top: 27px;

      color: var(--text-muted);
      font-size: 11px;
      font-weight: 650;
    }

    .fs-proof i {
      display: inline-grid;
      place-items: center;

      width: 17px;
      height: 17px;

      margin-right: 5px;

      border-radius: 50%;

      background: rgba(42, 203, 115, 0.12);
      color: #1da75b;

      font-style: normal;
      font-size: 9px;
    }

    /* ========================================================
       HERO VISUAL
       ======================================================== */

    .fs-hero-visual {
      position: relative;

      min-height: 510px;

      display: grid;
      place-items: center;

      isolation: isolate;
    }

    .fs-grid {
      position: absolute;
      inset: 0;

      opacity: 0.55;

      background-image:
        linear-gradient(
          rgba(var(--gold-rgb), 0.055) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(var(--gold-rgb), 0.055) 1px,
          transparent 1px
        );

      background-size: 35px 35px;

      mask-image: radial-gradient(
        circle,
        black 25%,
        transparent 72%
      );
    }

    .fs-glow {
      position: absolute;

      width: 280px;
      height: 280px;

      border-radius: 50%;

      filter: blur(55px);

      z-index: -2;
    }

    .fs-glow-a {
      background: rgba(var(--gold-rgb), 0.17);
      left: 18%;
      top: 19%;
    }

    .fs-glow-b {
      background: rgba(var(--gold-rgb), 0.12);
      right: 8%;
      bottom: 9%;
    }

    .fs-orbit {
      position: absolute;

      border: 1px solid rgba(var(--gold-rgb), 0.17);

      border-radius: 50%;

      animation: fsOrbit 16s linear infinite;
    }

    .fs-orbit-outer {
      width: 440px;
      height: 440px;

      transform: rotateX(65deg);

      border-color: rgba(var(--gold-rgb), 0.13);
    }

    .fs-orbit-inner {
      width: 330px;
      height: 330px;

      transform: rotateX(65deg) rotateZ(25deg);

      animation-duration: 11s;

      border-color: rgba(var(--gold-rgb), 0.18);
    }

    @keyframes fsOrbit {
      from {
        transform: rotateX(65deg) rotateZ(0deg);
      }

      to {
        transform: rotateX(65deg) rotateZ(360deg);
      }
    }

    .fs-node {
      position: absolute;

      width: 8px;
      height: 8px;

      border-radius: 50%;

      background: var(--fs-cyan);

      box-shadow:
        0 0 0 5px rgba(var(--gold-rgb), 0.08),
        0 0 20px rgba(var(--gold-rgb), 0.55);

      animation: fsNode 2.7s ease-in-out infinite;
    }

    .fs-node-a {
      top: 17%;
      left: 28%;
    }

    .fs-node-b {
      top: 72%;
      right: 19%;
      animation-delay: 0.8s;
    }

    .fs-node-c {
      bottom: 16%;
      left: 18%;
      animation-delay: 1.5s;
    }

    @keyframes fsNode {
      50% {
        transform: scale(1.8);
        opacity: 0.55;
      }
    }

    /* ========================================================
       RISK CARD
       ======================================================== */

    .fs-risk-card {
      position: relative;
      z-index: 3;

      width: 360px;

      padding: 23px;

      border: 1px solid rgba(255, 255, 255, 0.82);
      border-radius: 22px;

      background:
        linear-gradient(
          145deg,
          rgba(255, 255, 255, 0.96),
          rgba(247, 251, 255, 0.91)
        );

      box-shadow:
        0 35px 90px rgba(var(--gold-rgb), 0.18),
        0 0 0 1px rgba(var(--gold-rgb), 0.05);

      backdrop-filter: blur(18px);

      animation: fsFloat 5s ease-in-out infinite;
    }

    @keyframes fsFloat {
      50% {
        transform: translateY(-9px);
      }
    }

    .fs-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 20px;

      color: var(--text-muted);

      font-size: 9px;
      font-weight: 850;
      letter-spacing: 0.08em;
    }

    .fs-card-top > div {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .fs-live-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #29c86f;

      box-shadow:
        0 0 0 4px rgba(41, 200, 111, 0.10);
    }

    .fs-active {
      padding: 5px 8px;

      border-radius: 6px;

      background: rgba(41, 200, 111, 0.09);
      color: #1aa65a;
    }

    .fs-shield-wrap {
      position: relative;

      width: 135px;
      height: 135px;

      margin: 2px auto 23px;

      display: grid;
      place-items: center;
    }

    /* ========================================================
   LARGE GOLD SECURITY SHIELD
   ======================================================== */

.fs-shield {
    width: 110px !important;
    height: 110px !important;

    display: flex !important;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    border-radius: 26px !important;

    background:
        radial-gradient(
            circle at center,
            rgba(var(--gold-rgb), 0.18),
            rgba(0, 0, 0, 0.92) 72%
        ) !important;

    border:
        1px solid rgba(var(--gold-rgb), 0.38) !important;

    box-shadow:
        0 0 35px rgba(var(--gold-rgb), 0.24),
        inset 0 0 25px rgba(var(--gold-rgb), 0.08) !important;

    animation:
        fsShield 3s ease-in-out infinite;
}


/* New shield image */

.fs-shield-image {
    width: 92px !important;
    height: 92px !important;

    display: block;

    object-fit: contain;

    object-position: center;

    border: none !important;

    border-radius: 0 !important;

    box-shadow:
        0 0 22px rgba(var(--gold-rgb), 0.35);

    filter:
        brightness(1.05)
        contrast(1.08)
        saturate(1.12);
}

    @keyframes fsShield {
      50% {
        transform: scale(1.045);
      }
    }

    .fs-shield svg {
      width: 52px;
      height: 52px;

      fill: none;

      stroke: var(--fs-blue);

      stroke-width: 3;

      stroke-linecap: round;
      stroke-linejoin: round;

      filter: drop-shadow(
        0 0 8px rgba(var(--gold-rgb), 0.25)
      );
    }

    .fs-shield-ring {
      position: absolute;
      inset: 8px;

      border: 1px solid rgba(var(--gold-rgb), 0.18);

      border-radius: 34px;

      animation: fsRing 2.8s ease-out infinite;
    }

    @keyframes fsRing {
      0% {
        transform: scale(0.82);
        opacity: 0.8;
      }

      100% {
        transform: scale(1.2);
        opacity: 0;
      }
    }

    .fs-score-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .fs-score-row small {
      display: block;

      margin-bottom: 5px;

      color: var(--fs-muted);

      font-size: 10px;
    }

    .fs-score-row strong {
      display: block;

      font-size: 31px;
      line-height: 1;

      letter-spacing: -0.06em;
    }

    .fs-risk-label {
      color: var(--fs-danger);

      font-size: 9px;
      font-weight: 850;
      letter-spacing: 0.05em;
    }

    .fs-risk-track {
      height: 6px;

      margin: 13px 0 18px;

      overflow: hidden;

      border-radius: 99px;

      background: var(--text-primary);
    }

    .fs-risk-track span {
      display: block;

      width: 0;
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          var(--fs-blue),
          var(--fs-danger)
        );

      animation: fsRiskFill 1.5s 0.3s ease-out forwards;
    }

    @keyframes fsRiskFill {
      to {
        width: 92.4%;
      }
    }

    .fs-transaction {
      display: grid;

      grid-template-columns: 1fr 1fr;

      gap: 12px;

      padding-top: 15px;

      border-top: 1px solid var(--fs-border);
    }

    .fs-transaction small {
      display: block;

      margin-bottom: 4px;

      color: var(--fs-muted);

      font-size: 9px;
    }

    .fs-transaction b {
      font-size: 10px;
    }

    .fs-status-block {
      grid-column: 1 / -1;
    }

    .fs-status-block b {
      color: var(--fs-danger);
    }

    /* ========================================================
       FLOATING CARDS
       ======================================================== */

    .fs-mini-card {
      position: absolute;

      z-index: 5;

      display: flex;
      align-items: center;
      gap: 9px;

      padding: 11px 13px;

      min-width: 185px;

      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 13px;

      background: rgba(255, 255, 255, 0.90);

      box-shadow:
        0 17px 40px rgba(var(--gold-rgb), 0.13);

      backdrop-filter: blur(15px);

      animation: fsMiniFloat 4s ease-in-out infinite;
    }

    .fs-mini-card b {
      display: block;

      font-size: 10px;
    }

    .fs-mini-card small {
      display: block;

      margin-top: 3px;

      color: var(--fs-muted);

      font-size: 8px;
    }

    .fs-mini-icon {
      width: 29px;
      height: 29px;

      display: grid;
      place-items: center;

      border-radius: 9px;

      background: rgba(var(--gold-rgb), 0.10);

      color: var(--fs-blue);

      font-size: 13px;
      font-weight: 900;
    }

    .fs-mini-stream {
      left: 0;
      top: 22%;
    }

    .fs-mini-alert {
      right: 0;
      bottom: 20%;

      animation-delay: 1s;
    }

    @keyframes fsMiniFloat {
      50% {
        transform: translateY(-7px);
      }
    }

    .fs-scan-line {
      position: absolute;

      z-index: 4;

      width: 390px;
      height: 1px;

      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(var(--gold-rgb), 0.85),
          transparent
        );

      box-shadow:
        0 0 12px rgba(var(--gold-rgb), 0.45);

      animation: fsScan 4s ease-in-out infinite;
    }

    @keyframes fsScan {
      0%,
      100% {
        transform: translateY(-170px);
        opacity: 0;
      }

      35%,
      65% {
        opacity: 0.7;
      }

      50% {
        transform: translateY(170px);
      }
    }

    /* ========================================================
       TECHNOLOGY STRIP
       ======================================================== */

    .fs-tech-strip {
      width: min(1180px, calc(100% - 48px));

      margin: 0 auto 90px;

      padding: 10px;

      display: grid;
      grid-template-columns: repeat(4, 1fr);

      border: 1px solid var(--fs-border);
      border-radius: 15px;

      background: rgba(255, 255, 255, 0.78);

      box-shadow:
        0 17px 40px rgba(var(--gold-rgb), 0.06);

      backdrop-filter: blur(12px);
    }

    .fs-tech-item {
      min-height: 58px;

      display: flex;
      align-items: center;
      gap: 11px;

      padding: 0 17px;

      border-right: 1px solid var(--fs-border);
    }

    .fs-tech-item:last-child {
      border-right: 0;
    }

    .fs-tech-mark {
      width: 33px;
      height: 33px;

            flex: 0 0 auto;

      display: grid;
      place-items: center;

      border-radius: 9px;

      background: rgba(var(--gold-rgb), 0.09);

      color: var(--fs-blue);

      font-size: 9px;
      font-weight: 900;
    }

    .fs-tech-item b {
      display: block;

      font-size: 11px;
    }

    .fs-tech-item small {
      display: block;

      margin-top: 2px;

      color: var(--fs-muted);

      font-size: 8px;
    }

    /* ========================================================
       SECTIONS
       ======================================================== */

    .fs-section {
      width: min(1080px, calc(100% - 48px));

      margin: auto;

      padding: 65px 0 105px;
    }

    .fs-kicker {
      color: var(--fs-blue);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: 0.13em;
    }

    .fs-section-head {
      max-width: 720px;
    }

    .fs-section-head h2 {
      margin: 12px 0;

      font-size: clamp(2.2rem, 4vw, 3.6rem);

      line-height: 1;

      letter-spacing: -0.065em;
    }

    .fs-section-head h2 span {
      color: var(--fs-blue);
    }

    .fs-section-head p {
      max-width: 670px;

      margin: 0;

      color: var(--fs-muted);

      font-size: 13px;
      line-height: 1.75;
    }

    /* ========================================================
       FEATURE CARDS
       ======================================================== */

    .fs-feature-grid {
      display: grid;

      grid-template-columns: repeat(3, 1fr);

      gap: 15px;

      margin-top: 40px;
    }

    .fs-feature {
      position: relative;

      min-height: 215px;

      padding: 24px;

      overflow: hidden;

      border: 1px solid var(--fs-border);
      border-radius: 17px;

      background: rgba(255, 255, 255, 0.82);

      box-shadow:
        0 12px 32px rgba(var(--gold-rgb), 0.04);

      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;
    }

    .fs-feature::before {
      content: "";

      position: absolute;

      width: 120px;
      height: 120px;

      right: -60px;
      bottom: -70px;

      border-radius: 50%;

      background: rgba(var(--gold-rgb), 0.07);
    }

    .fs-feature:hover {
      transform: translateY(-6px);

      border-color: rgba(var(--gold-rgb), 0.28);

      box-shadow:
        0 23px 45px rgba(var(--gold-rgb), 0.10);
    }

    .fs-feature-number {
      position: absolute;

      top: 20px;
      right: 21px;

      color: var(--text-muted);

      font-size: 9px;
      font-weight: 850;
    }

    .fs-feature-icon {
      width: 43px;
      height: 43px;

      display: grid;
      place-items: center;

      margin-bottom: 28px;

      border: 1px solid rgba(var(--gold-rgb), 0.18);
      border-radius: 12px;

      background: rgba(var(--gold-rgb), 0.08);

      color: var(--fs-blue);

      font-size: 13px;
      font-weight: 900;
    }

    .fs-feature h3 {
      margin: 0 0 8px;

      font-size: 15px;

      letter-spacing: -0.025em;
    }

    .fs-feature p {
      margin: 0;

      color: var(--fs-muted);

      font-size: 11px;

      line-height: 1.7;
    }

    /* ========================================================
       WORKFLOW
       ======================================================== */

    .fs-workflow {
      display: grid;

      grid-template-columns:
        1fr 30px
        1fr 30px
        1fr 30px
        1fr;

      align-items: center;

      margin-top: 42px;
    }

    .fs-step {
      min-height: 150px;

      padding: 20px;

      border: 1px solid var(--fs-border);
      border-radius: 15px;

      background: rgba(255, 255, 255, 0.82);

      transition:
        transform 0.25s ease,
        border-color 0.25s ease;
    }

    .fs-step:hover {
      transform: translateY(-5px);

      border-color: rgba(var(--gold-rgb), 0.27);
    }

    .fs-step-number {
      display: block;

      margin-bottom: 28px;

      color: var(--fs-blue);

      font-size: 9px;
      font-weight: 900;
    }

    .fs-step h3 {
      margin: 0 0 7px;

      font-size: 14px;
    }

    .fs-step p {
      margin: 0;

      color: var(--fs-muted);

      font-size: 10px;

      line-height: 1.65;
    }

    .fs-step-line {
      height: 1px;

      background:
        linear-gradient(
          90deg,
          transparent,
          rgba(var(--gold-rgb), 0.32),
          transparent
        );
    }

    /* ========================================================
       CTA
       ======================================================== */

    .fs-cta {
      width: min(1080px, calc(100% - 48px));

      margin: 0 auto 50px;

      padding: 48px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 30px;

      border: 1px solid rgba(var(--gold-rgb), 0.16);

      border-radius: 22px;

      background:
        radial-gradient(
          circle at 90% 15%,
          rgba(var(--gold-rgb), 0.13),
          transparent 18rem
        ),
        linear-gradient(
          135deg,
          rgba(var(--gold-rgb), 0.08),
          rgba(255, 255, 255, 0.82)
        );
    }

    .fs-cta h2 {
      margin: 9px 0 8px;

      font-size: clamp(1.9rem, 3.5vw, 3rem);

      line-height: 1;

      letter-spacing: -0.06em;
    }

    .fs-cta h2 span {
      color: var(--fs-blue);
    }

    .fs-cta p {
      margin: 0;

      color: var(--fs-muted);

      font-size: 11px;
    }
    /* ========================================================
   REQUEST A DEMO CTA
   ======================================================== */

.fs-demo-cta {

  width: min(1180px, calc(100% - 48px));

  margin: 0 auto 70px;

  padding: 42px 48px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  border: 1px solid rgba(var(--gold-rgb), 0.16);

  border-radius: 22px;

  background:
    radial-gradient(
      circle at 90% 15%,
      rgba(var(--gold-rgb), 0.13),
      transparent 18rem
    ),
    linear-gradient(
      135deg,
      rgba(var(--gold-rgb), 0.08),
      rgba(255, 255, 255, 0.82)
    );

  box-shadow:
    0 20px 55px rgba(var(--gold-rgb), 0.08);

  position: relative;

  overflow: hidden;
}


.fs-demo-cta::before {

  content: "";

  position: absolute;

  width: 180px;

  height: 180px;

  border-radius: 50%;

  background: rgba(var(--gold-rgb), 0.08);

  filter: blur(35px);

  right: 12%;

  top: -80px;

  pointer-events: none;
}


.fs-demo-content {

  position: relative;

  z-index: 2;

  max-width: 720px;
}


.fs-demo-content h2 {

  margin: 8px 0 10px;

  font-size: clamp(1.8rem, 3vw, 2.7rem);

  line-height: 1;

  letter-spacing: -0.055em;
}


.fs-demo-content h2 span {

  color: var(--fs-blue);
}


.fs-demo-content p {

  max-width: 650px;

  margin: 0;

  color: var(--fs-muted);

  font-size: 12px;

  line-height: 1.7;
}


.fs-demo-button {
    color: #17130b !important;

    background: linear-gradient(
        135deg,
        #fff1b8,
        #e5bd58,
        #c9952f
    ) !important;

    border: 1px solid rgba(255, 231, 154, 0.75);

    box-shadow:
        0 10px 28px rgba(201, 149, 47, 0.28);
}


/* ========================================================
   DEMO REQUEST MODAL
   ======================================================== */

.fs-demo-modal {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: none;

  align-items: center;

  justify-content: center;

  padding: 20px;
}


.fs-demo-modal.active {

  display: flex;

  animation: fsModalFade 0.25s ease;
}


@keyframes fsModalFade {

  from {

    opacity: 0;

  }

  to {

    opacity: 1;

  }

}


.fs-demo-overlay {

  position: absolute;

  inset: 0;

  background: rgba(0, 0, 0, 0.62);

  backdrop-filter: blur(7px);
}


.fs-demo-dialog {

  position: relative;

  z-index: 2;

  width: min(440px, 100%);

  padding: 34px;

  border: 1px solid var(--fs-border);

  border-radius: 22px;

  background: var(--fs-card);

  color: var(--fs-text);

  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.25);

  animation: fsDialogIn 0.3s ease;
}


@keyframes fsDialogIn {

  from {

    opacity: 0;

    transform: translateY(20px) scale(0.97);

  }

  to {

    opacity: 1;

    transform: translateY(0) scale(1);

  }

}


.fs-demo-close {

  position: absolute;

  top: 15px;

  right: 17px;

  width: 34px;

  height: 34px;

  display: grid;

  place-items: center;

  border: 1px solid var(--fs-border);

  border-radius: 50%;

  background: transparent;

  color: var(--fs-muted);

  font-size: 22px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}


.fs-demo-close:hover {

  background: rgba(var(--gold-rgb), 0.08);

  transform: rotate(90deg);
}


.fs-demo-icon {

  width: 48px;

  height: 48px;

  margin-bottom: 17px;

  display: grid;

  place-items: center;

  border-radius: 14px;

  background: rgba(var(--gold-rgb), 0.10);

  color: var(--fs-blue);

  font-size: 23px;

  box-shadow:
    0 10px 25px rgba(var(--gold-rgb), 0.10);
}


.fs-demo-dialog h2 {

  margin: 7px 0 8px;

  font-size: 28px;

  letter-spacing: -0.05em;
}


.fs-demo-description {

  margin: 0 0 24px;

  color: var(--fs-muted);

  font-size: 11px;

  line-height: 1.65;
}


.fs-demo-form-group {

  margin-bottom: 17px;
}


.fs-demo-form-group label {

  display: block;

  margin-bottom: 7px;

  color: var(--fs-text);

  font-size: 10px;

  font-weight: 750;
}


.fs-demo-form-group input {

  width: 100%;

  height: 46px;

  padding: 0 13px;

  border: 1px solid var(--fs-border);

  border-radius: 10px;

  outline: none;

  background: var(--fs-bg);

  color: var(--fs-text);

  font-family: inherit;

  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}


.fs-demo-form-group input:focus {

  border-color: var(--fs-blue);

  box-shadow:
    0 0 0 3px rgba(var(--gold-rgb), 0.10);
}


.fs-demo-submit {

  width: 100%;

  border: 0;

  cursor: pointer;

  font-family: inherit;
}


.fs-demo-submit:disabled {

  opacity: 0.65;

  cursor: not-allowed;
}


.fs-demo-message {

  min-height: 18px;

  margin-top: 13px;

  text-align: center;

  font-size: 10px;

  font-weight: 700;
}


.fs-demo-message.success {

  color: #1aa65a;
}


.fs-demo-message.error {

  color: var(--fs-danger);
}


/* ========================================================
   DARK MODE - DEMO REQUEST
   ======================================================== */

[data-theme="dark"] .fs-demo-cta {

  background:
    radial-gradient(
      circle at 90% 15%,
      rgba(var(--gold-rgb), 0.10),
      transparent 18rem
    ),
    linear-gradient(
      135deg,
      rgba(var(--gold-rgb), 0.12),
      rgba(16, 16, 14, 0.92)
    );

  border-color: var(--border-light);
}


[data-theme="dark"] .fs-demo-dialog {

  background: var(--surface);

  border-color: var(--border-light);
}


[data-theme="dark"] .fs-demo-form-group input {

  background: var(--bg-primary);

  border-color: var(--border-light);
}


/* ========================================================
   MOBILE
   ======================================================== */

@media (max-width: 700px) {

  .fs-demo-cta {

    padding: 32px 25px;

    flex-direction: column;

    align-items: flex-start;

  }

  .fs-demo-button {

    width: 100%;

  }

  .fs-demo-dialog {

    padding: 28px 22px;

  }

}
    /* ========================================================
       FOOTER
       ======================================================== */

    .fs-footer {
      width: min(1180px, calc(100% - 48px));

      margin: auto;

      padding: 27px 0 35px;

      display: grid;

      grid-template-columns: auto 1fr auto;

      align-items: center;

      gap: 20px;

      border-top: 1px solid var(--fs-border);

      color: var(--fs-muted);
    }

    .fs-footer .fs-brand {
      color: var(--fs-text);
    }

    .fs-footer .fs-brand img {
      width: 32px;
      height: 32px;
    }

    .fs-footer p,
    .fs-footer small {
      margin: 0;

      font-size: 9px;
    }

    /* ========================================================
       SCROLL REVEAL
       ======================================================== */

    .fs-reveal {
      opacity: 0;

      transform: translateY(22px);

      transition:
        opacity 0.7s ease,
        transform 0.7s ease;
    }

    .fs-reveal.fs-visible {
      opacity: 1;

      transform: translateY(0);
    }

    /* ========================================================
       DARK MODE
       ======================================================== */

    [data-theme="dark"] .fs-home {
      --fs-bg: var(--bg-primary);
      --fs-card: var(--surface);
      --fs-text: var(--text-primary);
      --fs-muted: var(--text-secondary);
      --fs-border: var(--border-light);

      background:
        radial-gradient(
          circle at 80% 5%,
          rgba(var(--gold-rgb), 0.14),
          transparent 28%
        ),
        var(--bg-primary);
    }

    [data-theme="dark"] .fs-nav {
      border-color: var(--fs-border);
    }

    [data-theme="dark"] .fs-nav-cta,
    [data-theme="dark"] .fs-btn-ghost,
    [data-theme="dark"] .fs-risk-card,
    [data-theme="dark"] .fs-mini-card,
    [data-theme="dark"] .fs-tech-strip,
    [data-theme="dark"] .fs-feature,
    [data-theme="dark"] .fs-step {
      background: rgba(16, 16, 14, 0.88);
      border-color: var(--fs-border);
      color: var(--fs-text);
    }

    [data-theme="dark"] .fs-risk-track {
      background: var(--surface-hover);
    }

    [data-theme="dark"] .fs-cta {
      background:
        radial-gradient(
          circle at 90% 15%,
          rgba(var(--gold-rgb), 0.08),
          transparent 18rem
        ),
        rgba(16, 16, 14, 0.75);
    }

    /* ========================================================
       RESPONSIVE
       ======================================================== */

    @media (max-width: 1000px) {
      .fs-hero {
        grid-template-columns: 1fr;

        gap: 35px;

        padding-top: 55px;
      }

      .fs-hero-copy {
        max-width: 760px;
      }

      .fs-hero-visual {
        min-height: 500px;
      }

      .fs-feature-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .fs-workflow {
        grid-template-columns: 1fr 1fr;

        gap: 14px;
      }

      .fs-step-line {
        display: none;
      }
    }

    @media (max-width: 720px) {
      .fs-nav,
      .fs-hero,
      .fs-tech-strip,
      .fs-section,
      .fs-cta,
      .fs-footer {
        width: min(100% - 30px, 600px);
      }

      .fs-nav {
        min-height: 68px;
      }

      .fs-nav-links {
        display: none;
      }

      .fs-hero {
        padding: 45px 0 35px;
      }

      .fs-hero h1 {
        font-size: clamp(3rem, 14vw, 4.5rem);
      }

      .fs-hero-text {
        font-size: 13px;
      }

      .fs-hero-visual {
        min-height: 420px;
      }

      .fs-orbit-outer {
        width: 350px;
        height: 350px;
      }

      .fs-orbit-inner {
        width: 270px;
        height: 270px;
      }

      .fs-risk-card {
        width: min(360px, 85%);
      }

      .fs-mini-card {
        min-width: 150px;
      }

      .fs-mini-stream {
        left: -3px;
        top: 16%;
      }

      .fs-mini-alert {
        right: -3px;
        bottom: 13%;
      }

      .fs-tech-strip {
        grid-template-columns: repeat(2, 1fr);

        margin-bottom: 50px;
      }

      .fs-tech-item {
        border-right: 0;
      }

      .fs-tech-item:nth-child(-n + 2) {
        border-bottom: 1px solid var(--fs-border);
      }

      .fs-feature-grid {
        grid-template-columns: 1fr;
      }

      .fs-section {
        padding: 45px 0 65px;
      }

      .fs-workflow {
        grid-template-columns: 1fr;
      }

      .fs-cta {
        flex-direction: column;

        align-items: flex-start;

        padding: 32px 25px;
      }

      .fs-footer {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 450px) {
      .fs-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .fs-btn {
        width: 100%;
      }

      .fs-hero-visual {
        min-height: 365px;
      }

      .fs-risk-card {
        width: 90%;
        padding: 18px;
      }

      .fs-mini-card {
        transform: scale(0.86);
      }

      .fs-mini-stream {
        left: -23px;
      }

      .fs-mini-alert {
        right: -23px;
      }

      .fs-orbit-outer {
        width: 310px;
        height: 310px;
      }

      .fs-orbit-inner {
        width: 235px;
        height: 235px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .fs-home *,
      .fs-home *::before,
      .fs-home *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    }
  `;

  document.head.appendChild(style);
}


export function renderHome() {
  injectHomeStyles();

  return `
    <main class="fs-home">

      <!-- ================= NAVBAR ================= -->

      <nav class="fs-nav" aria-label="Main navigation">

        <a
          href="#/home"
          class="fs-brand"
          aria-label="FraudShieldAI home"
        >
         <img
            src="assets/images/FraudShieldAI_full_logo.png"
            alt="FraudShield AI"
            class="full-brand-logo"
          />

          
        </a>


        <div class="fs-nav-links">

          <a
            href="#/home"
            data-scroll="top"
          >
            Home
          </a>

          <a
            href="#/home"
            data-scroll="features"
          >
            Features
          </a>

          <a
            href="#/home"
            data-scroll="how-it-works"
          >
            How it works
          </a>

        </div>

      <div class="fs-nav-actions">

  <button
    type="button"
    class="fs-theme-toggle"
    id="home-theme-toggle"
    aria-label="Switch theme"
    title="Switch theme"
  >
    <span class="fs-theme-icon">☾</span>
    <span class="fs-theme-text">Dark</span>
  </button>

  <a
    href="#/login"
    class="fs-nav-cta"
  >
    Open Console
    <span>↗</span>
  </a>

</div>
        

      </nav>


      <!-- ================= HERO ================= -->

      <section
        class="fs-hero"
        id="top"
      >

        <div class="fs-hero-copy fs-reveal">

          <div class="fs-eyebrow">
            <span class="fs-pulse"></span>

            REAL-TIME FRAUD INTELLIGENCE
          </div>


          <h1>
            Stop fraud
            <span>before it spreads.</span>
          </h1>


          <p class="fs-hero-text">
            FraudShieldAI combines real-time transaction streaming,
            machine-learning risk scoring, anomaly detection and
            intelligent alerts to help financial teams detect
            suspicious activity before it becomes a loss.
          </p>


          <div class="fs-actions">

            <a
              href="#/login"
              class="fs-btn fs-btn-primary"
            >
              Launch Operations Console
              <span>→</span>
            </a>


            <a
              href="#/home"
              class="fs-btn fs-btn-ghost"
              data-scroll="features"
            >
              Explore Protection
            </a>

          </div>


          <div class="fs-proof">

            <span>
              <i>✓</i>
              Live monitoring
            </span>

            <span>
              <i>✓</i>
              ML risk scoring
            </span>

            <span>
              <i>✓</i>
              Automated alerts
            </span>

          </div>

        </div>


        <!-- ================= ANIMATED VISUAL ================= -->

        <div
          class="fs-hero-visual fs-reveal"
          aria-label="FraudShieldAI fraud detection visualization"
        >

          <div class="fs-grid"></div>

          <div class="fs-glow fs-glow-a"></div>
          <div class="fs-glow fs-glow-b"></div>


          <div class="fs-orbit fs-orbit-outer"></div>
          <div class="fs-orbit fs-orbit-inner"></div>


          <div class="fs-node fs-node-a"></div>
          <div class="fs-node fs-node-b"></div>
          <div class="fs-node fs-node-c"></div>


          <!-- MAIN RISK CARD -->

          <div class="fs-risk-card">

            <div class="fs-card-top">

              <div>
                <span class="fs-live-dot"></span>
                AI ENGINE
              </div>

              <span class="fs-active">
                ACTIVE
              </span>

            </div>


            <div class="fs-shield-wrap">

              <div class="fs-shield-ring"></div>

              <div class="fs-shield">
              <img
              src="assets/images/fraud-shield.png"
              alt="FraudShield AI security shield"
              class="fs-shield-image"
           />
         </div>

            </div>


            <div class="fs-score-row">

              <div>

                <small>
                  Current risk score
                </small>

                <strong>
                  <span data-counter="92.4">
                    0
                  </span>%
                </strong>

              </div>

              <span class="fs-risk-label">
                HIGH RISK
              </span>

            </div>


            <div class="fs-risk-track">
              <span></span>
            </div>


            <div class="fs-transaction">

              <div>

                <small>
                  Transaction
                </small>

                <b>
                  #TX-847291
                </b>

              </div>


              <div>

                <small>
                  Model
                </small>

                <b>
                  XGBoost + IF
                </b>

              </div>


              <div class="fs-status-block">

                <small>
                  Decision
                </small>

                <b>
                  FRAUD DETECTED
                </b>

              </div>

            </div>

          </div>


          <!-- FLOATING STREAM CARD -->

          <div class="fs-mini-card fs-mini-stream">

            <span class="fs-mini-icon">
              ↯
            </span>

            <div>

              <b>
                Transaction stream
              </b>

              <small>
                Kafka pipeline online
              </small>

            </div>

          </div>


          <!-- FLOATING ALERT CARD -->

          <div class="fs-mini-card fs-mini-alert">

            <span class="fs-mini-icon">
              !
            </span>

            <div>

              <b>
                Alert generated
              </b>

              <small>
                Risk threshold exceeded
              </small>

            </div>

          </div>


          <div class="fs-scan-line"></div>

        </div>

      </section>


      <!-- ================= TECHNOLOGY ================= -->

      <section
        class="fs-tech-strip fs-reveal"
        aria-label="FraudShieldAI technologies"
      >

        <div class="fs-tech-item">

          <span class="fs-tech-mark">
            K
          </span>

          <div>
            <b>Apache Kafka</b>
            <small>Real-time streaming</small>
          </div>

        </div>


        <div class="fs-tech-item">

          <span class="fs-tech-mark">
            X
          </span>

          <div>
            <b>XGBoost</b>
            <small>Fraud prediction</small>
          </div>

        </div>


        <div class="fs-tech-item">

          <span class="fs-tech-mark">
            IF
          </span>

          <div>
            <b>Isolation Forest</b>
            <small>Anomaly detection</small>
          </div>

        </div>


        <div class="fs-tech-item">

          <span class="fs-tech-mark">
            DB
          </span>

          <div>
            <b>MongoDB</b>
            <small>Operations data</small>
          </div>

        </div>

      </section>


      <!-- ================= FEATURES ================= -->

      <section
        class="fs-section"
        id="features"
      >

        <div class="fs-section-head fs-reveal">

          <span class="fs-kicker">
            WHY FRAUDSHIELDAI
          </span>

          <h2>
            One security layer for the
            <span>entire fraud journey.</span>
          </h2>

          <p>
            From the first transaction signal to the final
            investigation decision, FraudShieldAI keeps every
            important event visible and actionable.
          </p>

        </div>


        <div class="fs-feature-grid">


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              01
            </span>

            <div class="fs-feature-icon">
              ↯
            </div>

            <h3>
              Real-time monitoring
            </h3>

            <p>
              Continuously monitor transactions as they move
              through the Kafka-powered streaming pipeline.
            </p>

          </article>


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              02
            </span>

            <div class="fs-feature-icon">
              AI
            </div>

            <h3>
              AI risk scoring
            </h3>

            <p>
              Combine XGBoost prediction with Isolation Forest
              anomaly detection to identify suspicious behaviour.
            </p>

          </article>


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              03
            </span>

            <div class="fs-feature-icon">
              !
            </div>

            <h3>
              Instant alerts
            </h3>

            <p>
              Automatically generate alerts when transactions
              exceed configured fraud-risk thresholds.
            </p>

          </article>


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              04
            </span>

            <div class="fs-feature-icon">
              ⌕
            </div>

            <h3>
              Investigator workflow
            </h3>

            <p>
              Move from suspicious transactions to investigation
              cases while keeping the relevant context together.
            </p>

          </article>


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              05
            </span>

            <div class="fs-feature-icon">
              ◒
            </div>

            <h3>
              Risk intelligence
            </h3>

            <p>
              Understand transaction trends, risk distributions
              and model behaviour from one operational console.
            </p>

          </article>


          <article class="fs-feature fs-reveal">

            <span class="fs-feature-number">
              06
            </span>

            <div class="fs-feature-icon">
              ✓
            </div>

            <h3>
              Role-based security
            </h3>

            <p>
              Protect sensitive fraud operations using
              role-based access controls for your teams.
            </p>

          </article>


        </div>

      </section>


      <!-- ================= HOW IT WORKS ================= -->

      <section
        class="fs-section"
        id="how-it-works"
      >

        <div class="fs-section-head fs-reveal">

          <span class="fs-kicker">
            HOW IT WORKS
          </span>

          <h2>
            Signal in.
            <span>Decision out.</span>
          </h2>

          <p>
            A simple four-stage pipeline turns raw transaction
            activity into an intelligent fraud decision.
          </p>

        </div>


        <div class="fs-workflow">


          <article class="fs-step fs-reveal">

            <span class="fs-step-number">
              01
            </span>

            <h3>
              Ingest
            </h3>

            <p>
              Transactions enter the system through the
              Kafka streaming pipeline.
            </p>

          </article>


          <div class="fs-step-line"></div>


          <article class="fs-step fs-reveal">

            <span class="fs-step-number">
              02
            </span>

            <h3>
              Analyze
            </h3>

            <p>
              Transaction features are prepared and passed
              into the machine-learning pipeline.
            </p>

          </article>


          <div class="fs-step-line"></div>


          <article class="fs-step fs-reveal">

            <span class="fs-step-number">
              03
            </span>

            <h3>
              Detect
            </h3>

            <p>
              XGBoost and Isolation Forest calculate the
              final transaction risk.
            </p>

          </article>


          <div class="fs-step-line"></div>


          <article class="fs-step fs-reveal">

            <span class="fs-step-number">
              04
            </span>

            <h3>
              Respond
            </h3>

            <p>
              High-risk transactions generate alerts and
              investigation cases.
            </p>

          </article>


        </div>

      </section>


      <!-- ================= CTA ================= -->

      <section class="fs-cta fs-reveal">

        <div>

          <span class="fs-kicker">
            READY TO DETECT FRAUD?
          </span>

          <h2>
            Make every transaction
            <span>defensible.</span>
          </h2>

          <p>
            Open the operations console and see your fraud
            detection pipeline in action.
          </p>

        </div>


        <a
          href="#/login"
          class="fs-btn fs-btn-primary"
        >
          Open Operations Console
          <span>→</span>
        </a>

      </section>
      <!-- ================= REQUEST A DEMO ================= -->

<section class="fs-demo-cta fs-reveal">

  <div class="fs-demo-content">

    <span class="fs-kicker">
      WANT TO SEE IT IN ACTION?
    </span>

    <h2>
      Ready to experience
      <span>FraudShieldAI?</span>
    </h2>

    <p>
      Discover how real-time AI fraud detection can help
      your organization identify suspicious transactions
      before they become a threat.
    </p>

  </div>


  <button
    type="button"
    id="contact-us-btn"
    class="fs-btn fs-btn-primary fs-demo-button"
  >
    Contact Us
    <span>→</span>
  </button>

</section>


<!-- ================= DEMO REQUEST MODAL ================= -->

<div
  id="demo-request-modal"
  class="fs-demo-modal"
  aria-hidden="true"
>

  <div
    class="fs-demo-overlay"
    id="demo-modal-overlay"
  ></div>


  <div
    class="fs-demo-dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="demo-modal-title"
  >

    <button
      type="button"
      id="close-demo-modal"
      class="fs-demo-close"
      aria-label="Close request form"
    >
      ×
    </button>


    <div class="fs-demo-icon">
      🛡
    </div>


    <span class="fs-kicker">
      CONTACT FRAUDSHIELD AI
    </span>


    <h2 id="demo-modal-title">
      Request a Demo
    </h2>


    <p class="fs-demo-description">
      Tell us a little about yourself and our team
      will get in touch with you.
    </p>


    <form id="demo-request-form">

      <div class="fs-demo-form-group">

        <label for="demo-name">
          Your Name
        </label>

        <input
          type="text"
          id="demo-name"
          name="name"
          placeholder="Enter your name"
          autocomplete="name"
          required
        />

      </div>


      <div class="fs-demo-form-group">

        <label for="demo-email">
          Email Address
        </label>

        <input
          type="email"
          id="demo-email"
          name="email"
          placeholder="you@example.com"
          autocomplete="email"
          required
        />

      </div>


      <button
        type="submit"
        id="demo-submit-btn"
        class="fs-btn fs-btn-primary fs-demo-submit"
      >

        <span>
          Request a Demo
        </span>

        <span>
          →
        </span>

      </button>


      <div
        id="demo-request-message"
        class="fs-demo-message"
        role="status"
      ></div>

    </form>

  </div>

</div>

      <!-- ================= FOOTER ================= -->

      <footer class="fs-footer">

        <a
          href="#/home"
          class="fs-brand"
        >

         <img
            src="assets/images/FraudShieldAI_full_logo.png"
            alt="FraudShield AI"
            class="login-full-logo"
         />

          
        </a>


        <p>
          AI-powered real-time financial fraud detection.
        </p>


        <small>
          © 2026 FraudShieldAI
        </small>

      </footer>

    </main>
  `;
}


// ============================================================
// HOME PAGE EVENTS
// ============================================================

export function initHomeEvents() {

  const root = document.querySelector(".fs-home");

  if (!root) return;


  // ----------------------------------------------------------
  // Smooth scrolling
  // ----------------------------------------------------------

  root.querySelectorAll("[data-scroll]").forEach((link) => {

    link.addEventListener("click", (event) => {

      event.preventDefault();

      const targetName = link.dataset.scroll;

      const target =
        targetName === "top"
          ? root.querySelector("#top")
          : root.querySelector(`#${targetName}`);

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  // ----------------------------------------------------------
  // Scroll reveal animation
  // ----------------------------------------------------------

  const revealItems =
    root.querySelectorAll(".fs-reveal");


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(

        (entries, obs) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "fs-visible"
              );

              obs.unobserve(entry.target);

            }

          });

        },

        {
          threshold: 0.12
        }

      );


    revealItems.forEach((item) => {

      observer.observe(item);

    });

  } else {

    revealItems.forEach((item) => {

      item.classList.add("fs-visible");

    });

  }


  // ----------------------------------------------------------
  // Animated risk score
  // ----------------------------------------------------------

  const counter =
    root.querySelector("[data-counter]");


  if (counter) {

    let started = false;


    const startCounter = () => {

      if (started) return;

      started = true;

      const target =
        Number(counter.dataset.counter || 0);

      const startTime =
        performance.now();

      const duration = 1000;


      const animate = (currentTime) => {

        const progress =
          Math.min(
            (currentTime - startTime) /
            duration,
            1
          );


        // Smooth easing
        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );


        counter.textContent =
          (target * eased).toFixed(1);


        if (progress < 1) {

          requestAnimationFrame(
            animate
          );

        }

      };


      requestAnimationFrame(
        animate
      );

    };


    if ("IntersectionObserver" in window) {

      const counterObserver =
        new IntersectionObserver(

          (entries, observer) => {

            if (
              entries[0].isIntersecting
            ) {

              startCounter();

              observer.disconnect();

            }

          },

          {
            threshold: 0.5
          }

        );


      counterObserver.observe(counter);

    } else {

      startCounter();

    }

  }
  // ----------------------------------------------------------
  // Theme switcher
  // ----------------------------------------------------------

  const themeToggle =
    document.getElementById(
      "home-theme-toggle"
    );

  const themeIcon =
    themeToggle?.querySelector(
      ".fs-theme-icon"
    );

  const themeText =
    themeToggle?.querySelector(
      ".fs-theme-text"
    );


  function applyHomeTheme(theme) {

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );


    localStorage.setItem(
      "fraudshield-theme",
      theme
    );


    if (theme === "dark") {

      if (themeIcon) {
        themeIcon.textContent = "☀";
      }

      if (themeText) {
        themeText.textContent = "Light";
      }

      themeToggle?.setAttribute(
        "aria-label",
        "Switch to light theme"
      );

      themeToggle?.setAttribute(
        "title",
        "Switch to light theme"
      );

    } else {

      if (themeIcon) {
        themeIcon.textContent = "☾";
      }

      if (themeText) {
        themeText.textContent = "Dark";
      }

      themeToggle?.setAttribute(
        "aria-label",
        "Switch to dark theme"
      );

      themeToggle?.setAttribute(
        "title",
        "Switch to dark theme"
      );

    }

  }


  const savedTheme =
    localStorage.getItem(
      "fraudshield-theme"
    );


  const initialTheme =
    savedTheme === "dark"
      ? "dark"
      : "light";


  applyHomeTheme(
    initialTheme
  );


  themeToggle?.addEventListener(
    "click",
    () => {

      const currentTheme =
        document.documentElement.getAttribute(
          "data-theme"
        );


      applyHomeTheme(
        currentTheme === "dark"
          ? "light"
          : "dark"
      );

    }
  );
    // ----------------------------------------------------------
  // Request a Demo modal
  // ----------------------------------------------------------

  const contactButton =
    document.getElementById(
      "contact-us-btn"
    );

  const demoModal =
    document.getElementById(
      "demo-request-modal"
    );

  const closeDemoModal =
    document.getElementById(
      "close-demo-modal"
    );

  const demoOverlay =
    document.getElementById(
      "demo-modal-overlay"
    );

  const demoForm =
    document.getElementById(
      "demo-request-form"
    );


  const openDemoModal = () => {

    if (!demoModal) return;

    demoModal.classList.add("active");

    demoModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

    setTimeout(() => {

      document
        .getElementById("demo-name")
        ?.focus();

    }, 100);

  };


  const closeDemoModalWindow = () => {

    if (!demoModal) return;

    demoModal.classList.remove("active");

    demoModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

  };


  contactButton?.addEventListener(
    "click",
    openDemoModal
  );


  closeDemoModal?.addEventListener(
    "click",
    closeDemoModalWindow
  );


  demoOverlay?.addEventListener(
    "click",
    closeDemoModalWindow
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        demoModal?.classList.contains("active")
      ) {

        closeDemoModalWindow();

      }

    }
  );


  // ----------------------------------------------------------
  // Demo request form
  // ----------------------------------------------------------

  demoForm?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const name =
        document
          .getElementById("demo-name")
          ?.value
          .trim();

      const email =
        document
          .getElementById("demo-email")
          ?.value
          .trim();

      const submitButton =
        document.getElementById(
          "demo-submit-btn"
        );

      const message =
        document.getElementById(
          "demo-request-message"
        );


      if (!name || !email) {

        if (message) {

          message.textContent =
            "Please enter your name and email.";

          message.className =
            "fs-demo-message error";

        }

        return;

      }


      try {

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.innerHTML = `
            <span>Submitting...</span>
            <span>...</span>
          `;

        }


        const response =
          await fetch(
            "/api/v1/demo-requests",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                name,
                email
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Unable to submit demo request."
          );

        }


        if (message) {

          message.textContent =
            "✓ Request submitted successfully! Our team will contact you.";

          message.className =
            "fs-demo-message success";

        }


        demoForm.reset();


        setTimeout(() => {

          closeDemoModalWindow();

          if (message) {

            message.textContent = "";

            message.className =
              "fs-demo-message";

          }

        }, 2200);


      } catch (error) {

        console.error(
          "Demo request error:",
          error
        );


        if (message) {

          message.textContent =
            error.message ||
            "Something went wrong. Please try again.";

          message.className =
            "fs-demo-message error";

        }

      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML = `
            <span>Request a Demo</span>
            <span>→</span>
          `;

        }

      }

    }
  );
  
}
