import React, { useState } from 'react';
import { Crown, Activity, Shield, HelpCircle, BarChart3, Tag, Heart, LogOut, Menu, X, Copy, Check } from 'lucide-react';

export function Scoreboard({
  room,
  onLeaveRoom,
  onOpenRules,
  onOpenHostControls,
  onOpenActivityLog,
  onOpenStats,
  onOpenChangelog,
  onOpenFeedback
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <>
      <header style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.94)',
        borderBottom: '2px solid rgba(251, 191, 36, 0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '0.6rem 1rem calc(0.6rem + var(--sat))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        zIndex: 50,
        position: 'sticky',
        top: 0
      }}>
        {/* Brand & Room Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '1.4rem' }}>🏡</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <h1 style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                FixIT <span style={{ color: 'var(--accent-sun)', marginLeft: '2px' }}>Village</span>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <button
                onClick={handleCopyCode}
                title="Click to copy room code"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#78350f',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer'
                }}
              >
                <span>{room.code}</span>
                {codeCopied ? <Check size={11} style={{ color: 'var(--accent-grass)' }} /> : <Copy size={10} />}
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                R{room.roundNumber} ({room.targetScore}p)
              </span>
            </div>
          </div>
        </div>

        {/* Players Score Strip (Horizontally Scrollable on all viewports) */}
        <div 
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '2px 4px',
            flex: '1 1 auto',
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {room.players.map((p, idx) => {
            const isCurrentTurn = idx === room.currentTurnIndex;
            const isMe = p.id === room.viewerPlayerId;

            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: isCurrentTurn 
                    ? 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)' 
                    : isMe ? '#f8fafc' : '#ffffff',
                  border: isCurrentTurn 
                    ? '2px solid var(--accent-sun)' 
                    : isMe ? '2px solid #cbd5e1' : '1.5px solid #e2e8f0',
                  boxShadow: isCurrentTurn 
                    ? '0 3px 10px rgba(245, 158, 11, 0.35)' 
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  transform: isCurrentTurn ? 'scale(1.03)' : 'none'
                }}
              >
                {/* Online indicator */}
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: p.connected ? 'var(--accent-grass)' : 'var(--text-muted)',
                  boxShadow: p.connected ? '0 0 5px var(--accent-grass)' : 'none'
                }} />

                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isCurrentTurn ? 800 : 700,
                  color: isCurrentTurn ? '#78350f' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {p.nickname} {isMe && <span style={{ fontSize: '0.7rem', color: 'var(--accent-sky-dark)' }}>(You)</span>}
                </span>

                {p.isHost && <Crown size={12} style={{ color: '#d97706', flexShrink: 0 }} />}

                {/* Score Badge */}
                <span style={{
                  background: isCurrentTurn ? '#f59e0b' : '#f1f5f9',
                  color: isCurrentTurn ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  flexShrink: 0
                }}>
                  {p.score}p
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop Header Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }} className="desktop-actions">
          <button
            onClick={onOpenStats}
            title="Platform Analytics"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <BarChart3 size={15} />
            Stats
          </button>

          <button
            onClick={onOpenActivityLog}
            title="Match Activity Feed"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <Activity size={15} />
            Feed
          </button>

          <button
            onClick={onOpenChangelog}
            title="Changelog"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <Tag size={15} />
            v0.1.2
          </button>

          {room.isViewerHost && (
            <button
              onClick={onOpenHostControls}
              title="Host Moderation Tools"
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderColor: 'var(--accent-sun)' }}
            >
              <Shield size={15} style={{ color: '#d97706' }} />
              Host
            </button>
          )}

          <button
            onClick={onOpenFeedback}
            title="Town Feedback"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <Heart size={15} style={{ color: '#e11d48' }} />
            Feedback
          </button>

          <button
            onClick={onOpenRules}
            title="How to Play"
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <HelpCircle size={15} />
            Rules
          </button>

          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              title="Leave Village Room"
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.82rem',
                color: '#dc2626',
                borderColor: '#fca5a5'
              }}
            >
              <LogOut size={15} />
              Leave
            </button>
          )}
        </div>

        {/* Mobile Menu Button (< 900px) */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="btn-secondary mobile-menu-btn"
          style={{
            padding: '0.45rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            flexShrink: 0
          }}
          aria-label="Open Village Menu"
        >
          <Menu size={18} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>Menu</span>
        </button>
      </header>

      {/* Desktop vs Mobile style overrides */}
      <style>{`
        @media (min-width: 901px) {
          .desktop-actions { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Mobile Drawer Menu Bottom Sheet */}
      {mobileMenuOpen && (
        <div className="modal-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="modal-content"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🏡</span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>Village Menu</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    Room {room.code} • Round {room.roundNumber} (Goal: {room.targetScore}p)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Buttons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRules(); }}
                className="btn-secondary"
                style={{ padding: '0.75rem', justifyContent: 'flex-start', fontSize: '0.9rem' }}
              >
                <HelpCircle size={18} style={{ color: 'var(--accent-sky-dark)' }} />
                Rules & Cards
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenActivityLog(); }}
                className="btn-secondary"
                style={{ padding: '0.75rem', justifyContent: 'flex-start', fontSize: '0.9rem' }}
              >
                <Activity size={18} style={{ color: 'var(--accent-sun)' }} />
                Activity Feed
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenStats(); }}
                className="btn-secondary"
                style={{ padding: '0.75rem', justifyContent: 'flex-start', fontSize: '0.9rem' }}
              >
                <BarChart3 size={18} style={{ color: 'var(--accent-grass-dark)' }} />
                Analytics
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenFeedback(); }}
                className="btn-secondary"
                style={{ padding: '0.75rem', justifyContent: 'flex-start', fontSize: '0.9rem' }}
              >
                <Heart size={18} style={{ color: '#e11d48' }} />
                Feedback
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenChangelog(); }}
                className="btn-secondary"
                style={{ padding: '0.75rem', justifyContent: 'flex-start', fontSize: '0.9rem' }}
              >
                <Tag size={18} style={{ color: 'var(--accent-purple)' }} />
                Changelog v0.1.2
              </button>

              {room.isViewerHost && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenHostControls(); }}
                  className="btn-secondary"
                  style={{
                    padding: '0.75rem',
                    justifyContent: 'flex-start',
                    fontSize: '0.9rem',
                    borderColor: 'var(--accent-sun)',
                    background: '#fef3c7'
                  }}
                >
                  <Shield size={18} style={{ color: '#d97706' }} />
                  Mayor Controls
                </button>
              )}
            </div>

            {/* Leave Room Button */}
            {onLeaveRoom && (
              <button
                onClick={() => { setMobileMenuOpen(false); onLeaveRoom(); }}
                className="btn-danger"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem' }}
              >
                <LogOut size={17} />
                Leave Village Room
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
