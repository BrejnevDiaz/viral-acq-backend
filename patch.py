import sys

with open('src/VettingTab.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports
code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { jsPDF } from 'jspdf';\nimport html2canvas from 'html2canvas';"
)

# 2. State & Hooks & PDF function
target2 = "const [data, setData] = useState(null);\n\n  const handleSubmit = async (e) => {"
replacement2 = """const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(${API_URL}/api/vetting/history)
      .then(res => res.json())
      .then(d => setHistory(d.history || []))
      .catch(e => console.error(e));
  }, [API_URL, data]);

  const exportPDF = async () => {
    const el = document.getElementById("vetting-result-card");
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: c.bg });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(Vetting_.pdf);
  };

  const handleSubmit = async (e) => {"""
code = code.replace(target2, replacement2)

# 3. Main layout wrap (Start)
target3 = "<div style={{ animation: "fadeIn 0.4s ease-out" }}>\n      {/* Search form */}"
replacement3 = """<div style={{ display: "flex", gap: 24, animation: "fadeIn 0.4s ease-out", flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 600px", minWidth: 0 }}>
        {/* Search form */}\n"""
code = code.replace(target3, replacement3)

# 4. Result card ID
target4 = "{data && (\n        <div style={{ background: c.card, border: \1px solid \"
replacement4 = "{data && (\n        <div id="vetting-result-card" style={{ background: c.card, border: \1px solid \"
code = code.replace(target4, replacement4)

# 5. Export Button
target5 = "            </div>\n          )}\n        </div>\n      )}"
replacement5 = """            </div>\n          )}
          
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }} data-html2canvas-ignore="true">
            <button type="button" onClick={exportPDF} style={{ padding: "10px 16px", borderRadius: 8, background: c.accent, color: "#fff", border: "none", cursor: "pointer", fontFamily: mono, fontSize: 13, fontWeight: "bold" }}>
              ?? Exporter PDF
            </button>
          </div>
        </div>
      )}"""
code = code.replace(target5, replacement5)

# 6. Sidebar (End)
target6 = "      <style>{\n        @keyframes fadeInUp"
replacement6 = """      </div>

      {/* Sidebar Historique */}
      <div style={{ flex: "0 0 320px", background: c.card, border: \1px solid \, borderRadius: 14, padding: 20, minHeight: 400 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontFamily: mono, color: c.text }}>?? Historique ({history.length})</h3>
        {history.length === 0 ? (
          <p style={{ color: c.textMuted, fontSize: 13 }}>Aucun historique disponible.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((h, idx) => (
              <div key={idx} style={{ background: c.bg, border: \1px solid \, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: c.text }}>@{h.username}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: h.trust_score >= 80 ? c.success : (h.trust_score >= 50 ? c.warning : c.error) }}>
                    {h.trust_score}/100
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: c.textMuted, textTransform: "capitalize" }}>{h.platform}</span>
                  <span style={{ color: c.textMuted }}>{h.engagement}% eng</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{\n        @keyframes fadeInUp"""
code = code.replace(target6, replacement6)

with open('src/VettingTab.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('DONE')
