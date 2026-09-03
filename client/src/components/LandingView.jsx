import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Smartphone,
  Zap,
  Brain,
  Wrench,
  CheckCircle2,
  Volume2,
  VolumeX,
  Music,
  Smile,
  MessageSquare,
  Download,
  Mail,
  Layers,
  HelpCircle,
  FileCode,
  Globe
} from 'lucide-react';

export function LandingView({ onOpenFixit }) {
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
    <div className="home-container mp-bg" style={{ minHeight: '100dvh', color: '#000000' }}>
      {/* Navigation Header */}
      <nav className="home-nav" style={{ maxWidth: '900px', width: '100%', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: '#fbbf24',
            border: '3px solid #000',
            borderRadius: '14px',
            padding: '6px 12px',
            fontWeight: 900,
            fontSize: '1.1rem',
            boxShadow: '3px 3px 0px #000'
          }}>
            🙆🏽‍♂️ MAATHA PACCHI!
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="comic-badge"
            style={{ textDecoration: 'none', background: '#ffffff' }}
          >
            <ShieldCheck size={16} style={{ color: '#0284c7' }} />
            Privacy Policy
          </a>

          <button
            onClick={onOpenFixit}
            className="comic-badge"
            style={{ background: '#d1fae5', cursor: 'pointer' }}
          >
            <Wrench size={16} style={{ color: '#059669' }} />
            FixIT Village Online
          </button>
        </div>
      </nav>

      {/* HERO SECTION: MAATHA PACCHI ARTWORK & MAIN CTA */}
      <div style={{ maxWidth: '860px', width: '100%', textAlign: 'center', marginBottom: '2.5rem' }}>
        {/* Official Artwork Hero Image */}
        <div className="comic-card" style={{ padding: '1rem', background: '#fef08a', marginBottom: '1.5rem', transform: 'rotate(-0.5deg)' }}>
          <img
            src="/matha_pacchi_cover.jpg"
            alt="MAATHA PACCHI! You can't see it. They can."
            style={{
              maxHeight: '380px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              borderRadius: '16px'
            }}
          />
        </div>

        {/* Hero Title & Subtitle */}
        <h1 style={{
          fontFamily: "'Fredoka', cursive, sans-serif",
          fontSize: 'clamp(2.6rem, 8vw, 4.2rem)',
          fontWeight: 900,
          color: '#000000',
          lineHeight: 1.05,
          marginBottom: '0.4rem',
          textShadow: '2px 2px 0px #f59e0b'
        }}>
          MAATHA PACCHI! <span style={{ fontSize: '70%', color: '#d97706' }}>(माथा पच्ची)</span>
        </h1>

        <p style={{
          fontFamily: "'Fredoka', cursive, sans-serif",
          fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
          fontWeight: 800,
          color: '#000000',
          marginBottom: '1.25rem',
          letterSpacing: '-0.01em'
        }}>
          You can't see it. They can. <span style={{ color: '#dc2626' }}>Your friends know the answer. You don't.</span>
        </p>

        {/* Hero CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <a
            href="#download"
            className="comic-btn-yellow"
            style={{ fontSize: '1.25rem', padding: '1rem 2.2rem' }}
          >
            <Download size={22} />
            GET MAATHA PACCHI ON GOOGLE PLAY
          </a>
        </div>
      </div>

      {/* PHYSICAL GAME FLOW STEPPER */}
      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', marginBottom: '3rem' }}>
        <h3 style={{ fontFamily: "'Fredoka', cursive, sans-serif", fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000000', marginBottom: '0.75rem' }}>
          ⚡ Physical Party Flow
        </h3>

        <div className="physical-stepper">
          <div className="step-pill">
            <Smartphone size={20} style={{ color: '#0284c7' }} />
            PHONE ON HEAD
          </div>
          <span className="step-arrow">→</span>

          <div className="step-pill step-pill-highlight">
            <Volume2 size={20} />
            FRIENDS SHOUT
          </div>
          <span className="step-arrow">→</span>

          <div className="step-pill">
            <Zap size={20} style={{ color: '#d97706' }} />
            TILT DOWN / UP
          </div>
          <span className="step-arrow">→</span>

          <div className="step-pill">
            <Smile size={20} style={{ color: '#16a34a' }} />
            GUESS
          </div>
          <span className="step-arrow">→</span>

          <div className="step-pill step-pill-highlight" style={{ background: '#ef4444', color: '#ffffff' }}>
            <Flame size={20} />
            CHAOS!
          </div>
        </div>
      </div>

      {/* SECTION 1: WHAT IS MAATHA PACCHI? */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <Brain size={28} style={{ color: '#8b5cf6' }} />
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', fontWeight: 900, color: '#000', margin: 0 }}>
            What is Maatha Pacchi?
          </h2>
        </div>

        <p style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.6, fontWeight: 600, marginBottom: '1rem' }}>
          <strong>Maatha Pacchi (माथा पच्ची)</strong> is a high-energy, offline party guessing game built specifically for Indian living rooms, hostel corridors, college reunions, and family functions.
        </p>

        <p style={{ fontSize: '1.02rem', color: '#334155', lineHeight: 1.6, fontWeight: 600, margin: 0 }}>
          Unlike generic word games with a desi skin glued on top, every single card and deck in Maatha Pacchi is written for people who grew up quoting <em>Hera Pheri</em>, dodging <em>Flying Chappals</em>, arguing over <em>Extra Chutney</em>, and surviving <em>Proxy Attendance</em>!
        </p>
      </div>

      {/* SECTION 2: HOW TO PLAY */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'left', background: '#fef08a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <HelpCircle size={28} style={{ color: '#d97706' }} />
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', fontWeight: 900, color: '#000', margin: 0 }}>
            How To Play
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#ffffff', border: '3px solid #000', borderRadius: '16px', padding: '1.1rem', boxShadow: '4px 4px 0px #000' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000', marginBottom: '0.3rem' }}>1. Phone On Forehead</div>
            <p style={{ fontSize: '0.92rem', color: '#334155', margin: 0, fontWeight: 600 }}>
              Hold the phone against your forehead in landscape orientation so your friends can see the card, but you cannot!
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '3px solid #000', borderRadius: '16px', padding: '1.1rem', boxShadow: '4px 4px 0px #000' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000', marginBottom: '0.3rem' }}>2. Friends Shout Clues</div>
            <p style={{ fontSize: '0.92rem', color: '#334155', margin: 0, fontWeight: 600 }}>
              Your friends shout, act, sing, or whisper clues without saying the exact word on screen.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '3px solid #000', borderRadius: '16px', padding: '1.1rem', boxShadow: '4px 4px 0px #000' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000', marginBottom: '0.3rem' }}>3. Tilt To Pass or Score</div>
            <p style={{ fontSize: '0.92rem', color: '#334155', margin: 0, fontWeight: 600 }}>
              Tilt phone <strong>DOWN for Correct (+1)</strong>. Tilt phone <strong>UP to Pass</strong> to the next card!
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: GAME MODES */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Zap size={28} style={{ color: '#ec4899' }} />
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', fontWeight: 900, color: '#000', margin: 0 }}>
            Game Modes
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
          <div style={{ background: '#fff1f2', border: '2.5px solid #000', borderRadius: '14px', padding: '0.9rem', boxShadow: '3px 3px 0px #000' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#be123c' }}>⚡ Speed Run (60s)</div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0', fontWeight: 600 }}>High speed 60-second guessing blitz!</p>
          </div>

          <div style={{ background: '#fffbeb', border: '2.5px solid #000', borderRadius: '14px', padding: '0.9rem', boxShadow: '3px 3px 0px #000' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#b45309' }}>🚫 No Pass Zone</div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0', fontWeight: 600 }}>Passing disabled! You must guess every card.</p>
          </div>

          <div style={{ background: '#f0f9ff', border: '2.5px solid #000', borderRadius: '14px', padding: '0.9rem', boxShadow: '3px 3px 0px #000' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#0369a1' }}>⏱️ Marathon (120s)</div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0', fontWeight: 600 }}>Extended 2-minute party rounds for big groups.</p>
          </div>

          <div style={{ background: '#f3e8ff', border: '2.5px solid #000', borderRadius: '14px', padding: '0.9rem', boxShadow: '3px 3px 0px #000' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#6d28d9' }}>🎭 Silent Mime</div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0', fontWeight: 600 }}>Zero sounds allowed! Pure physical charades.</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: 13 DECKS (947 CARDS) */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'left', background: '#faf5ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Layers size={28} style={{ color: '#9333ea' }} />
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', fontWeight: 900, color: '#000', margin: 0 }}>
            13 Content Decks (947 Cards)
          </h2>
        </div>

        <ul style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.75rem',
          fontSize: '0.95rem',
          color: '#3b0764',
          fontWeight: 700,
          listStyleType: 'none',
          padding: 0
        }}>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🏘️ <strong>Padosi Sitcom Chaos</strong> — Jethalal, Daya Bhabhi, Bapuji
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🤣 <strong>Cult Comedy Blockbusters</strong> — Hera Pheri, Welcome, Dhamaal
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🕵️ <strong>Desi Detective Drama</strong> — ACP Pradyuman, CID, Daya
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            👵🏽 <strong>Desi Mom's Survival Guide</strong> — Flying Chappal, Sharma Ji
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🎬 <strong>Bollywood &amp; Binge Chaos</strong> — Mogambo, Crime Master Gogo
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🎓 <strong>Indian College Life</strong> — Proxy, Backlogs, Canteen Maggi
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🚌 <strong>Public Transport &amp; Traffic</strong> — Auto Meters, Local Trains
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            🍲 <strong>Indian Food Chaos</strong> — Extra Chutney mandatory!
          </li>
          <li style={{ background: '#ffffff', border: '2px solid #000', borderRadius: '12px', padding: '0.65rem 0.85rem', boxShadow: '3px 3px 0px #000' }}>
            📱 <strong>Indian Internet &amp; Memes</strong> — UPI, Blue Ticks, Viral Memes
          </li>
        </ul>
      </div>

      {/* SECTION 5: CHAOS RULES */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Flame size={28} style={{ color: '#ef4444' }} />
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.8rem', fontWeight: 900, color: '#000', margin: 0 }}>
            7 Final Chaos Rules
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>1. ACT ONLY!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>No speaking! Silent gestures and acting only.</p>
          </div>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>2. ONE WORD ONLY!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>Exactly one word per clue per player.</p>
          </div>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>3. SHUDDH HINDI!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>Pick one language (Hindi/English). No mixing!</p>
          </div>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>4. WHISPER MODE!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>All clues must be whispered. No shouting!</p>
          </div>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>5. SING IT OUT!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>Every clue must be sung or melodically performed!</p>
          </div>
          <div style={{ background: '#fef2f2', border: '2px solid #000', borderRadius: '12px', padding: '0.75rem', boxShadow: '3px 3px 0px #000' }}>
            <strong style={{ color: '#dc2626' }}>6. SOUND EFFECTS ONLY!</strong>
            <p style={{ fontSize: '0.85rem', margin: '2px 0 0', fontWeight: 600 }}>No words! Environmental noises &amp; impressions only.</p>
          </div>
        </div>
      </div>

      {/* SECTION 6: CUSTOM .DECK ECOSYSTEM (LATER) */}
      <div className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '1.8rem', marginBottom: '2rem', textAlign: 'left', background: '#fef3c7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <FileCode size={24} style={{ color: '#b45309' }} />
          <h3 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.35rem', fontWeight: 900, color: '#78350f', margin: 0 }}>
            Custom .deck Ecosystem — Coming Soon!
          </h3>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#92400e', fontWeight: 700, margin: 0 }}>
          Future updates will support custom <code>.deck</code> file imports so you can create, share, and play custom card decks with your own friends and family!
        </p>
      </div>

      {/* SECTION 7: DOWNLOAD / PLAY & FIXIT VILLAGE SPOTLIGHT */}
      <div id="download" className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '2rem', marginBottom: '2rem', textAlign: 'center', background: '#fbbf24' }}>
        <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', fontWeight: 900, color: '#000', marginBottom: '0.5rem' }}>
          Download &amp; Play Now!
        </h2>
        <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000', marginBottom: '1.25rem' }}>
          Available 100% offline for Android devices with tilt sensor controls.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="comic-btn-yellow"
            style={{ background: '#ffffff', color: '#000000' }}
          >
            <Download size={20} />
            Google Play Listing (Coming Soon)
          </a>
        </div>

        {/* FixIT Village Spotlight Card */}
        <div style={{
          background: '#ffffff',
          border: '3px solid #000',
          borderRadius: '18px',
          padding: '1.25rem',
          boxShadow: '5px 5px 0px #000',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '1.15rem', color: '#000' }}>
              <Wrench size={20} style={{ color: '#059669' }} />
              Also by Aditya: FixIT Village 🏡
            </div>
            <p style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 700, margin: '2px 0 0' }}>
              Play the digital tabletop DIY repair card game online right here in your browser!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFixit}
            className="comic-btn-yellow"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: '#10b981', color: '#ffffff' }}
          >
            Play FixIT Online
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* SECTION 8: PRIVACY POLICY & CONTACT FOOTER */}
      <footer className="comic-card" style={{ maxWidth: '860px', width: '100%', padding: '1.5rem 2rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '1rem', color: '#000' }}>
              <ShieldCheck size={18} style={{ color: '#0284c7' }} />
              Official Privacy Policy URL for Play Console:
            </div>
            <code style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', display: 'inline-block', marginTop: '4px' }}>
              {privacyUrl}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCopyPrivacy}
              className="comic-badge"
              style={{ cursor: 'pointer', background: '#ffffff' }}
            >
              {copiedPrivacy ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              {copiedPrivacy ? 'Copied!' : 'Copy Privacy Link'}
            </button>

            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="comic-badge"
              style={{ textDecoration: 'none', background: '#ffffff' }}
            >
              View Privacy Policy Page
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #000', margin: '1.25rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={16} style={{ color: '#000' }} />
            <span>Contact: <strong>adgagare2002@gmail.com</strong></span>
          </div>
          <div>
            © 2026 Aditya. Maatha Pacchi &amp; FixIT Village.
          </div>
        </div>
      </footer>
    </div>
  );
}
