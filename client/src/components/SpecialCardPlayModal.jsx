import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Wand2 } from 'lucide-react';

export function SpecialCardPlayModal({
  card,
  room,
  playerId,
  onClose,
  onConfirmPlay
}) {
  if (!card) return null;

  const player = room?.players?.find(p => p.id === playerId);
  const otherPlayers = room?.players?.filter(p => p.id !== playerId && p.connected) || [];
  const boardSmallRequests = room?.boardRequests?.filter(r => r.points === 5) || [];
  const handTools = player?.hand?.filter(c => c.type === 'tool' && c.id !== card.id) || [];

  // Form states
  const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState(otherPlayers[0]?.id || '');
  const [selectedToolIdsToReturn, setSelectedToolIdsToReturn] = useState([]);
  const [selectedExtraRequestId, setSelectedExtraRequestId] = useState(boardSmallRequests[0]?.id || '');
  const [wildTargetToolId, setWildTargetToolId] = useState(handTools[0]?.id || '');
  const [wildToolName, setWildToolName] = useState('Heavy Sledgehammer');
  const [addedToolId, setAddedToolId] = useState(handTools[0]?.id || '');
  const [discardToolIds, setDiscardToolIds] = useState([]);

  const isSP01 = card.id.startsWith('SP01'); // Lucky Find
  const isSP02 = card.id.startsWith('SP02'); // Helping Hand
  const isSP03 = card.id.startsWith('SP03'); // Second Chance
  const isSP04 = card.id.startsWith('SP04'); // Borrowed Tool
  const isSP05 = card.id.startsWith('SP05'); // Brilliant Idea
  const isSP06 = card.id.startsWith('SP06'); // Hidden Toolbox
  const isSP07 = card.id.startsWith('SP07'); // Wild Inspiration
  const isSP08 = card.id.startsWith('SP08'); // Happy Accident

  const handlePlay = () => {
    let params = {};
    if (isSP02 || isSP04) {
      params.targetPlayerId = selectedTargetPlayerId;
    }
    if (isSP03) {
      params.returnedCardIds = selectedToolIdsToReturn;
    }
    if (isSP05) {
      params.addedToolId = addedToolId;
    }
    if (isSP06) {
      params.discardCardIds = discardToolIds;
    }
    if (isSP07) {
      params.targetToolId = wildTargetToolId;
      params.wildToolName = wildToolName.trim() || 'Any Tool';
    }
    if (isSP08) {
      params.extraRequestId = selectedExtraRequestId;
    }

    onConfirmPlay(card.id, params);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px', border: '3px solid #c084fc', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⭐</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                Play {card.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#7e22ce', fontWeight: 700 }}>
                {card.timingLabel || 'Special Action'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {/* Card Preview Card */}
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          border: '2px solid #e9d5ff',
          borderRadius: '14px',
          padding: '0.75rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <img
            src={card.image}
            alt={card.name}
            style={{ width: '55px', borderRadius: '8px', border: '2px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          />
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.35 }}>
              {card.description}
            </p>
            {card.quote && (
              <p style={{ fontSize: '0.76rem', color: '#8b5cf6', fontStyle: 'italic', marginTop: '2px' }}>
                "{card.quote}"
              </p>
            )}
          </div>
        </div>

        {/* Action Specific Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* SP02 Helping Hand or SP04 Borrowed Tool */}
          {(isSP02 || isSP04) && (
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Choose Villager:
              </label>
              {otherPlayers.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {otherPlayers.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedTargetPlayerId(p.id)}
                      className={selectedTargetPlayerId === p.id ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                    >
                      {p.nickname} ({p.handCount || p.hand?.length || 0} tools)
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No other villagers available.</p>
              )}
            </div>
          )}

          {/* SP03 Second Chance: Select cards to swap */}
          {isSP03 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Select Tools to Return & Redraw ({selectedToolIdsToReturn.length} selected):
              </label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {handTools.map(t => {
                  const isChecked = selectedToolIdsToReturn.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedToolIdsToReturn(prev =>
                          isChecked ? prev.filter(id => id !== t.id) : [...prev, t.id]
                        );
                      }}
                      className={isChecked ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      {isChecked && <Check size={13} />}
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SP05 Brilliant Idea: Add extra tool */}
          {isSP05 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Choose Extra Tool to Add to Story:
              </label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {handTools.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAddedToolId(t.id)}
                    className={addedToolId === t.id ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.35rem 0.7rem', fontSize: '0.82rem' }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SP07 Wild Inspiration: Custom representation */}
          {isSP07 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Choose which card to transform:
                </label>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {handTools.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setWildTargetToolId(t.id)}
                      className={wildTargetToolId === t.id ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.82rem' }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                  What does it represent? (e.g. Laser Saw, Giant Magnet, Rope)
                </label>
                <input
                  type="text"
                  value={wildToolName}
                  onChange={(e) => setWildToolName(e.target.value)}
                  placeholder="e.g. Sledgehammer, Dragon Glue..."
                  className="input-field"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', fontSize: '0.9rem' }}
                  maxLength={40}
                />
              </div>
            </div>
          )}

          {/* SP08 Happy Accident: Select extra Small request */}
          {isSP08 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Select Extra Small (5-Point) Village Request:
              </label>
              {boardSmallRequests.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {boardSmallRequests.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedExtraRequestId(r.id)}
                      className={selectedExtraRequestId === r.id ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
                    >
                      🌲 {r.title || r.name} (+5 pts)
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  No Small (5-pt) requests currently on the board.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}>
            Cancel
          </button>
          <button 
            onClick={handlePlay} 
            className="btn-primary" 
            style={{
              padding: '0.6rem 1.35rem',
              fontSize: '0.9rem',
              background: 'linear-gradient(180deg, #a855f7 0%, #9333ea 100%)',
              border: '2px solid #e9d5ff',
              boxShadow: '0 4px 0 #7e22ce, 0 8px 16px rgba(147, 51, 234, 0.4)'
            }}
          >
            <Wand2 size={15} />
            Unleash {card.name}!
          </button>
        </div>
      </div>
    </div>
  );
}
