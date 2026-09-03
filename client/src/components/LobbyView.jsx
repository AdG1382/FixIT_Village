import React, { useState } from 'react';
import { Copy, Check, Users, Crown, Play, Shield, HelpCircle, PhoneCall, Heart, LogOut } from 'lucide-react';

export function LobbyView({ room, onStartGame, onLeaveRoom, onOpenRules, onOpenHostControls, onOpenFeedback }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${room.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const canStart = room.players.length >= 2;

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(1rem + var(--sat)) 1rem calc(1.5rem + var(--sab))',
      position: 'relative',
      width: '100%'
    }}>
      {/* Top Bar Navigation */}
      <nav style={{
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.4rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Heart size={14} style={{ color: '#e11d48' }} />
            Feedback
          </button>
        )}
        {room.isViewerHost && (
          <button
            onClick={onOpenHostControls}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--accent-sun)' }}
          >
            <Shield size={14} style={{ color: '#d97706' }} />
            Host
          </button>
        )}
        <button
          onClick={onOpenRules}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          <HelpCircle size={14} />
          Rules
        </button>

        {onLeaveRoom && (
          <button
            onClick={onLeaveRoom}
            className="btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              color: '#dc2626',
              borderColor: '#fca5a5'
            }}
          >
            <LogOut size={14} />
            Leave
          </button>
        )}
      </nav>

      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        {/* Room Code Badge */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--accent-wood)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: 'var(--accent-sun-light)',
            padding: '3px 12px',
            borderRadius: '9999px'
          }}>
            🏡 Village Room Code
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '0.4rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
              letterSpacing: '0.18em',
              fontWeight: 900,
              color: 'var(--accent-sun)',
              textShadow: '0 2px 0 #b45309',
              lineHeight: 1
            }}>
              {room.code}
            </h1>
            <button
              onClick={handleCopy}
              title="Copy Room Code"
              className="btn-secondary"
              style={{
                padding: '0.55rem',
                minHeight: 'auto',
                borderRadius: '12px'
              }}
            >
              {copied ? <Check size={18} style={{ color: 'var(--accent-grass)' }} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Players Lobby Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem', border: '3px solid #ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={18} style={{ color: 'var(--accent-sun)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Villagers in Town ({room.players.length})
              </h3>
            </div>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--accent-grass-dark)',
              background: 'var(--accent-grass-light)',
              padding: '2px 9px',
              borderRadius: '9999px'
            }}>
              Goal: {room.targetScore}p
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '220px',
            overflowY: 'auto',
            paddingRight: '2px'
          }}>
            {room.players.map((p) => {
              const isMe = p.id === room.viewerPlayerId;
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isMe ? '#fef3c7' : '#f8fafc',
                    border: isMe ? '2px solid var(--accent-sun)' : '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.65rem 0.9rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: p.connected ? 'var(--accent-grass)' : 'var(--text-muted)',
                      boxShadow: p.connected ? '0 0 5px var(--accent-grass)' : 'none'
                    }} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {p.nickname} {isMe && <span style={{ color: 'var(--accent-sun)', fontSize: '0.78rem' }}>(You)</span>}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {p.isHost && (
                      <span style={{
                        background: '#fde68a',
                        color: '#78350f',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        border: '1px solid #fcd34d'
                      }}>
                        <Crown size={12} style={{ color: '#d97706' }} />
                        Mayor
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '2px dashed #e2e8f0' }}>
            <button
              onClick={handleCopyLink}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.86rem', padding: '0.6rem' }}
            >
              <Copy size={15} />
              {linkCopied ? 'Link Copied to Clipboard! 🎉' : 'Copy Game Invitation Link'}
            </button>
          </div>
        </div>

        {/* Start Game Button (Host Only) */}
        {room.isViewerHost ? (
          <div>
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
            >
              <Play size={20} />
              {canStart ? 'Start Fixing the Village!' : 'Waiting for 2+ villagers...'}
            </button>
            {!canStart && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Invite at least 1 more friend with the room code to start.
              </p>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '1rem', color: 'var(--text-secondary)', border: '2px solid #ffffff' }}>
            <p style={{ fontSize: '0.92rem', fontWeight: 700 }}>
              Waiting for Mayor <strong style={{ color: 'var(--accent-sun)' }}>{room.players.find(p => p.isHost)?.nickname}</strong> to start...
            </p>
          </div>
        )}

        {/* Voice Call Note */}
        <div style={{
          marginTop: '1.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.84rem',
          fontWeight: 700,
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: '1.5px solid rgba(255, 255, 255, 0.95)'
        }}>
          <PhoneCall size={15} style={{ color: 'var(--accent-grass-dark)' }} />
          <span>Make sure you are on voice call with everyone! 🎙️</span>
        </div>
      </div>
    </div>
  );
}
