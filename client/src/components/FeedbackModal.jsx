import React, { useState } from 'react';
import { X, Star, Send, CheckCircle2, Heart } from 'lucide-react';

export function FeedbackModal({ gameId, playerId, nickname, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [favoriteRequest, setFavoriteRequest] = useState('');
  const [confusingText, setConfusingText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          favoriteRequest,
          confusingText,
          gameId,
          playerId,
          nickname
        })
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '480px', width: '100%', border: '3px solid #fef3c7', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={22} style={{ color: '#f59e0b' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>Town Feedback</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--accent-grass)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>Thank you, {nickname || 'Villager'}! 🎉</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
              Your feedback directly shapes the future of FixIT Village.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Question 1: Rating */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                1. How much fun was this game session?
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', padding: '0.25rem 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.3rem',
                      color: star <= (hoverRating || rating) ? '#f59e0b' : '#cbd5e1',
                      transition: 'transform 0.15s ease, color 0.15s ease',
                      transform: star <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
                    <Star size={30} fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Favorite Request */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                2. Favorite wacky emergency or story?
              </label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Grandma's Tea, Escaped Piglets..."
                value={favoriteRequest}
                onChange={(e) => setFavoriteRequest(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.9rem', fontSize: '0.92rem' }}
              />
            </div>

            {/* Question 3: Anything confusing */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                3. Anything confusing or suggestions?
              </label>
              <textarea
                className="input-text"
                placeholder="Tell us what could be smoother or funnier..."
                rows={2}
                value={confusingText}
                onChange={(e) => setConfusingText(e.target.value)}
                style={{ width: '100%', resize: 'none', padding: '0.65rem 0.9rem', fontSize: '0.92rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '0.95rem'
              }}
            >
              <Send size={16} />
              {submitting ? 'Sending...' : 'Submit Town Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
