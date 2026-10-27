import React from 'react';

export const Home: React.FC = () => {
  return (
    <div className="page-container">
      <style>{`
        :root {
          --cream-bg: #FAF8F5;
          --cream-border: #E8E3DA;
          --ink-primary: #1C1917;
          --ink-secondary: #57534E;
          --ink-muted: #8C827A;
          --serif-font: 'Newsreader', Garamond, 'Times New Roman', serif;
          --sans-font: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--cream-bg);
          color: var(--ink-primary);
          font-family: var(--sans-font);
        }

        .page-container {
          min-height: 100vh;
          background-color: var(--cream-bg);
          color: var(--ink-primary);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle organic vignette warmth without colored gradients */
        .page-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(250, 248, 245, 0) 75%);
          pointer-events: none;
        }

        /* Header / Brand */
        .site-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .brand-link {
          display: flex;
          align-items: baseline;
          gap: 6px;
          text-decoration: none;
          color: var(--ink-primary);
        }

        .brand-name {
          font-family: var(--serif-font);
          font-size: 1.5rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .brand-tld {
          font-family: var(--sans-font);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--ink-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Main Hero Content */
        .hero-main {
          position: relative;
          z-index: 10;
          max-width: 860px;
          margin: auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 0;
        }

        .main-title {
          font-family: var(--serif-font);
          font-size: 4.5rem;
          line-height: 1.08;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: var(--ink-primary);
          margin-bottom: 28px;
          max-width: 820px;
        }

        .main-title em {
          font-style: italic;
          font-weight: 300;
          color: #44403C;
        }

        .main-subtitle {
          font-size: 1.22rem;
          line-height: 1.7;
          color: var(--ink-secondary);
          font-weight: 300;
          max-width: 620px;
          margin: 0 auto;
          letter-spacing: -0.01em;
        }

        /* Footer */
        .site-footer {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid rgba(232, 227, 218, 0.6);
          font-size: 0.82rem;
          color: var(--ink-muted);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-container {
            padding: 24px 20px;
          }
          .main-title {
            font-size: 2.85rem;
          }
          .main-subtitle {
            font-size: 1.05rem;
          }
        }
      `}</style>

      {/* Top Navigation / Brand */}
      <header className="site-header">
        <a href="/" className="brand-link">
          <span className="brand-name">SpeakFluent</span>
          <span className="brand-tld">tech</span>
        </a>
      </header>

      {/* Main Landing Page Hero */}
      <main className="hero-main">
        <h1 className="main-title">
          Speak with effortless <em>grace</em> and clarity.
        </h1>

        <p className="main-subtitle">
          A calm, refined environment for conversational poise, pronunciation, and spoken presence. Designed for those who value understated confidence over noise.
        </p>
      </main>

      {/* Minimal Footer */}
      <footer className="site-footer">
        <div>© {new Date().getFullYear()} SpeakFluent. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
