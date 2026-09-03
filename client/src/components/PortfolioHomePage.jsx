import React from 'react';
import { ArrowRight, ExternalLink, Mail, Smartphone } from 'lucide-react';

export function PortfolioHomePage({ onNavigateMathaPacchi, onNavigateFixit }) {
  const scrollToGames = () => {
    const el = document.getElementById('games-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
      {/* 1. Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
        </div>

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

      {/* 2. Hero (Shortened & Mobile Optimized) */}
      <div style={{
        maxWidth: '920px',
        width: '100%',
        marginBottom: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(3rem, 7.5vw, 5.2rem)',
            fontWeight: 900,
            color: '#111111',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            marginBottom: '1.15rem',
            textTransform: 'uppercase'
          }}>
            I MAKE<br />GAMES.
          </h1>

          <p style={{
            fontSize: 'clamp(1.15rem, 3.2vw, 1.5rem)',
            fontWeight: 700,
            color: '#111111',
            lineHeight: 1.35,
            marginBottom: '1rem',
            letterSpacing: '-0.01em'
          }}>
            Games that turn ideas into things people actually do together.
          </p>

          <p style={{
            fontSize: '0.98rem',
            fontWeight: 500,
            color: '#44423c',
            lineHeight: 1.6,
            maxWidth: '540px',
            marginBottom: '1.5rem'
          }}>
            I'm Aditya. I make small games, strange experiments, and physical party ideas—mostly to get technology out of the way so people can laugh together in the same room.
          </p>

          <button
            onClick={scrollToGames}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#111111',
              fontWeight: 800,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0'
            }}
          >
            ↓ SEE THE GAMES
          </button>
        </div>

        {/* Hero Visual: Playful Tilted Phone Badge */}
        <div style={{ textAlign: 'center' }}>
          <div
            onClick={onNavigateMathaPacchi}
            style={{
              display: 'inline-block',
              background: '#fef08a',
              border: '3.5px solid #111111',
              borderRadius: '24px',
              padding: '1.25rem 1.6rem',
              boxShadow: '6px 6px 0px #111111',
              transform: 'rotate(-4deg)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              maxWidth: '270px',
              margin: '0 auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#000', fontWeight: 900, fontFamily: "'Fredoka', cursive", fontSize: '1.2rem', marginBottom: '0.2rem' }}>
              <Smartphone size={20} style={{ color: '#0284c7' }} />
              MATHA PACCHI
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#854d0e', fontFamily: "'Fredoka', cursive" }}>
              "You can't see it. They can!"
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <span className="handwritten-note">
              ↖ currently testing on Google Play
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '920px', height: '1px', background: '#e2e0d8', marginBottom: '3.2rem' }} />

      {/* 3. GAMES Section (Appears Immediately Below Hero Divider!) */}
      <section id="games-section" style={{ maxWidth: '920px', width: '100%', marginBottom: '4.5rem' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#66635b',
            marginBottom: '0.25rem'
          }}>
            GAMES
          </h2>
          <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.01em' }}>
            Things I've made.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* CARD 1: MATHA PACCHI (LOUD AGGRESSIVE YELLOW CARD) */}
          <div>
            <div
              onClick={onNavigateMathaPacchi}
              style={{
                background: '#fef08a',
                border: '4px solid #111111',
                borderRadius: '28px',
                boxShadow: '8px 8px 0px #111111',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                cursor: 'pointer',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.75rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span className="status-badge" style={{ background: '#111111', color: '#fef08a' }}>
                    2026 · PARTY GAME · IN TESTING
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Fredoka', cursive, sans-serif",
                  fontSize: 'clamp(2.2rem, 6vw, 3rem)',
                  fontWeight: 900,
                  color: '#111111',
                  lineHeight: 1,
                  marginBottom: '0.35rem'
                }}>
                  MATHA PACCHI
                </h3>

                <p style={{
                  fontFamily: "'Fredoka', cursive, sans-serif",
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
                  fontWeight: 800,
                  color: '#854d0e',
                  marginBottom: '0.9rem'
                }}>
                  You can't see it. They can.
                </p>

                <p style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#332900',
                  lineHeight: 1.55,
                  marginBottom: '1.6rem'
                }}>
                  A chaotic in-person guessing game. One player holds the phone against their forehead while everyone else screams, acts, and sings out clues!
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateMathaPacchi();
                  }}
                  style={{
                    background: '#111111',
                    color: '#ffffff',
                    fontFamily: "'Fredoka', cursive, sans-serif",
                    fontWeight: 900,
                    fontSize: '1rem',
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                  }}
                >
                  EXPLORE GAME
                  <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <img
                  src="/matha_pacchi_cover.jpg"
                  alt="Matha Pacchi Cover"
                  style={{
                    maxHeight: '240px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '18px',
                    border: '3.5px solid #111111',
                    boxShadow: '5px 5px 0px #111111'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.6rem', paddingLeft: '0.5rem' }}>
              <span className="handwritten-note">
                ↑ 947+ cards across 13 Indian pop-culture decks
              </span>
            </div>
          </div>

          {/* CARD 2: FIXIT (MEADOW GREEN CARTOON CARD) */}
          <div>
            <div
              onClick={onNavigateFixit}
              style={{
                background: '#dcfce7',
                border: '4px solid #111111',
                borderRadius: '28px',
                boxShadow: '8px 8px 0px #111111',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                cursor: 'pointer',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.75rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span className="status-badge" style={{ background: '#111111', color: '#86efac' }}>
                    2026 · CARD GAME · PROTOTYPE
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Fredoka', cursive, sans-serif",
                  fontSize: 'clamp(2.2rem, 6vw, 3rem)',
                  fontWeight: 900,
                  color: '#111111',
                  lineHeight: 1,
                  marginBottom: '0.35rem'
                }}>
                  FIXIT
                </h3>

                <p style={{
                  fontFamily: "'Fredoka', cursive, sans-serif",
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
                  fontWeight: 800,
                  color: '#14532d',
                  marginBottom: '0.9rem'
                }}>
                  A storytelling game where everything goes wrong.
                </p>

                <p style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#064e3b',
                  lineHeight: 1.55,
                  marginBottom: '1.6rem'
                }}>
                  Build ridiculous stories, make impossible decisions, and somehow fix the situation using duct tape and bubblegum.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateFixit();
                  }}
                  style={{
                    background: '#111111',
                    color: '#ffffff',
                    fontFamily: "'Fredoka', cursive, sans-serif",
                    fontWeight: 900,
                    fontSize: '1rem',
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                  }}
                >
                  EXPLORE GAME
                  <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <img
                  src="/fixit_village_cover.jpg"
                  alt="FixIT Cover"
                  style={{
                    maxHeight: '240px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '18px',
                    border: '3.5px solid #111111',
                    boxShadow: '5px 5px 0px #111111'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.6rem', paddingLeft: '0.5rem' }}>
              <span className="handwritten-note">
                ↑ play online directly in your browser with 2–6 friends
              </span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ width: '100%', maxWidth: '920px', height: '1px', background: '#e2e0d8', marginBottom: '4rem' }} />

      {/* 4. WHY DO I MAKE GAMES? Section */}
      <section style={{ maxWidth: '800px', width: '100%', marginBottom: '4.5rem' }}>
        <h2 style={{
          fontSize: '0.85rem',
          fontWeight: 900,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#66635b',
          marginBottom: '1.25rem'
        }}>
          WHY DO I MAKE GAMES?
        </h2>

        <div style={{ fontSize: '1.12rem', fontWeight: 600, color: '#111111', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <p>
            I like software that gets out of the way.
          </p>
          <p>
            The best games don't require you to stare at a screen for hours or learn a complicated system. They give people something simple to do, and then something interesting happens between them in the room.
          </p>
          <p>
            That's what I'm interested in exploring.
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.01em', borderLeft: '3.5px solid #111111', paddingLeft: '1.1rem', margin: '0.4rem 0' }}>
            What happens when a piece of software is just enough to start a real-world experience?
          </p>
        </div>
      </section>

      <div style={{ width: '100%', maxWidth: '920px', height: '1px', background: '#e2e0d8', marginBottom: '4rem' }} />

      {/* 5. CURRENTLY Section */}
      <section style={{ maxWidth: '800px', width: '100%', marginBottom: '4.5rem' }}>
        <h2 style={{
          fontSize: '0.85rem',
          fontWeight: 900,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#66635b',
          marginBottom: '1.25rem'
        }}>
          CURRENTLY
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 0',
            borderTop: '1px solid #e2e0d8'
          }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111111', marginRight: '0.75rem' }}>
                Maatha Pacchi
              </span>
              <span style={{ fontSize: '0.95rem', color: '#55524a', fontWeight: 500 }}>
                Getting it into the hands of real players.
              </span>
            </div>

            <button
              onClick={onNavigateMathaPacchi}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#111111',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Testing on Google Play →
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 0',
            borderTop: '1px solid #e2e0d8',
            borderBottom: '1px solid #e2e0d8'
          }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111111', marginRight: '0.75rem' }}>
                FixIT Village
              </span>
              <span style={{ fontSize: '0.95rem', color: '#55524a', fontWeight: 500 }}>
                Live browser-based digital tabletop.
              </span>
            </div>

            <button
              onClick={onNavigateFixit}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#111111',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Play Online →
            </button>
          </div>
        </div>
      </section>

      {/* 6. Shared Footer */}
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
          <span style={{ fontWeight: 800, color: '#111111' }}>Aditya Gagare</span>
          <span>•</span>
          <span>Games</span>
          <span>•</span>
          <button onClick={onNavigateMathaPacchi} style={{ background: 'none', border: 'none', color: '#66635b', fontWeight: 600, cursor: 'pointer' }}>
            Maatha Pacchi
          </button>
          <span>•</span>
          <button onClick={onNavigateFixit} style={{ background: 'none', border: 'none', color: '#66635b', fontWeight: 600, cursor: 'pointer' }}>
            FixIT
          </button>
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
