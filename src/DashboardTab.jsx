import React, { useState, useEffect } from 'react';

const DashboardTab = ({ c }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      });
  }, []);

  const totalLeads = leads.length;
  const influencers = leads.filter(l => l.reason && l.reason.includes("INFLUENCER")).length;
  const brands = totalLeads - influencers;
  const emailsSent = leads.filter(l => l.emailStatus === 'sent').length;
  const conversionRate = totalLeads > 0 ? ((emailsSent / totalLeads) * 100).toFixed(1) : 0;

  if (loading) return <div style={{ color: c.textMuted }}>Chargement du dashboard...</div>;

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <h2 style={{ fontSize: 22, color: c.text, margin: "0 0 20px 0" }}>📊 Dashboard & KPI</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: c.textMuted, textTransform: "uppercase" }}>Total Prospects</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: c.text, marginTop: 8 }}>{totalLeads}</div>
        </div>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: c.textMuted, textTransform: "uppercase" }}>Influenceurs</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: c.accent, marginTop: 8 }}>{influencers}</div>
        </div>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: c.textMuted, textTransform: "uppercase" }}>Emails Envoyés</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: c.success, marginTop: 8 }}>{emailsSent}</div>
        </div>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: c.textMuted, textTransform: "uppercase" }}>Tx de Conversion</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: c.emailBlue, marginTop: 8 }}>{conversionRate}%</div>
        </div>
      </div>

      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 12 }}>
        <h3 style={{ fontSize: 16, color: c.text, margin: "0 0 16px 0" }}>Derniers prospects acquis</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              <th style={{ padding: "10px 0", color: c.textMuted }}>Nom</th>
              <th style={{ padding: "10px 0", color: c.textMuted }}>Type</th>
              <th style={{ padding: "10px 0", color: c.textMuted }}>Plateforme</th>
              <th style={{ padding: "10px 0", color: c.textMuted }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map(l => (
              <tr key={l.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                <td style={{ padding: "12px 0", color: c.text }}>{l.name}</td>
                <td style={{ padding: "12px 0", color: l.reason?.includes("INFLUENCER") ? c.accent : c.textDim }}>{l.reason?.includes("INFLUENCER") ? "Influenceur" : "Marque"}</td>
                <td style={{ padding: "12px 0", color: c.textDim }}>{l.platform}</td>
                <td style={{ padding: "12px 0", color: c.success }}>{l.score}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTab;
