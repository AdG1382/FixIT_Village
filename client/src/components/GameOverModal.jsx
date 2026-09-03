import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown, Sparkles, Home, Heart } from 'lucide-react';

export function GameOverModal({
  room,
  onRestartGame,
  onReturnToLobby,
  onOpenFeedback,
  isHost
}) {
  const winners = Array.isArray(room.winner) ? room.winner : room.winner ? [room.winner] : [];
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-content"
        style={{ maxWidth: '500px', textAlign: 'center', padding: '1.75rem 1.25rem', border: '3px solid #fef3c7' }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
          border: '3px solid #f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.85rem',
          boxShadow: '0 6px 16px rgba(245, 158, 11, 0.3)'
        }}>
          <Trophy size={32} style={{ color: '#d97706' }} />
        </div>

        <h2 style={{
          fontSize: '1.8rem',
          color: 'var(--text-primary)',
          fontWeight: 900,
          marginBottom: '0.25rem'
        }}>
          Village Champion! 🏆
        </h2>

        <p style={{ color: 'var(--accent-grass-dark)', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          {winners.length > 1 
            ? `Tied Heroes: ${winners.map(w => w.nickname).join(' & ')}!` 
            : `${winners[0]?.nickname} saved the village!`}
        </p>

        {/* Final Leaderboard */}
        <div style={{
          background: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '0.75rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          {sortedPlayers.map((p, rank) => {
            const isWinner = winners.some(w => w.id === p.id);
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isWinner ? '#fef3c7' : '#ffffff',
                  border: isWinner ? '2px solid var(--accent-sun)' : '1.5px solid #e2e8f0',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  boxShadow: isWinner ? '0 3px 8px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: rank === 0 ? '#d97706' : 'var(--text-muted)',
                    width: '20px'
                  }}>
                    #{rank + 1}
                  </span>
                  <span style={{ fontWeight: 800, color: isWinner ? '#78350f' : 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {p.nickname}
                  </span>
                  {isWinner && <Crown size={14} style={{ color: '#d97706' }} />}
                </div>

                <span style={{
                  fontWeight: 900,
                  color: isWinner ? '#b45309' : 'var(--text-secondary)',
                  fontSize: '0.92rem'
                }}>
                  {p.score} pts
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={onOpenFeedback}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '0.75rem',
              color: '#d97706',
              borderColor: '#fde68a',
              background: '#fffbeb',
              fontSize: '0.92rem'
            }}
          >
            <Heart size={16} style={{ color: '#f59e0b' }} />
            Quick 3-Question Feedback ⭐
          </button>

          {isHost ? (
            <button
              onClick={onRestartGame}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              <RotateCcw size={16} />
              Play Again (Rematch!)
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Waiting for Mayor to start another match...
            </p>
          )}

          <button
            onClick={onReturnToLobby}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem' }}
          >
            <Home size={16} />
            Leave to Home
          </button>
        </div>
      </div>
    </div>
  );
}
