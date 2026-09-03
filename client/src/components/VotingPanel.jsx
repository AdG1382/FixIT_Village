import React from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, Check, ShieldAlert, Users, Sparkles } from 'lucide-react';

export function VotingPanel({
  phase,
  isMyTurn,
  viewerPlayerId,
  players,
  objections,
  votes,
  onToggleObjection,
  onCastVote
}) {
  const hasMyObjection = objections?.[viewerPlayerId] || false;
  const myVote = votes?.[viewerPlayerId];
  const storyteller = players.find(p => p.id === (players.find(pl => pl.isCurrent)?.id)) || players[0];

  if (phase === 'DISCUSSION') {
    return (
      <div className="glass-panel" style={{
        padding: '1.25rem 1.25rem',
        maxWidth: '750px',
        width: '100%',
        margin: '0 auto 1.25rem',
        border: '3px solid #fef3c7'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🗣️ Town Hall Discussion Floor
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Does the storyteller's DIY solution hold up under village scrutiny?
            </p>
          </div>

          {!isMyTurn ? (
            <button
              onClick={() => onToggleObjection(!hasMyObjection)}
              className={hasMyObjection ? 'btn-danger' : 'btn-secondary'}
              style={{
                padding: '0.65rem 1.2rem',
                fontSize: '0.9rem',
                width: '100%',
                maxWidth: '280px'
              }}
            >
              <AlertTriangle size={17} />
              {hasMyObjection ? '🚨 Objection Raised! (Withdraw)' : '🙋 Raise an Objection!'}
            </button>
          ) : (
            <span style={{
              fontSize: '0.85rem',
              color: '#78350f',
              fontWeight: 800,
              background: '#fef3c7',
              border: '1.5px solid #fde68a',
              padding: '6px 14px',
              borderRadius: '9999px'
            }}>
              🛡️ Defend Your Crafty Idea!
            </span>
          )}
        </div>

        {/* Objections List */}
        <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {players.filter(p => !p.isCurrent && p.id !== viewerPlayerId).map(p => {
            const hasObj = objections?.[p.id];
            return (
              <span
                key={p.id}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: hasObj ? '#fee2e2' : '#f1f5f9',
                  color: hasObj ? '#dc2626' : 'var(--text-secondary)',
                  border: hasObj ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {hasObj ? '⚠️' : '✅'} {p.nickname}: {hasObj ? 'Objecting!' : 'Satisfied'}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'VOTING') {
    return (
      <div className="glass-panel" style={{
        padding: '1.5rem 1.25rem',
        maxWidth: '640px',
        width: '100%',
        margin: '0 auto 1.25rem',
        textAlign: 'center',
        border: '3px solid #bae6fd'
      }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.3rem' }}>
          🗳️ Secret Village Ballot Box
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1.25rem' }}>
          {isMyTurn 
            ? 'The town is deliberating in secret... Cross your fingers!' 
            : 'Would this solve the village emergency or cause total hilarity?'}
        </p>

        {!isMyTurn ? (
          myVote ? (
            <div style={{
              background: myVote === 'accept' ? 'var(--accent-grass-light)' : 'var(--accent-coral-light)',
              border: `2px solid ${myVote === 'accept' ? '#a7f3d0' : '#fecdd3'}`,
              borderRadius: '16px',
              padding: '1rem',
              color: myVote === 'accept' ? 'var(--accent-grass-dark)' : 'var(--accent-coral-dark)',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Check size={20} />
              You voted: <strong style={{ textTransform: 'uppercase' }}>{myVote === 'accept' ? '👍 Approved (It Works!)' : '👎 Rejected (Too Wild!)'}</strong>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem'
            }}>
              <button
                onClick={() => onCastVote('accept')}
                className="btn-success"
                style={{ padding: '0.85rem 1.25rem', fontSize: '1rem' }}
              >
                <ThumbsUp size={20} />
                Totally Works! 👍
              </button>
              <button
                onClick={() => onCastVote('reject')}
                className="btn-danger"
                style={{ padding: '0.85rem 1.25rem', fontSize: '1rem' }}
              >
                <ThumbsDown size={20} />
                Way Too Crazy! 👎
              </button>
            </div>
          )
        ) : (
          <div style={{
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 700
          }}>
            ⏳ Waiting for fellow villagers to drop their secret ballots...
          </div>
        )}

        {/* Voting Progress */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {players.filter(p => !p.isCurrent).map(p => {
            const hasVoted = Boolean(votes?.[p.id]);
            return (
              <span
                key={p.id}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: hasVoted ? 'var(--accent-sky-light)' : '#f1f5f9',
                  color: hasVoted ? 'var(--accent-sky-dark)' : 'var(--text-muted)',
                  border: hasVoted ? '1.5px solid #7dd3fc' : '1.5px solid #e2e8f0'
                }}
              >
                {p.nickname}: {hasVoted ? '🗳️ Voted' : '🤔 Deciding...'}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
