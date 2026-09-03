import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  Trophy,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Award,
  RefreshCw,
  ArrowLeft,
  Wrench,
  Sparkles,
  Gamepad2,
  Users,
  PieChart,
  Activity,
  Layers,
  Check
} from 'lucide-react';

export function FixitStatsPage({ onNavigateHome, onPlayFixit }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'recent' | 'cards'

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
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'calc(1.2rem + var(--sat)) 1.25rem calc(2.5rem + var(--sab))',
      background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
      color: '#0f172a'
    }}>
      {/* Top Nav Header */}
      <nav style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onNavigateHome}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', background: '#ffffff', fontWeight: 800 }}
        >
          <ArrowLeft size={16} />
          Back to Game Hub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={fetchStats}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', background: '#ffffff', fontWeight: 800 }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh Data
          </button>

          {onPlayFixit && (
            <button
              onClick={onPlayFixit}
              className="btn-primary"
              style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
            >
              <Wrench size={16} />
              Play FixIT Village
            </button>
          )}
        </div>
      </nav>

      {/* Main Stats Header */}
      <div style={{ maxWidth: '860px', width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          border: '2px solid #86efac',
          borderRadius: '9999px',
          padding: '6px 18px',
          color: '#166534',
          fontSize: '0.88rem',
          fontWeight: 800,
          marginBottom: '0.75rem',
          boxShadow: '0 3px 10px rgba(16, 185, 129, 0.15)'
        }}>
          <Activity size={16} style={{ color: '#10b981' }} />
          FixIT Village Live Analytics &amp; Statistics
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 3.4rem)',
          fontWeight: 900,
          color: '#0f172a',
          lineHeight: 1.1,
          marginBottom: '0.5rem'
        }}>
          Community Gameplay <span style={{ color: '#059669' }}>Statistics</span> 🏡📊
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem, 3.2vw, 1.15rem)',
          color: '#475569',
          fontWeight: 700,
          maxWidth: '620px',
          margin: '0 auto'
        }}>
          Real-time metrics, match performance history, tool usage trends, and player stats for FixIT Village.
        </p>
      </div>

      {/* Content Container */}
      <div style={{ width: '100%', maxWidth: '860px' }}>
        {loading ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-panel)',
            border: '2px solid #bae6fd'
          }}>
            <RefreshCw size={32} className="spin" style={{ color: '#0ea5e9', marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
              Fetching FixIT Village Analytics...
            </div>
          </div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* KPI Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: '#ffffff',
                border: '2px solid #fde68a',
                borderRadius: '20px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.12)'
              }}>
                <div style={{ display: 'inline-flex', background: '#fef3c7', padding: '8px', borderRadius: '12px', color: '#b45309', marginBottom: '0.4rem' }}>
                  <Trophy size={22} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78350f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Matches Played
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                  {stats.gamesPlayed}
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #bae6fd',
                borderRadius: '20px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.12)'
              }}>
                <div style={{ display: 'inline-flex', background: '#e0f2fe', padding: '8px', borderRadius: '12px', color: '#0284c7', marginBottom: '0.4rem' }}>
                  <Clock size={22} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Average Match Time
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0ea5e9', marginTop: '0.2rem' }}>
                  {stats.averageTimeFormatted}
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #a7f3d0',
                borderRadius: '20px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.12)'
              }}>
                <div style={{ display: 'inline-flex', background: '#d1fae5', padding: '8px', borderRadius: '12px', color: '#047857', marginBottom: '0.4rem' }}>
                  <Award size={22} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Average Winner Score
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>
                  {stats.averageScore} pts
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #ddd6fe',
                borderRadius: '20px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.12)'
              }}>
                <div style={{ display: 'inline-flex', background: '#ede9fe', padding: '8px', borderRadius: '12px', color: '#6d28d9', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5b21b6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pitch Acceptance Rate
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.2rem' }}>
                  {stats.acceptanceRate}%
                </div>
              </div>
            </div>

            {/* Detailed Cards & Analytics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.4rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px', color: '#b45309' }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78350f' }}>Most Popular Request</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b' }}>
                      {stats.mostPopularRequest}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, margin: 0 }}>
                  The task card most frequently drawn and successfully pitched by villagers in community games.
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.4rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#ffe4e6', padding: '8px', borderRadius: '10px', color: '#be123c' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9f1239' }}>Most Contested Request</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b' }}>
                      {stats.mostObjectionsRequest}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, margin: 0 }}>
                  The task card that sparked the highest number of villager objections during voting!
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.4rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '10px', color: '#0369a1' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#075985' }}>Rarest Tool Used</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b' }}>
                      {stats.leastUsedTool}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, margin: 0 }}>
                  The tool card played least often, making it a rare tactical key when pitched!
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.4rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#d1fae5', padding: '8px', borderRadius: '10px', color: '#047857' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46' }}>Total Cards Played</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b' }}>
                      {stats.totalCardsPlayed} Tools &amp; Specials
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, margin: 0 }}>
                  Total number of tool cards and special cards pitched across all archived matches.
                </p>
              </div>
            </div>

            {/* Recent Match History Section */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-panel)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} style={{ color: '#f59e0b' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>
                    Recent Match History
                  </h3>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
                  Latest Archived Games
                </span>
              </div>

              {stats.recentGames && stats.recentGames.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {stats.recentGames.map((g, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                          border: '1px solid #f59e0b',
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          color: '#78350f',
                          fontSize: '0.9rem'
                        }}>
                          #{stats.recentGames.length - idx}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e293b' }}>
                            🏆 Winner: {g.winnerNames || 'Villagers'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                            {g.playerCount} Players • Game ID: {g.gameId || `match_${idx}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0ea5e9' }}>
                          <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {Math.floor(g.durationSeconds / 60)}m {g.durationSeconds % 60}s
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                          {g.endedAt ? new Date(g.endedAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontWeight: 700,
                  background: '#f8fafc',
                  borderRadius: '16px',
                  border: '1.5px dashed #cbd5e1'
                }}>
                  🎮 Play a game of FixIT Village to record live match history!
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
