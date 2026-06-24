import React, { useState } from 'react';

const GROUP_FINISH_KEYS = [
  'A1', 'B2', 'C3', 'D1', 'E2', 'F4',
  'G4', 'H2', 'I3', 'J4', 'K3', 'L1',
];

export default function BonusPanel({ bonusResults, fullOverrides, onClose }) {
  const [local, setLocal] = useState(() => ({
    groupFinishes: { ...(bonusResults.groupFinishes || {}) },
    r16: [...(bonusResults.r16 || [])],
    qf: [...(bonusResults.qf || [])],
    sf: [...(bonusResults.sf || [])],
    topscorer: bonusResults.topscorer || '',
    winner: bonusResults.winner || '',
  }));
  const [copied, setCopied] = useState(false);

  const setGF = (key, val) => {
    setLocal(prev => ({ ...prev, groupFinishes: { ...prev.groupFinishes, [key]: val } }));
  };

  const setList = (field, val) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean);
    setLocal(prev => ({ ...prev, [field]: arr }));
  };

  const buildOverridesJson = () => {
    const clean = { ...local };
    if (!clean.topscorer) delete clean.topscorer;
    if (!clean.winner) delete clean.winner;
    const next = { ...fullOverrides, bonus: clean };
    return JSON.stringify(next, null, 2);
  };

  const handleCopy = async () => {
    const json = buildOverridesJson();
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⭐ Bonusresultater</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="bonus-admin-section">
            <h3 className="bonus-admin-title">Bonusrunde 1 — Gruppeplacering</h3>
            <div className="bonus-admin-grid">
              {GROUP_FINISH_KEYS.map(key => (
                <div key={key} className="bonus-admin-row">
                  <label className="bonus-admin-label">{key}</label>
                  <input
                    className="bonus-admin-input"
                    placeholder="Hold..."
                    value={local.groupFinishes[key] || ''}
                    onChange={e => setGF(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bonus-admin-section">
            <h3 className="bonus-admin-title">Bonusrunde 2 — 1/8-finalister (kommasepareret)</h3>
            <textarea
              className="bonus-textarea"
              placeholder="Spanien, Frankrig, ..."
              value={local.r16.join(', ')}
              onChange={e => setList('r16', e.target.value)}
              rows={3}
            />
          </div>

          <div className="bonus-admin-section">
            <h3 className="bonus-admin-title">Bonusrunde 3 — Kvartfinalister</h3>
            <textarea
              className="bonus-textarea"
              placeholder="Spanien, Frankrig, ..."
              value={local.qf.join(', ')}
              onChange={e => setList('qf', e.target.value)}
              rows={2}
            />
          </div>

          <div className="bonus-admin-section">
            <h3 className="bonus-admin-title">Bonusrunde 4 — Semifinalister</h3>
            <textarea
              className="bonus-textarea"
              placeholder="Spanien, Frankrig"
              value={local.sf.join(', ')}
              onChange={e => setList('sf', e.target.value)}
              rows={2}
            />
          </div>

          <div className="bonus-admin-section">
            <h3 className="bonus-admin-title">Bonusrunde 5</h3>
            <div className="bonus-admin-row">
              <label className="bonus-admin-label">Topscorer (40 pt)</label>
              <input
                className="bonus-admin-input"
                placeholder="Navn..."
                value={local.topscorer}
                onChange={e => setLocal(p => ({ ...p, topscorer: e.target.value }))}
              />
            </div>
            <div className="bonus-admin-row">
              <label className="bonus-admin-label">VM Vinder (50 pt)</label>
              <input
                className="bonus-admin-input"
                placeholder="Hold..."
                value={local.winner}
                onChange={e => setLocal(p => ({ ...p, winner: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer modal-footer--column">
          <div className="publish-instructions">
            <strong>Sådan deler du det med alle:</strong>
            <ol>
              <li>Tryk "Kopiér JSON" herunder</li>
              <li>Gå til <code>overrides.json</code> i dit GitHub-repo (i mappen <code>public</code>)</li>
              <li>Tryk på blyant-ikonet (✏️ "Edit") øverst til højre på filen</li>
              <li>Markér alt indhold, slet det, og indsæt det du har kopieret</li>
              <li>Tryk "Commit changes" nederst på siden</li>
            </ol>
          </div>
          <div className="footer-buttons">
            <button className="btn-secondary" onClick={onClose}>Luk</button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? '✅ Kopieret!' : '📋 Kopiér JSON'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
