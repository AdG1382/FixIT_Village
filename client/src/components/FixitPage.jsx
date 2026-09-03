import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Wrench,
  Users,
  Play,
  Flame,
  Award,
  Sparkles,
  BarChart3,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Mail,
  ExternalLink
} from 'lucide-react';

export function FixitPage({
  initialNickname,
  initialRoomCode,
  onCreateRoom,
  onJoinRoom,
  onNavigateHome
}) {
  const [tab, setTab] = useState(initialRoomCode ? 'join' : 'create');
  const [createNick, setCreateNick] = useState(initialNickname || '');
  const [targetScore, setTargetScore] = useState(25);

  const [joinNick, setJoinNick] = useState(initialNickname || '');
  const [joinCode, setJoinCode] = useState(initialRoomCode || '');

  const [globalStats, setGlobalStats] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setGlobalStats(data))
      .catch(() => {});
  }, []);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createNick.trim()) return;
    onCreateRoom(createNick.trim(), Number(targetScore));
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinNick.trim() || !joinCode.trim()) return;
    onJoinRoom(joinCode.trim().toUpperCase(), joinNick.trim());
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
        {/* 1. HOOK CARD */}
        <div className="comic-card" style={{ padding: 'clamp(1.75rem, 5vw, 2.75rem)', background: '#dcfce7', marginBottom: '2.5rem', textAlign: 'center', transform: 'rotate(0.5deg)' }}>
          <h1 style={{
            fontFamily: "'Fredoka', cursive, sans-serif",
            fontSize: 'clamp(2.6rem, 9vw, 5rem)',
            fontWeight: 900,
            color: '#000000',
            lineHeight: 0.95,
            marginBottom: '0.6rem',
            textShadow: '3px 3px 0px #86efac',
            textTransform: 'uppercase'
          }}>
            FIXIT — VILLAGE
          </h1>

          <p style={{
            fontFamily: "'Fredoka', cursive, sans-serif",
            fontSize: 'clamp(1.25rem, 4vw, 1.85rem)',
            fontWeight: 800,
            color: '#14532d',
            margin: 0
          }}>
            Everything is going wrong. Fix it.
          </p>
        </div>

        {/* 2. INTERACTIVE ONLINE ROOM FLOOR (CREATE OR JOIN) */}
        <div className="comic-card" style={{ padding: 'clamp(1.5rem, 4vw, 2.2rem)', background: '#ffffff', marginBottom: '2.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.4rem' }}>
            <button
              onClick={() => setTab('create')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2.5px solid #000',
                fontFamily: "'Fredoka', cursive",
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: 'pointer',
                background: tab === 'create' ? '#22c55e' : '#f1f5f9',
                color: tab === 'create' ? '#ffffff' : '#475569',
                boxShadow: tab === 'create' ? '3px 3px 0px #000' : 'none'
              }}
            >
              Start New Room
            </button>
            <button
              onClick={() => setTab('join')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2.5px solid #000',
                fontFamily: "'Fredoka', cursive",
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: 'pointer',
                background: tab === 'join' ? '#0284c7' : '#f1f5f9',
                color: tab === 'join' ? '#ffffff' : '#475569',
                boxShadow: tab === 'join' ? '3px 3px 0px #000' : 'none'
              }}
            >
              Join Existing Room
            </button>
          </div>

          {tab === 'create' ? (
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.4rem' }}>
                  Your Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Carpenter"
                  value={createNick}
                  onChange={(e) => setCreateNick(e.target.value)}
                  maxLength={18}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '2.5px solid #000',
                    fontSize: '1rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.4rem' }}>
                  Target Victory Score
                </label>
                <select
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '2.5px solid #000',
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={15}>15 Points (Quick 10-min game)</option>
                  <option value={25}>25 Points (Standard 20-min game)</option>
                  <option value={40}>40 Points (Epic Village Showdown)</option>
                </select>
              </div>

              <button
                type="submit"
                className="comic-btn-yellow"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: '#22c55e',
                  color: '#ffffff',
                  fontSize: '1.15rem',
                  marginTop: '0.5rem'
                }}
              >
                <Play size={20} />
                Create Room Floor & Invite Friends
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.4rem' }}>
                  Your Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Village Fixer"
                  value={joinNick}
                  onChange={(e) => setJoinNick(e.target.value)}
                  maxLength={18}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '2.5px solid #000',
                    fontSize: '1rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', color: '#1e293b', marginBottom: '0.4rem' }}>
                  6-Letter Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. TF4C8Z"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '2.5px solid #000',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                className="comic-btn-yellow"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '1.15rem',
                  marginTop: '0.5rem'
                }}
              >
                <Users size={20} />
                Enter Room
              </button>
            </form>
          )}
        </div>

        {/* 3. WHAT IT IS */}
        <div className="comic-card" style={{ padding: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '2.2rem', textAlign: 'left' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', marginBottom: '0.5rem' }}>
            What it is
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.65, fontWeight: 600, margin: 0 }}>
            A wacky digital tabletop storytelling game. Combine duct tape, bubblegum, and bizarre tools to fix village emergencies, pitch your ridiculous solutions, and survive the village vote.
          </p>
        </div>

        {/* 4. HOW IT WORKS (3 VISUAL STEPS) */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.6rem', fontWeight: 900, color: '#000', marginBottom: '1.2rem' }}>
            How to play
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left'
          }}>
            <div className="comic-card" style={{ padding: '1.25rem', background: '#fef08a' }}>
              <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.15rem', fontWeight: 900, color: '#854d0e', marginBottom: '0.3rem' }}>
                1. VILLAGE EMERGENCY
              </div>
              <p style={{ fontSize: '0.92rem', color: '#332900', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                Leaky roofs, runaway carts, broken windmills! The village has 3 active tasks waiting to be solved.
              </p>
            </div>

            <div className="comic-card" style={{ padding: '1.25rem', background: '#e0f2fe' }}>
              <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.15rem', fontWeight: 900, color: '#0369a1', marginBottom: '0.3rem' }}>
                2. PITCH YOUR DIY FIX
              </div>
              <p style={{ fontSize: '0.92rem', color: '#0c4a6e', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                Combine weird tools from your hand into a hilarious story explaining how your fix works.
              </p>
            </div>

            <div className="comic-card" style={{ padding: '1.25rem', background: '#dcfce7' }}>
              <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.15rem', fontWeight: 900, color: '#15803d', marginBottom: '0.3rem' }}>
                3. SURVIVE THE VOTE
              </div>
              <p style={{ fontSize: '0.92rem', color: '#064e3b', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                Fellow villagers vote on whether your fix actually works. Earn points or trigger chaos!
              </p>
            </div>
          </div>
        </div>

        {/* 5. GLOBAL COMMUNITY STATS */}
        {globalStats && (
          <div className="comic-card" style={{ padding: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '2.5rem', background: '#f8fafc', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart3 size={24} style={{ color: '#0284c7' }} />
              <h2 style={{ fontFamily: "'Fredoka', cursive", fontSize: '1.55rem', fontWeight: 900, color: '#000', margin: 0 }}>
                Live Village Activity
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ background: '#fff', border: '2.5px solid #000', borderRadius: '14px', padding: '1rem', boxShadow: '3px 3px 0px #000' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Total Matches Played
                </div>
                <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', fontWeight: 900, color: '#000' }}>
                  {globalStats.totalGamesCompleted || 0}
                </div>
              </div>

              <div style={{ background: '#fff', border: '2.5px solid #000', borderRadius: '14px', padding: '1rem', boxShadow: '3px 3px 0px #000' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Pitches Solved
                </div>
                <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', fontWeight: 900, color: '#16a34a' }}>
                  {globalStats.totalSuccessfulPitches || 0}
                </div>
              </div>

              <div style={{ background: '#fff', border: '2.5px solid #000', borderRadius: '14px', padding: '1rem', boxShadow: '3px 3px 0px #000' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Special Cards Used
                </div>
                <div style={{ fontFamily: "'Fredoka', cursive", fontSize: '2.2rem', fontWeight: 900, color: '#9333ea' }}>
                  {globalStats.totalSpecialsPlayed || 0}
                </div>
              </div>
            </div>
          </div>
        )}
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
          <span style={{ fontWeight: 800, color: '#111111' }}>FixIT</span>
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
