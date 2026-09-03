import React from 'react';
import { X, Activity, Clock, CheckCircle, AlertCircle, MessageSquare, ThumbsUp, Sparkles, Award } from 'lucide-react';

export function ActivityLogModal({ activityLog, onClose }) {
  const getEventBadge = (type) => {
    switch (type) {
      case 'SCORE':
        return { icon: <Award size={13} />, color: 'var(--accent-sun)', label: 'Score Awarded' };
      case 'VOTE_RESULT':
        return { icon: <ThumbsUp size={13} />, color: 'var(--accent-grass-dark)', label: 'Vote Result' };
      case 'OBJECTION':
        return { icon: <AlertCircle size={13} />, color: '#dc2626', label: 'Objection' };
      case 'STORY_SELECT':
      case 'STORY':
        return { icon: <Sparkles size={13} />, color: 'var(--accent-sky-dark)', label: 'Story Tale' };
      case 'DISCUSSION':
        return { icon: <MessageSquare size={13} />, color: 'var(--accent-purple)', label: 'Discussion' };
      default:
        return { icon: <CheckCircle size={13} />, color: 'var(--text-muted)', label: type || 'System' };
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '560px', width: '100%', border: '3px solid #bae6fd', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} style={{ color: 'var(--accent-sun)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>Match Activity Feed</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '2px'
        }}>
          {activityLog && activityLog.length > 0 ? (
            [...activityLog].reverse().map((item, idx) => {
              const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const badge = getEventBadge(item.type);
              return (
                <div
                  key={item.id || idx}
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderLeft: `4px solid ${badge.color}`,
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <Clock size={10} />
                      {timeStr}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.35, fontWeight: 600 }}>
                    {item.text}
                  </p>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', fontWeight: 600 }}>
              No activity recorded yet in this room.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
