import React, { useState } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Volume2,
  Smile,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Layers,
  Mail,
  ExternalLink
} from 'lucide-react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=games.adityagagare.mathapacchi';

const SCREENSHOTS = [
  { src: '/matha-pacchi/01_home.jpg', alt: 'Matha Pacchi home screen' },
  { src: '/matha-pacchi/02_gameplay.jpg', alt: 'A card during a round, with tilt controls' },
  { src: '/matha-pacchi/03_chaos.jpg', alt: 'Chaos Mode rules striking mid-round' },
  { src: '/matha-pacchi/04_decks.jpg', alt: 'Deck picker with 12 decks' },
  { src: '/matha-pacchi/05_deck.jpg', alt: 'Bollywood Chaos deck details' },
  { src: '/matha-pacchi/06_results.jpg', alt: 'Results screen with score' },
  { src: '/matha-pacchi/07_rules.jpg', alt: 'The seven chaos rules' },
  { src: '/matha-pacchi/08_unlock.jpg', alt: 'Unlock all decks screen' },
];

const FREE_DECKS = [
  ['🏠', 'Daily Desi Chaos', 'power cuts, cooker whistles, "Shaadi kab karoge?"'],
  ['🏏', 'Cricket Chaos', 'gully rules, helicopter shots, iconic moments'],
  ['🪣', 'Household Objects', 'everyday things, surprisingly hard to explain'],
  ['🦚', 'Animals & Birds', 'roar, chirp and flap your way to victory'],
];

const PREMIUM_DECKS = [
  ['🎬', 'Bollywood Chaos', 'heroes, villains and famous dialogues'],
  ['🤣', 'Cult Comedy', 'Hera Pheri, Welcome, Golmaal and more'],
  ['📼', '2000s Nostalgia', 'Shaktimaan, Beyblade, Nokia 3310'],
  ['🌍', 'Duniya Gol Hai', 'world wonders and famous places'],
  ['🇮🇳', 'Bharat Ka Gyaan', 'landmarks, achievements, festivals'],
  ['🔬', 'Science Ka Chakkar', 'physics to biology, easy to brain-melting'],
  ['🏛️', 'Itihaas Ke Panne', 'rulers, revolutions, strange history'],
  ['🧠', 'Brainrot Chaos', 'Italian brainrot and Gen Z slang'],
];

const DECK_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '0.75rem',
  fontSize: '0.92rem',
  color: '#3b0764',
  fontWeight: 700,
  listStyleType: 'none',
  padding: 0,
  margin: 0
};

const DECK_ITEM = {
  background: '#ffffff',
  border: '2px solid #000',
  borderRadius: '12px',
  padding: '0.65rem 0.85rem',
  boxShadow: '3px 3px 0px #000'
};

export function MathaPacchiPage({ onNavigateHome }) {
  const [copiedPrivacy, setCopiedPrivacy] = useState(false);

  const privacyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/privacy.html`
    : 'https://games.adityagagare.in/privacy.html';

  const handleCopyPrivacy = () => {
    navigator.clipboard.writeText(privacyUrl);
    setCopiedPrivacy(true);
    setTimeout(() => setCopiedPrivacy(false), 2500);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'calc(1.5rem + var(--sat)) 1.25rem calc(3.5rem + var(--sab))',
      background: '#faf9f6',
      color: '#111111',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Shared Unified Header */}
      <header style={{
        width: '100%',
        maxWidth: '920px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid #e2e0d8'
      }}>
        <button
          onClick={onNavigateHome}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} style={{ color: '#111111' }} />
          <span style={{
            fontWeight: 900,
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#111111'
          }}>
            ADITYA GAGARE
          </span>
          <span style={{ color: '#a09d94', fontWeight: 400 }}>/</span>
          <span style={{
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#66635b'
          }}>
            GAMES
          </span>
        </button>

        <a
          href="https://adityagagare.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#66635b',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'color 0.2s ease'
          }}
        >
          adityagagare.in
          <ExternalLink size={13} style={{ color: '#a09d94' }} />
        </a>
      </header>

      {/* Main Page Content Container */}
      <div style={{ width: '100%', maxWidth: '920px' }}>
        {/* 1. HOOK (OVERSIZED LOUD COMIC CARD IN UNIFIED CONTAINER) */}
        <div className="comic-card" style={{ padding: 'clamp(1.75rem, 5vw, 2.75rem)', background: '#fef08a', marginBottom: '2.5rem', textAlign: 'center', transform: 'rotate(-0.5deg)' }}>
          <h1 style={{
            fontFamily: "'Fredoka', cursive, sans-serif",
            fontSize: 'clamp(2.6rem, 9vw, 5rem)',
            fontWeight: 900,
            color: '#000000',
            lineHeight: 0.95,
            marginBottom: '0.6rem',
            textShadow: '3px 3px 0px #f59e0b',
            textTransform: 'uppercase'
          }}>
            MATHA<br />PACCHI!
          </h1>

          <p style={{
            fontFamily: "'Fredoka', cursive, sans-serif",
            fontSize: 'clamp(1.25rem, 4vw, 1.85rem)',
            fontWeight: 800,
            color: '#000000',
            margin: 0
          }}>
            You can't see it. They can.
          </p>
        </div>

        {/* 2. HOW IT WORKS (VISUAL STEPS) */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            maxWidth: '480px',
            margin: '0 auto 1.75rem'
          }}>
            <div className="step-pill" style={{ width: '100%', justifyContent: 'center' }}>
              <Smartphone size={20} style={{ color: '#0284c7' }} />
              PUT THE PHONE ON YOUR HEAD
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000' }}>↓</span>

            <div className="step-pill step-pill-highlight" style={{ width: '100%', justifyContent: 'center' }}>
              <Volume2 size={20} />
              YOUR FRIENDS SCREAM CLUES
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000' }}>↓</span>

            <div className="step-pill" style={{ width: '100%', justifyContent: 'center' }}>
              <Smile size={20} style={{ color: '#16a34a' }} />
              GUESS THE WORD
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000' }}>↓</span>

            <div className="step-pill step-pill-highlight" style={{ width: '100%', justifyContent: 'center', background: '#ef4444', color: '#ffffff' }}>
              <Zap size={20} />
              TILT DOWN / UP TO SCORE
            </div>
          </div>

          <div className="comic-card" style={{ padding: '1.4rem', background: '#ffffff', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
            <p style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.35rem', fontWeight: 900, color: '#000', marginBottom: '0.35rem' }}>
              That's it.
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', lineHeight: 1.5, margin: 0 }}>
              Zero tutorials. Zero complex controls. Just you, your friends, and a phone that knows what you're trying to guess.
            </p>
          </div>
        </div>

        {/* 3. WHAT IT IS */}
        <div className="comic-card" style={{ padding: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '2.2rem', textAlign: 'left' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', marginBottom: '0.5rem' }}>
            What it is
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.65, fontWeight: 600, margin: 0 }}>
            An offline, in-person party guessing game made for Indian living rooms, hostel rooms, road trips and family functions. Hold the phone to your forehead in landscape while your friends act out, sing and shout clues. Tilt down when you get it, tilt up to pass.
          </p>
        </div>

        {/* 4. WHY I MADE IT */}
        <div className="comic-card" style={{ padding: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '2.2rem', textAlign: 'left', background: '#fef08a' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', marginBottom: '0.7rem' }}>
            Why I made it
          </h2>
          <div style={{ fontSize: '1.02rem', color: '#1e293b', lineHeight: 1.65, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>Most party apps turn your phone into a screen you stare at alone.</p>
            <p>I wanted to make one where the phone disappears into the background.</p>
            <p style={{ fontSize: '1.12rem', color: '#854d0e', margin: '0.2rem 0 0' }}>
              The screen knows the answer.<br />
              Your friends know the answer.<br />
              <strong>You don't.</strong>
            </p>
          </div>
        </div>

        {/* 5. SCREENSHOTS */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', marginBottom: '1rem', textAlign: 'left' }}>
            Inside the game
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.9rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}>
            {SCREENSHOTS.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                width={540}
                height={960}
                style={{
                  width: 'clamp(170px, 42vw, 230px)',
                  height: 'auto',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  borderRadius: '16px',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px #000'
                }}
              />
            ))}
          </div>
        </div>

        {/* 6. DECKS */}
        <div className="comic-card" style={{ padding: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '2.2rem', textAlign: 'left', background: '#faf5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Layers size={24} style={{ color: '#9333ea' }} />
            <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', margin: 0 }}>
              12 Decks · 845 Cards
            </h2>
          </div>
          <p style={{ fontSize: '0.98rem', color: '#3b0764', fontWeight: 600, marginBottom: '1.2rem' }}>
            Every card is written for desi groups. Chaos Mode adds surprise rules mid-round: act only, one word only, whisper, sing it out.
          </p>

          <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.1rem', fontWeight: 900, color: '#15803d', margin: '0 0 0.6rem' }}>
            Free to play
          </h3>
          <ul style={DECK_GRID}>
            {FREE_DECKS.map(([emoji, name, blurb]) => (
              <li key={name} style={DECK_ITEM}>{emoji} <strong>{name}</strong> — {blurb}</li>
            ))}
          </ul>

          <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.1rem', fontWeight: 900, color: '#7e22ce', margin: '1.4rem 0 0.6rem' }}>
            Premium decks
          </h3>
          <ul style={DECK_GRID}>
            {PREMIUM_DECKS.map(([emoji, name, blurb]) => (
              <li key={name} style={DECK_ITEM}>{emoji} <strong>{name}</strong> — {blurb}</li>
            ))}
          </ul>
        </div>

        {/* 7. GET IT */}
        <div className="comic-card" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '2.2rem', textAlign: 'center', background: '#fbbf24' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.9rem', fontWeight: 900, color: '#000', marginBottom: '0.4rem' }}>
            Get Matha Pacchi
          </h2>
          <p style={{ fontSize: '0.98rem', fontWeight: 800, color: '#000', marginBottom: '1.2rem' }}>
            Free on Google Play for Android. Offline, no ads, no sign-up.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="comic-btn-yellow"
              style={{ background: '#000000', color: '#ffffff' }}
            >
              <Download size={20} />
              Get it on Google Play
            </a>
          </div>

          <div style={{ background: '#ffffff', border: '2.5px solid #000', borderRadius: '14px', padding: '1rem 1.1rem', textAlign: 'left', boxShadow: '4px 4px 0px #000' }}>
            <p style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.15rem', fontWeight: 900, color: '#000', margin: '0 0 0.4rem' }}>
              4 decks free. Unlock all 12 for ₹249, once.
            </p>
            <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155', lineHeight: 1.55, margin: '0 0 0.6rem' }}>
              One-time purchase, no subscription. Or share the game with five friends on WhatsApp to try every premium deck free for 24 hours.
            </p>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Payments are processed by Google Play. For any issue with a charge, refund or payment method, please contact Google Play support. Purchases can be restored on any device signed in to the same Google account.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.1rem' }}>
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="comic-badge"
              style={{ textDecoration: 'none', background: '#ffffff' }}
            >
              <ShieldCheck size={14} />
              Privacy Policy
              <ExternalLink size={12} />
            </a>
            <button
              onClick={handleCopyPrivacy}
              className="comic-badge"
              style={{ cursor: 'pointer', background: '#ffffff' }}
            >
              {copiedPrivacy ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              {copiedPrivacy ? 'Copied!' : 'Copy policy link'}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Unified Footer */}
      <footer style={{
        maxWidth: '920px',
        width: '100%',
        borderTop: '1px solid #e2e0d8',
        paddingTop: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.88rem',
        fontWeight: 600,
        color: '#66635b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={onNavigateHome} style={{ background: 'none', border: 'none', color: '#111111', fontWeight: 800, cursor: 'pointer' }}>
            Aditya Gagare
          </button>
          <span>•</span>
          <button onClick={onNavigateHome} style={{ background: 'none', border: 'none', color: '#66635b', fontWeight: 600, cursor: 'pointer' }}>
            Games
          </button>
          <span>•</span>
          <span style={{ fontWeight: 800, color: '#111111' }}>Matha Pacchi</span>
          <span>•</span>
          <a href="https://adityagagare.in" target="_blank" rel="noopener noreferrer" style={{ color: '#66635b', textDecoration: 'none' }}>
            adityagagare.in
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <a href="mailto:hello@adityagagare.in" style={{ color: '#111111', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Mail size={14} />
            hello@adityagagare.in
          </a>
          <span>© 2026 Aditya Gagare</span>
        </div>
      </footer>
    </div>
  );
}
