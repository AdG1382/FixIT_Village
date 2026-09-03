import React from 'react';
import { X, ShieldAlert, FastForward, RotateCcw, UserX, Trophy, Play } from 'lucide-react';

export function HostControlsModal({
  room,
  onClose,
  onHostAction
}) {
  const currentPlayer = room.players[room.currentTurnIndex];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '520px', border: '3px solid #fef3c7', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={22} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>Mayor Panel</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
          Keep the village rolling smoothly if a villager steps away.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Phase Control */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem 1rem'
          }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Phase Flow
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <button
                onClick={() => { onHostAction('forceNextPhase'); onClose(); }}
                className="btn-secondary"
                style={{ fontSize: '0.84rem', padding: '0.6rem' }}
              >
                <FastForward size={15} />
                Force Next Phase
              </button>

              <button
                onClick={() => { onHostAction('skipPlayer'); onClose(); }}
                className="btn-danger"
                style={{ fontSize: '0.84rem', padding: '0.6rem' }}
              >
                <FastForward size={15} />
                Skip Turn ({currentPlayer?.nickname})
              </button>
            </div>
          </div>

          {/* Player Management */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem 1rem'
          }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Villager Management
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
              {room.players.filter(p => !p.isHost).map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {p.nickname} ({p.connected ? '🟢 Online' : '⚪ Away'})
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Kick ${p.nickname} from the village?`)) {
                        onHostAction('kickPlayer', { targetPlayerId: p.id });
                      }
                    }}
                    className="btn-danger"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.74rem' }}
                  >
                    <UserX size={13} />
                    Kick
                  </button>
                </div>
              ))}
              {room.players.filter(p => !p.isHost).length === 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No other villagers in town.</span>
              )}
            </div>
          </div>

          {/* Game Reset / End */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.85rem 1rem'
          }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Game Lifecycle
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  if (window.confirm('Restart game from Round 1 with 0 points?')) {
                    onHostAction('restartGame');
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ fontSize: '0.84rem', padding: '0.6rem' }}
              >
                <RotateCcw size={15} />
                Restart Match
              </button>

              <button
                onClick={() => {
                  if (window.confirm('End the game immediately and crown the winner?')) {
                    onHostAction('endGame');
                    onClose();
                  }
                }}
                className="btn-danger"
                style={{ fontSize: '0.84rem', padding: '0.6rem' }}
              >
                <Trophy size={15} />
                End Match Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
