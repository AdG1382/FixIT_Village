import React from 'react';
import { X, Sparkles, User, Tag, Clock, Wand2 } from 'lucide-react';

export function CardModal({ card, onClose }) {
  if (!card) return null;

  const isSpecial = card.type === 'special' || card.id?.startsWith('SP');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '460px', 
          padding: '1.25rem', 
          textAlign: 'center', 
          position: 'relative',
          border: isSpecial ? '3px solid #c084fc' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Card Full Frame Container */}
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isSpecial ? '0 12px 28px rgba(168, 85, 247, 0.25)' : '0 12px 28px rgba(0, 0, 0, 0.12)',
          border: isSpecial ? '3px solid #f3e8ff' : '3px solid #f8fafc',
          background: '#ffffff',
          maxHeight: 'min(380px, 46vh)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <img 
            src={card.image} 
            alt={card.title || card.name} 
            style={{
              width: '100%',
              height: '100%',
              maxHeight: 'min(380px, 46vh)',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Card Description & Meta */}
        <div style={{ marginTop: '1rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {card.title || card.name}
                </h3>
                {isSpecial && (
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                    color: '#ffffff',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    ⭐ SPECIAL
                  </span>
                )}
              </div>

              {card.villager && (
                <p style={{ fontSize: '0.84rem', color: 'var(--accent-grass-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                  <User size={13} />
                  Requested by: {card.villager}
                </p>
              )}

              {card.timingLabel && (
                <p style={{ fontSize: '0.82rem', color: '#7e22ce', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '3px' }}>
                  <Clock size={13} />
                  Timing: {card.timingLabel}
                </p>
              )}
            </div>

            {card.points && (
              <div style={{
                background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#78350f',
                fontWeight: 900,
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                border: '2px solid #fef3c7',
                boxShadow: '0 3px 0 #b45309, 0 6px 14px rgba(245, 158, 11, 0.3)',
                flexShrink: 0
              }}>
                +{card.points} pts
              </div>
            )}
          </div>

          {/* Description text */}
          {card.description && (
            <div style={{
              marginTop: '0.65rem',
              background: isSpecial ? '#faf5ff' : '#f8fafc',
              border: isSpecial ? '1.5px solid #e9d5ff' : '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              {card.description}
            </div>
          )}

          {card.quote && (
            <p style={{ fontSize: '0.8rem', color: '#9333ea', fontStyle: 'italic', marginTop: '0.4rem' }}>
              "{card.quote}"
            </p>
          )}

          {card.tags && (
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {card.tags.map(t => (
                <span key={t} style={{
                  fontSize: '0.7rem',
                  background: 'var(--accent-sky-light)',
                  color: 'var(--accent-sky-dark)',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '9999px'
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
