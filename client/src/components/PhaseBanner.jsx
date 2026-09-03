import React from 'react';
import { Sparkles, MessageSquare, ThumbsUp, Award, CheckCircle2, ArrowRight, Mic } from 'lucide-react';

export function PhaseBanner({
  phase,
  currentPlayer,
  isMyTurn,
  onFinishStory,
  onProceedToVote,
  onAdvanceTurn,
  isViewerHost,
  lastTurnResult,
  objectionCount
}) {
  const getPhaseDetails = () => {
    switch (phase) {
      case 'PLAYER_TURN':
      case 'TURN_SELECT':
        return {
          icon: '🎯',
          title: isMyTurn ? 'Your Turn: Select Request & Tools!' : `${currentPlayer?.nickname}'s Turn to Choose`,
          description: isMyTurn 
            ? 'Pick 1 Village Request on the board & 1+ Tools from your hand below.' 
            : `Waiting for ${currentPlayer?.nickname} to pick an emergency and tools...`,
          color: 'var(--accent-sun)'
        };
      case 'STORYTELLING':
        return {
          icon: '🎙️',
          title: isMyTurn ? 'Spin Your Solution on Voice Call!' : `${currentPlayer?.nickname} is Pitching!`,
          description: isMyTurn 
            ? 'Explain out loud how your wacky tools solve the problem!' 
            : `Listen to ${currentPlayer?.nickname}'s hilarious explanation on voice call!`,
          color: 'var(--accent-sky-dark)',
          actionLabel: isMyTurn ? "I've Finished Pitching!" : (isViewerHost ? 'Mayor: Open Discussion' : null),
          onAction: onFinishStory
        };
      case 'DISCUSSION':
        return {
          icon: '💬',
          title: 'Town Discussion Floor',
          description: objectionCount > 0 
            ? `${objectionCount} villager(s) have raised an objection! Pitcher can defend.`
            : 'Villagers may discuss or raise objections. Pitcher can defend!',
          color: 'var(--accent-purple)',
          actionLabel: isViewerHost ? 'Open Secret Ballot Voting' : null,
          onAction: onProceedToVote
        };
      case 'VOTING':
        return {
          icon: '🗳️',
          title: 'Secret Village Ballot',
          description: isMyTurn ? 'Villagers are voting on your pitch...' : 'Cast your secret vote below!',
          color: 'var(--accent-coral-dark)'
        };
      case 'TURN_RESULT':
      case 'ROUND_SUMMARY':
        return {
          icon: lastTurnResult?.success ? '🎉' : '❌',
          title: lastTurnResult?.success ? 'Story Accepted by Town!' : 'Story Rejected by Town!',
          description: lastTurnResult 
            ? `Vote Result: ${lastTurnResult.acceptCount || 0} 👍 Accept vs ${lastTurnResult.rejectCount || 0} 👎 Reject (${lastTurnResult.pointsAwarded || 0} pts earned)` 
            : 'Turn result revealed.',
          color: lastTurnResult?.success ? 'var(--accent-grass-dark)' : '#dc2626',
          actionLabel: isViewerHost ? 'Next Turn' : null,
          onAction: onAdvanceTurn
        };
      default:
        return {
          icon: '🏡',
          title: 'FixIT Village',
          description: 'The DIY Party Card Game',
          color: 'var(--accent-sun)'
        };
    }
  };

  const details = getPhaseDetails();

  return (
    <div className="phase-banner">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}>
        {/* Left / Center Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textAlign: 'left' }}>
          <span style={{ fontSize: '1.4rem' }}>{details.icon}</span>
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}>
              {details.title}
            </h3>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              lineHeight: 1.3
            }}>
              {details.description}
            </p>
          </div>
        </div>

        {/* Action Button (if any for this phase) */}
        {details.actionLabel && details.onAction && (
          <button
            onClick={details.onAction}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.15rem',
              fontSize: '0.88rem',
              flexShrink: 0
            }}
          >
            <span>{details.actionLabel}</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
