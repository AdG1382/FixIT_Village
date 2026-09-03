import React, { useState, useEffect } from 'react';
import { X, Sparkles, Tag, Calendar, GitCommit } from 'lucide-react';

export function ChangelogModal({ onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/changelog')
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load changelog:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '580px', width: '100%', border: '3px solid #bae6fd', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-sun)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>FixIT Changelog</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>Latest updates & improvements</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading changelog...
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '2px'
          }}>
            {logs.map((release, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderLeft: idx === 0 ? '4px solid var(--accent-sun)' : '2px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      background: idx === 0 ? '#fef3c7' : '#f1f5f9',
                      color: idx === 0 ? '#b45309' : 'var(--text-secondary)',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      border: idx === 0 ? '1px solid #fde68a' : '1px solid #e2e8f0'
                    }}>
                      {release.version}
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {release.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Calendar size={11} />
                    {release.releaseDate}
                  </span>
                </div>

                <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0, color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>
                  {release.changes.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem', lineHeight: 1.35 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
