import React from 'react';
import { Sparkles, ZoomIn, Wand2, User, ArrowRight } from 'lucide-react';

export function VillageBoard({
  boardRequests = [],
  activeRequest,
  playedToolCards = [],
  activeTools = [],
  specialCardState,
  extraRequest,
  wildToolMapping,
  borrowedTool,
  phase,
  selectedRequestId,
  onSelectRequest,
  onInspectCard,
  isMyTurn
}) {
  const isTurnSelect = phase === 'PLAYER_TURN' || phase === 'TURN_SELECT';
  const isStoryOrVoting = phase === 'STORYTELLING' || phase === 'DISCUSSION' || phase === 'VOTING' || phase === 'TURN_RESULT' || phase === 'ROUND_SUMMARY';
  const toolsToDisplay = playedToolCards.length > 0 ? playedToolCards : activeTools;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0.75rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* -------------------------------------------------------------
          MODE 1: Turn Selection (Notice Board of Active Requests)
          ------------------------------------------------------------- */}
      {isTurnSelect && (
        <div>
          {/* Header notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.3rem' }}>📋</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Village Notice Board
              </h2>
            </div>
            <span style={{
              fontSize: '0.78rem',
              color: 'var(--accent-wood)',
              fontWeight: 700,
              background: 'var(--accent-wood-light)',
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid #fde68a'
            }}>
              {isMyTurn ? '👉 Tap a request to solve!' : '👀 Storyteller is picking a request...'}
            </span>
          </div>

          {/* Cards Grid (2-column on mobile, 3-4 column on desktop) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(145px, 100%), 1fr))',
            gap: '0.85rem',
            justifyContent: 'center'
          }}>
            {(boardRequests || []).map((req) => {
              const isSelected = selectedRequestId === req.id;
              const points = req.points || 5;
              const badgeClass = points === 5 ? 'badge-small' : points === 10 ? 'badge-medium' : 'badge-large';

              return (
                <div
                  key={req.id}
                  onClick={() => isMyTurn && onSelectRequest && onSelectRequest(req.id)}
                  className={`table-card ${isSelected ? 'selected' : ''} ${!isMyTurn ? 'disabled' : ''}`}
                  style={{
                    maxWidth: '220px',
                    margin: '0 auto',
                    width: '100%'
                  }}
                >
                  {/* Point Badge */}
                  <span className={`card-badge ${badgeClass}`}>
                    +{points} pts
                  </span>

                  {/* Card Image */}
                  <img src={req.image} alt={req.title || req.name} />

                  {/* Card Zoom / Inspect Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectCard && onInspectCard(req);
                    }}
                    title="Zoom in to inspect card"
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODE 2: Storytelling / Discussion / Voting Spotlight
          ------------------------------------------------------------- */}
      {isStoryOrVoting && (
        <div className="glass-panel" style={{
          padding: '1.25rem',
          border: '3px solid #ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Active Emergency Card & Tools Presentation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start'
          }}>
            {/* Left/Top: Active Request Card Spotlight */}
            {activeRequest && (
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: 'var(--accent-coral-dark)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'var(--accent-coral-light)',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  marginBottom: '0.65rem'
                }}>
                  🚨 Active Town Emergency (+{activeRequest.points || 5} pts)
                </span>

                <div 
                  className="table-card"
                  onClick={() => onInspectCard && onInspectCard(activeRequest)}
                  style={{
                    width: '100%',
                    maxWidth: '180px',
                    marginBottom: '0.65rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                  }}
                >
                  <img src={activeRequest.image} alt={activeRequest.title || activeRequest.name} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectCard && onInspectCard(activeRequest);
                    }}
                    title="Zoom in to inspect card"
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeRequest.title || activeRequest.name}
                </h3>
                {activeRequest.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>
                    {activeRequest.description}
                  </p>
                )}
              </div>
            )}

            {/* Extra Request (SP08 Happy Accident) if present */}
            {extraRequest && (
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e9d5ff',
                borderRadius: '18px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: '#7c3aed',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: '#f3e8ff',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  marginBottom: '0.65rem'
                }}>
                  ✨ Extra Bonus Emergency (+{extraRequest.points || 5} pts)
                </span>

                <div 
                  className="table-card"
                  onClick={() => onInspectCard && onInspectCard(extraRequest)}
                  style={{
                    width: '100%',
                    maxWidth: '180px',
                    marginBottom: '0.65rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                  }}
                >
                  <img src={extraRequest.image} alt={extraRequest.title || extraRequest.name} />
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {extraRequest.title || extraRequest.name}
                </h3>
              </div>
            )}

            {/* Right/Bottom: Played Tools in Pitch */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: 'var(--accent-sky-dark)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'var(--accent-sky-light)',
                  padding: '2px 10px',
                  borderRadius: '9999px'
                }}>
                  🛠️ Selected Tools ({toolsToDisplay.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Tap any card to zoom
                </span>
              </div>

              {/* Horizontal Scroll Tools List */}
              <div 
                className="no-scrollbar"
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  overflowX: 'auto',
                  padding: '4px 2px 8px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {toolsToDisplay.length > 0 ? (
                  toolsToDisplay.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onInspectCard && onInspectCard(tool)}
                      className="table-card"
                      style={{
                        width: '125px',
                        minWidth: '125px',
                        flexShrink: 0,
                        boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
                      }}
                    >
                      <img src={tool.image} alt={tool.name} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectCard && onInspectCard(tool);
                        }}
                        title="Zoom in to inspect card"
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          background: 'rgba(255, 255, 255, 0.92)',
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
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem', fontWeight: 600 }}>
                    No tools selected for this story pitch.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Special Card Modifiers (Wild Inspiration, Borrowed Tool, etc.) */}
          {(specialCardState || wildToolMapping || borrowedTool) && (
            <div style={{
              background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
              border: '2px solid #e9d5ff',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#6b21a8',
              fontSize: '0.86rem',
              fontWeight: 700
            }}>
              <Wand2 size={18} style={{ color: '#a855f7', flexShrink: 0 }} />
              <div>
                {wildToolMapping && (
                  <div>🌟 <strong>Wild Tool:</strong> Tool represents <em>"{wildToolMapping.represents}"</em></div>
                )}
                {borrowedTool && (
                  <div>🤝 <strong>Borrowed Tool:</strong> Borrowed from {borrowedTool.ownerNickname || 'Villager'}</div>
                )}
                {specialCardState && (
                  <div>⭐ <strong>Special Card:</strong> {specialCardState.description || specialCardState.name}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
