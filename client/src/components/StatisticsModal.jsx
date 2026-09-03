import React, { useState, useEffect } from 'react';
import { X, BarChart3, Clock, Trophy, Flame, ShieldAlert, CheckCircle2, Award, RefreshCw } from 'lucide-react';

export function StatisticsModal({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '640px', width: '100%', border: '3px solid #bae6fd', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={22} style={{ color: 'var(--accent-sky-dark)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>FixIT Analytics</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>Community game trends</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={fetchStats} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }} title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading platform statistics...
          </div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Primary KPI Grid (2x2 on mobile) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Games
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-sun)', marginTop: '0.1rem' }}>
                  {stats.gamesPlayed}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Avg Time
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-sky-dark)', marginTop: '0.1rem' }}>
                  {stats.averageTimeFormatted}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Top Score
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-grass-dark)', marginTop: '0.1rem' }}>
                  {stats.averageScore}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Accept Rate
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-purple)', marginTop: '0.1rem' }}>
                  {stats.acceptanceRate}%
                </div>
              </div>
            </div>

            {/* In-Depth Insights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.6rem'
            }}>
              <div style={{ background: '#fffbeb', border: '1.5px solid #fef3c7', borderRadius: '14px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#fde68a', padding: '0.5rem', borderRadius: '10px', color: '#b45309' }}>
                  <Flame size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e' }}>Most Popular Request</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.mostPopularRequest}</div>
                </div>
              </div>

              <div style={{ background: '#fff1f2', border: '1.5px solid #ffe4e6', borderRadius: '14px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#fecdd3', padding: '0.5rem', borderRadius: '10px', color: '#be123c' }}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9f1239' }}>Most Objections</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.mostObjectionsRequest}</div>
                </div>
              </div>

              <div style={{ background: '#f0f9ff', border: '1.5px solid #e0f2fe', borderRadius: '14px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#bae6fd', padding: '0.5rem', borderRadius: '10px', color: '#0369a1' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#075985' }}>Least Used Tool</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.leastUsedTool}</div>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1.5px solid #d1fae5', borderRadius: '14px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#a7f3d0', padding: '0.5rem', borderRadius: '10px', color: '#047857' }}>
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#065f46' }}>Total Cards Played</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalCardsPlayed} Tools</div>
                </div>
              </div>
            </div>

            {/* Recent Match History */}
            {stats.recentGames && stats.recentGames.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Recent Matches
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {stats.recentGames.map((g, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                        🏆 {g.winnerNames || 'Villagers'} ({g.playerCount}p)
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 600 }}>
                        {Math.floor(g.durationSeconds / 60)}m {g.durationSeconds % 60}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
