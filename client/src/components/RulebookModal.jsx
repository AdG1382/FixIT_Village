import React, { useState } from 'react';
import { X, BookOpen, MessageSquare, Mic, ThumbsUp, Sparkles, CheckCircle2, Wand2, HelpCircle } from 'lucide-react';

export function RulebookModal({ onClose }) {
  const [tab, setTab] = useState('howtoplay'); // 'howtoplay' | 'specials'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '680px', border: '3px solid #bae6fd', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📖</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>FixIT Village Guide</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.85rem' }}>
          <button
            onClick={() => setTab('howtoplay')}
            className={tab === 'howtoplay' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            <BookOpen size={15} /> How to Play
          </button>
          <button
            onClick={() => setTab('specials')}
            className={tab === 'specials' ? 'btn-primary' : 'btn-secondary'}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              background: tab === 'specials' ? 'linear-gradient(180deg, #a855f7 0%, #9333ea 100%)' : undefined,
              borderColor: tab === 'specials' ? '#e9d5ff' : undefined,
              boxShadow: tab === 'specials' ? '0 4px 0 #7e22ce' : undefined
            }}
          >
            <Wand2 size={15} /> Special Cards (8 Cards)
          </button>
        </div>

        <div style={{
          overflowY: 'auto',
          paddingRight: '0.3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          {tab === 'howtoplay' ? (
            <>
              {/* Philosophy reminder */}
              <div style={{
                background: 'var(--accent-sun-light)',
                border: '2px solid #fde68a',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                color: '#78350f',
                lineHeight: 1.45,
                fontWeight: 700,
                fontSize: '0.86rem'
              }}>
                🏡 FixIT is a cooperative, hilarious storytelling party game! Hop on a voice call with your friends—the app manages cards, scoring, and voting while you bring the laughs!
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#78350f',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 5px rgba(245, 158, 11, 0.3)'
                  }}>
                    1
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem', fontWeight: 800, fontSize: '0.92rem' }}>
                      Pick a Village Request & Handy Tools
                    </strong>
                    On your turn, pick 1 active emergency from the Village Notice Board and select 1 or more tool cards from your hand.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fb7185, #f43f5e)',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 5px rgba(244, 63, 94, 0.3)'
                  }}>
                    2
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem', fontWeight: 800, fontSize: '0.92rem' }}>
                      Spin Your Solution on Voice Call!
                    </strong>
                    Explain out loud to your friends how your wacky tools solve the problem. Absurd and hilarious logic is highly rewarded!
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 5px rgba(14, 165, 233, 0.3)'
                  }}>
                    3
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem', fontWeight: 800, fontSize: '0.92rem' }}>
                      Discussion & Secret Town Ballot
                    </strong>
                    The other villagers raise questions or objections. Once voting begins, everyone (except the storyteller) casts a secret <strong>Totally Works! 👍</strong> or <strong>Way Too Crazy! 👎</strong> vote.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 5px rgba(16, 185, 129, 0.3)'
                  }}>
                    4
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem', fontWeight: 800, fontSize: '0.92rem' }}>
                      Earn Village Points & Draw Cards
                    </strong>
                    If accepted by majority, the storyteller wins the points (+5, +10, or +15 pts)! Used tools are discarded, hands are refilled to 5 cards, and the next villager takes their turn.
                  </div>
                </div>
              </div>

              {/* Victory condition */}
              <div style={{
                marginTop: '0.35rem',
                paddingTop: '0.75rem',
                borderTop: '2px dashed #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--accent-grass-dark)',
                fontWeight: 800,
                fontSize: '0.86rem'
              }}>
                <Sparkles size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>First villager to reach the target score becomes Village Champion!</span>
              </div>
            </>
          ) : (
            <>
              {/* Special Cards Guide */}
              <div style={{
                background: '#faf5ff',
                border: '2px solid #e9d5ff',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                color: '#581c87',
                lineHeight: 1.45,
                fontWeight: 700,
                fontSize: '0.86rem'
              }}>
                ⭐ <strong>Special Cards</strong> represent lucky moments and clever ideas. They can be played <strong>at most once per turn</strong>!
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.88rem' }}>
                      Before Your Story (Turn Selection)
                    </strong>
                    <ul style={{ fontSize: '0.8rem', marginTop: '4px', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <li><strong>SP01 Lucky Find:</strong> Draw 2 Tool cards, keep 1.</li>
                      <li><strong>SP02 Helping Hand:</strong> Ask any player for 1 Tool card.</li>
                      <li><strong>SP03 Second Chance:</strong> Return Tools to deck and redraw that many.</li>
                      <li><strong>SP04 Borrowed Tool:</strong> Use 1 Tool card from another player's hand.</li>
                      <li><strong>SP06 Hidden Toolbox:</strong> Draw 3 Tool cards immediately, then discard 2.</li>
                    </ul>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🎨</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.88rem' }}>
                      During Your Story (Story Pitch)
                    </strong>
                    <ul style={{ fontSize: '0.8rem', marginTop: '4px', paddingLeft: '1.1rem' }}>
                      <li><strong>SP07 Wild Inspiration:</strong> 1 Tool card represents ANY tool you need!</li>
                    </ul>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✨</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.88rem' }}>
                      After Your Story (Discussion & Voting)
                    </strong>
                    <ul style={{ fontSize: '0.8rem', marginTop: '4px', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <li><strong>SP05 Brilliant Idea:</strong> Add 1 extra Tool card from your hand before scoring.</li>
                      <li><strong>SP08 Happy Accident:</strong> Complete 1 extra Small (5-pt) Request on the board!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
