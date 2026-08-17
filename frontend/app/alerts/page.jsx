'use client';

import { useState, useEffect } from 'react';

export default function AlertsConsolePage() {
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    train_id: 'TR-801',
    alert_type: 'SPEED_VIOLATION',
    severity: 'CRITICAL',
    description: '',
    location: ''
  });
  const [statusMsg, setStatusMsg] = useState('');

  const fetchAlerts = () => {
    fetch('http://localhost:8000/api/v1/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(() => {
        setAlerts([
          {
            id: "ALT-1001",
            train_id: "TR-404",
            alert_type: "SPEED_VIOLATION",
            severity: "CRITICAL",
            description: "Locomotive exceeded track curved threshold by +12 km/h at Switch Sector B-4.",
            location: "Kalyan Outer Line #3",
            timestamp: "2026-08-17T15:20:00"
          },
          {
            id: "ALT-1002",
            train_id: "TR-801",
            alert_type: "SIGNAL_DELAY",
            severity: "WARNING",
            description: "Holding on automatic block signal #142 due to clearance delay ahead.",
            location: "Kanpur Central Approach",
            timestamp: "2026-08-17T15:25:30"
          }
        ]);
      });
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('LOGGING ANOMALY OVERRIDE TO BACKEND...');
    try {
      const res = await fetch('http://localhost:8000/api/v1/alerts/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatusMsg('OVERRIDE ALERT SUCCESSFULLY LOGGED!');
        setFormData({ train_id: 'TR-801', alert_type: 'SPEED_VIOLATION', severity: 'CRITICAL', description: '', location: '' });
        fetchAlerts();
      } else {
        setStatusMsg('ERROR SUBMITTING ALERT.');
      }
    } catch (err) {
      setStatusMsg('LOCAL MOCK LOGGED (FASTAPI OFFLINE)');
      const mockLogged = { id: `ALT-${Date.now()}`, ...formData, timestamp: new Date().toISOString() };
      setAlerts([mockLogged, ...alerts]);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen p-4 md:p-6 font-mono space-y-6">
      
      {/* Header */}
      <div className="border border-zinc-800 bg-zinc-950 p-4">
        <h1 className="text-xl md:text-2xl font-bold uppercase text-white tracking-wider flex items-center gap-3">
          <span className="w-3 h-3 bg-red-600 inline-block animate-pulse"></span>
          ALERTS CONSOLE // ANOMALY DETECTOR & MANUAL OVERRIDE
        </h1>
        <p className="text-zinc-500 text-xs mt-1">AUTOMATED SYSTEM WARNINGS & DISPATCHER MANUAL OVERRIDES</p>
      </div>

      {/* Main Grid: Alerts Stream & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Automated Alerts Feed (2 Cols) */}
        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider border-b border-zinc-800 pb-3">
            RECENT ANOMALIES & AUDIT LOG
          </h3>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`border p-4 space-y-2 bg-black ${
                  alt.severity === 'CRITICAL' ? 'border-red-600/80 border-l-4 border-l-red-600' : 'border-yellow-600/80 border-l-4 border-l-yellow-600'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{alt.id}</span>
                    <span className="text-orange-500 font-bold">[{alt.train_id}]</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold ${
                    alt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                  }`}>
                    {alt.severity}
                  </span>
                </div>

                <div className="text-sm font-bold text-zinc-200">{alt.alert_type}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{alt.description}</p>

                <div className="flex justify-between items-center text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 mt-2">
                  <span>LOCATION: <strong className="text-zinc-300">{alt.location}</strong></span>
                  <span>TIMESTAMP: {new Date(alt.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Manual Override Trigger Form (1 Col) */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider border-b border-zinc-800 pb-3">
            LOG MANUAL ANOMALY OVERRIDE
          </h3>

          {statusMsg && (
            <div className="p-2 border border-orange-500/50 bg-orange-950/40 text-orange-400 text-xs font-bold">
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">TARGET LOCOMOTIVE ID</label>
              <input
                type="text"
                value={formData.train_id}
                onChange={(e) => setFormData({ ...formData, train_id: e.target.value })}
                required
                className="w-full bg-black border border-zinc-800 text-white p-2.5 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">ANOMALY CATEGORY</label>
              <select
                value={formData.alert_type}
                onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                className="w-full bg-black border border-zinc-800 text-white p-2.5 focus:border-orange-500 outline-none"
              >
                <option value="SPEED_VIOLATION">SPEED_VIOLATION</option>
                <option value="ROUTE_DEV">ROUTE_DEV</option>
                <option value="SIGNAL_PASSED_RED">SIGNAL_PASSED_RED</option>
                <option value="TRACK_BLOCKAGE">TRACK_BLOCKAGE</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">SEVERITY LEVEL</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-black border border-zinc-800 text-white p-2.5 focus:border-orange-500 outline-none"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="WARNING">WARNING</option>
                <option value="INFO">INFO</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">LOCATION / TRACK SECTOR</label>
              <input
                type="text"
                placeholder="e.g. Kanpur Switch B-4"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full bg-black border border-zinc-800 text-white p-2.5 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">DISPATCHER AUDIT DESCRIPTION</label>
              <textarea
                rows={3}
                placeholder="Provide detailed context for manual dispatch record..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full bg-black border border-zinc-800 text-white p-2.5 focus:border-orange-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-black font-extrabold p-3 uppercase tracking-wider border border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              DISPATCH OVERRIDE ALERT →
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
