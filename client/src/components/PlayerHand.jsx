import React from 'react';
import { Sparkles, Wand2, ZoomIn, Check, ArrowRight } from 'lucide-react';

export function PlayerHand({
  hand = [],
  selectedToolIds = [],
  onToggleTool,
  onInspectCard,
  onPlaySpecial,
  onPlaySpecialCard,
  playedSpecialCardId,
  isMyTurn,
  phase,
  canSubmitTurn,
  onSubmitTurn,
  onSubmitPitch
}) {
  const isTurnSelect = phase === 'PLAYER_TURN' || phase === 'TURN_SELECT';
  const handlePlaySpecial = onPlaySpecial || onPlaySpecialCard;
  const handleSubmit = onSubmitTurn || onSubmitPitch;
  const canPlaySpecial = !playedSpecialCardId && isMyTurn;

  const toolCards = hand?.filter(c => c.type === 'tool') || [];
  const specialCards = hand?.filter(c => c.type === 'special') || [];
  const canPitch = typeof canSubmitTurn === 'boolean' 
    ? canSubmitTurn 
    : (isMyTurn && isTurnSelect && selectedToolIds.length > 0);

  return (
    <div className="hand-dock">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {/* Dock Header & Mobile Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🧰</span>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Your Handy Workbench
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                {isMyTurn && isTurnSelect 
                  ? selectedToolIds.length > 0
                    ? `Selected: ${selectedToolIds.length} tool(s)` 
                    : '1. Pick a Request on the board above, then tap your tools' 
                  : `${hand?.length || 0} cards in hand`}
              </p>
            </div>
          </div>

          {/* Action Pitch Button (Always visible on mobile & desktop when turn active) */}
          {isMyTurn && isTurnSelect && (
            <button
              onClick={handleSubmit}
              disabled={!canPitch}
              className="btn-primary"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              <span>Pitch Solution ({selectedToolIds.length})</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Hand Cards Container */}
        <div 
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.75rem',
            overflowX: 'auto',
            padding: '6px 4px 10px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Tool Cards */}
          {toolCards.map((tool) => {
            const isSelected = selectedToolIds.includes(tool.id);
            const isClickable = isMyTurn && isTurnSelect;

            return (
              <div
                key={tool.id}
                onClick={() => isClickable && onToggleTool && onToggleTool(tool.id)}
                className={`table-card ${isSelected ? 'selected' : ''} ${!isClickable ? 'disabled' : ''}`}
                style={{
                  width: '120px',
                  minWidth: '120px',
                  flexShrink: 0,
                  transform: isSelected ? 'translateY(-10px) scale(1.04)' : undefined,
                  borderColor: isSelected ? 'var(--accent-sun)' : '#ffffff',
                  boxShadow: isSelected 
                    ? '0 0 0 3px #fbbf24, 0 12px 24px rgba(245, 158, 11, 0.4)' 
                    : '0 4px 10px rgba(0,0,0,0.08)'
                }}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    background: 'var(--accent-grass)',
                    color: 'white',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 10,
                    border: '1.5px solid #ffffff'
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}

                <img src={tool.image} alt={tool.name} />

                {/* Zoom inspect icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectCard && onInspectCard(tool);
                  }}
                  title="Inspect tool details"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    background: 'rgba(255, 255, 255, 0.94)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    zIndex: 5
                  }}
                >
                  <ZoomIn size={12} />
                </button>
              </div>
            );
          })}

          {/* Special Cards (Glow Purple & Distinct Action) */}
          {specialCards.map((special) => (
            <div
              key={special.id}
              onClick={() => onInspectCard && onInspectCard(special)}
              className="table-card"
              style={{
                width: '120px',
                minWidth: '120px',
                flexShrink: 0,
                border: '3px solid #c084fc',
                boxShadow: '0 4px 14px rgba(192, 132, 252, 0.35)',
                background: 'linear-gradient(180deg, #faf5ff, #f3e8ff)'
              }}
            >
              {/* Special Star Badge */}
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)',
                zIndex: 10,
                border: '1px solid #e9d5ff'
              }}>
                ⭐ SPECIAL
              </span>

              <img src={special.image} alt={special.name} />

              {/* Play Special Card Button */}
              {canPlaySpecial && isMyTurn && handlePlaySpecial && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySpecial(special);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    right: '4px',
                    background: 'linear-gradient(180deg, #a855f7 0%, #9333ea 100%)',
                    color: '#ffffff',
                    border: '1.5px solid #e9d5ff',
                    borderRadius: '8px',
                    padding: '3px 6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    boxShadow: '0 2px 6px rgba(147, 51, 234, 0.4)',
                    zIndex: 15
                  }}
                >
                  <Wand2 size={11} />
                  Play Card
                </button>
              )}
            </div>
          ))}

          {(!hand || hand.length === 0) && (
            <div style={{
              padding: '1rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              Your workbench is empty. Hand will refill next turn!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
