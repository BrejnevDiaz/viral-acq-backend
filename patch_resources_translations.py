import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    
    code = """import React, { useState } from 'react';

export default function ResourcesTab({ c, mono, uiLang }) {
  const [openFaq, setOpenFaq] = useState(null);

  const t = {
    fr: {
      titleSuccess: "🏆 Nos Succès & Métriques Clés",
      descSuccess: "Les statistiques en temps réel de notre plateforme d'acquisition.",
      shopsAnalyzed: "Boutiques Shopify Analysées",
      shopsDesc: "Suivi quotidien du trafic et des applications.",
      creativesIndexed: "Créatifs AdSpy Indexés",
      creativesDesc: "Vidéos Meta, TikTok et Pinterest.",
      sourcingRate: "Taux de Sourcing Réussi",
      sourcingDesc: "Fournisseurs AliExpress & Google trouvés.",
      roasAverage: "ROAS Moyen de nos Clients",
      roasDesc: "Augmentation après analyse concurrentielle.",
      
      titleEdu: "📚 Nos Ressources Éducatives",
      descEdu: "Accélérez votre croissance e-commerce avec nos ressources exclusives.",
      liveCoaching: "Live Coaching",
      everyWeek: "Chaque Semaine",
      liveCoachingDesc: "Rejoignez nos sessions hebdomadaires en direct pour analyser vos stratégies publicitaires et optimiser votre taux d'acquisition avec l'équipe de coachs de ViralAcq.",
      blogStrategies: "Blog & Stratégies",
      blogDesc: "Conseils, astuces et études de cas concrètes sur l'acquisition payante et l'influence pour scaler votre boutique Shopify de 0 à 100k€ par mois.",
      shopifyOffer: "Boutique Shopify à 1$/mois 🚀",
      shopifyOfferDesc: "Profitez de notre partenariat d'affiliation exclusif : Créez votre boutique Shopify pour seulement 1$/mois pendant 3 mois et obtenez 14 jours d'essai gratuit.",
      claimOffer: "Profiter de l'offre ➔",
      
      titleFaq: "❓ Foire Aux Questions (FAQ)",
      descFaq: "Toutes les réponses à vos questions techniques et fonctionnelles.",
      
      titlePartners: "🤝 Nos Partenariats & Intégrations",
      descPartners: "Nous collaborons avec les meilleures technologies du marché.",
      
      titleLegal: "⚖️ Mentions Légales",
      descLegal: "Informations obligatoires concernant l'éditeur et l'hébergeur de l'application.",
      legalSec1: "1. Éditeur de l'application",
      legalSec1Desc: "La suite Pro ViralAcq est éditée par la société Viral Acquisition S.r.l., au capital social de 10 000 €, immatriculée sous le numéro fiscal IT820492049, ayant son siège social à Milan, Italie. Directeur de la publication : Brejnev Diaz, Fondateur & CEO.",
      legalSec2: "2. Hébergement",
      legalSec2Desc: "Cette application SaaS est hébergée sur les serveurs sécurisés d'Amazon Web Services (AWS) Europe (Francfort) et de Supabase Inc., garantissant une protection maximale de vos données et une conformité totale au Règlement Général sur la Protection des Données (RGPD).",
      legalSec3: "3. Données Personnelles et Sécurité",
      legalSec3Desc: "Conformément à la législation européenne, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Les données collectées pour la prospection ne sont jamais partagées à des tiers et restent confinées dans votre CRM privé sécurisé.",
      
      q1: "Comment fonctionne l'estimation du Chiffre d'Affaires ?",
      a1: "Notre algorithme croise le volume de trafic mensuel détecté avec le panier moyen typique du secteur (niche) et un taux de conversion standard de 1.8% à 2.5% pour estimer le chiffre d'affaires généré de manière réaliste.",
      q2: "Comment les applications et le thème Shopify sont-ils identifiés ?",
      a2: "En analysant le code source HTML public de la boutique cible, notre système détecte les signatures CSS des thèmes populaires ainsi que les scripts de tracking et les APIs tierces connectées (Klaviyo, Loox, Recharge, etc.).",
      q3: "D'où proviennent les données des produits phares et des publicités ?",
      a3: "Les produits best-sellers sont extraits en analysant le catalogue public de la boutique. Les créatifs publicitaires sont récupérés en direct depuis la bibliothèque publicitaire Meta Ads, TikTok Creative Center et Pinterest Ads.",
      q4: "Puis-je exporter une boutique directement dans le CRM de prospection ?",
      a4: "Oui ! En cliquant sur 'Prospecter Boutique' ou 'Importer', la marque est instantanément ajoutée à vos leads CRM. Vous pouvez alors lui attribuer des créateurs partenaires et lancer des campagnes d'outreach automatisées."
    },
    en: {
      titleSuccess: "🏆 Our Success & Key Metrics",
      descSuccess: "Real-time statistics of our acquisition platform.",
      shopsAnalyzed: "Shopify Stores Analyzed",
      shopsDesc: "Daily tracking of traffic and applications.",
      creativesIndexed: "AdSpy Creatives Indexed",
      creativesDesc: "Meta, TikTok and Pinterest videos.",
      sourcingRate: "Successful Sourcing Rate",
      sourcingDesc: "AliExpress & Google suppliers found.",
      roasAverage: "Average ROAS of our Clients",
      roasDesc: "Increase after competitive analysis.",
      
      titleEdu: "📚 Our Educational Resources",
      descEdu: "Accelerate your e-commerce growth with our exclusive resources.",
      liveCoaching: "Live Coaching",
      everyWeek: "Every Week",
      liveCoachingDesc: "Join our weekly live sessions to analyze your advertising strategies and optimize your acquisition rate with the ViralAcq coaching team.",
      blogStrategies: "Blog & Strategies",
      blogDesc: "Tips, tricks and concrete case studies on paid acquisition and influence to scale your Shopify store from 0 to €100k per month.",
      shopifyOffer: "Shopify Store at $1/month 🚀",
      shopifyOfferDesc: "Take advantage of our exclusive affiliate partnership: Create your Shopify store for just $1/month for 3 months and get a 14-day free trial.",
      claimOffer: "Claim the offer ➔",
      
      titleFaq: "❓ Frequently Asked Questions (FAQ)",
      descFaq: "All answers to your technical and functional questions.",
      
      titlePartners: "🤝 Our Partnerships & Integrations",
      descPartners: "We collaborate with the best technologies on the market.",
      
      titleLegal: "⚖️ Legal Notice",
      descLegal: "Mandatory information concerning the publisher and host of the application.",
      legalSec1: "1. App Publisher",
      legalSec1Desc: "The ViralAcq Pro suite is published by the company Viral Acquisition S.r.l., with a share capital of €10,000, registered under tax number IT820492049, with its registered office in Milan, Italy. Publishing Director: Brejnev Diaz, Founder & CEO.",
      legalSec2: "2. Hosting",
      legalSec2Desc: "This SaaS application is hosted on secure servers of Amazon Web Services (AWS) Europe (Frankfurt) and Supabase Inc., ensuring maximum data protection and full compliance with the General Data Protection Regulation (GDDR).",
      legalSec3: "3. Personal Data and Security",
      legalSec3Desc: "In accordance with European legislation, you have the right to access, rectify and delete your personal data. The data collected for prospecting is never shared with third parties and remains confined to your private secure CRM.",
      
      q1: "How does Turnover estimation work?",
      a1: "Our algorithm crosses the detected monthly traffic volume with the typical average basket of the sector (niche) and a standard conversion rate of 1.8% to 2.5% to estimate the generated revenue realistically.",
      q2: "How are Shopify apps and themes identified?",
      a2: "By analyzing the public HTML source code of the target store, our system detects CSS signatures of popular themes as well as tracking scripts and connected third-party APIs (Klaviyo, Loox, Recharge, etc.).",
      q3: "Where do hot products and ad data come from?",
      a3: "Best-selling products are extracted by analyzing the store's public catalog. Advertising creatives are retrieved live from the Meta Ads Library, TikTok Creative Center and Pinterest Ads.",
      q4: "Can I export a store directly to the prospecting CRM?",
      a4: "Yes! By clicking on 'Prospect Store' or 'Import', the brand is instantly added to your CRM leads. You can then assign partner creators and launch automated outreach campaigns."
    },
    it: {
      titleSuccess: "🏆 I Nostri Successi & Metriche Chiave",
      descSuccess: "Statistiche in tempo reale della nostra piattaforma di acquisizione.",
      shopsAnalyzed: "Negozi Shopify Analizzati",
      shopsDesc: "Tracciamento quotidiano di traffico e applicazioni.",
      creativesIndexed: "Creativi AdSpy Indicizzati",
      creativesDesc: "Video di Meta, TikTok e Pinterest.",
      sourcingRate: "Tasso di Sourcing Riuscito",
      sourcingDesc: "Fornitori AliExpress & Google trovati.",
      roasAverage: "ROAS Medio dei nostri Clienti",
      roasDesc: "Aumento dopo l'analisi della concorrenza.",
      
      titleEdu: "📚 Le Nostre Risorse Educative",
      descEdu: "Accelera la tua crescita e-commerce con le nostre risorse esclusive.",
      liveCoaching: "Coaching dal Vivo",
      everyWeek: "Ogni Settimana",
      liveCoachingDesc: "Partecipa alle nostre sessioni settimanali dal vivo per analizzare le tue strategie pubblicitarie e ottimizzare il tuo tasso di acquisizione con il team di coach di ViralAcq.",
      blogStrategies: "Blog & Strategie",
      blogDesc: "Consigli, trucchi e casi di studio concreti sull'acquisizione a pagamento e sull'influenza per scalare il tuo negozio Shopify da 0 a 100k€ al mese.",
      shopifyOffer: "Negozio Shopify a 1$/mese 🚀",
      shopifyOfferDesc: "Approfitta della nostra partnership di affiliazione esclusiva: Crea il tuo negozio Shopify a solo 1$/mese per 3 mesi e ottieni 14 giorni di prova gratuita.",
      claimOffer: "Approfitta dell'offerta ➔",
      
      titleFaq: "❓ Domande Frequenti (FAQ)",
      descFaq: "Tutte le risposte alle tue domande tecniche e funzionali.",
      
      titlePartners: "🤝 Le Nostre Partnership & Integrazioni",
      descPartners: "Collaboriamo con le migliori tecnologie sul mercato.",
      
      titleLegal: "⚖️ Note Legali",
      descLegal: "Informazioni obbligatorie riguardanti l'editore e l'host dell'applicazione.",
      legalSec1: "1. Editore dell'applicazione",
      legalSec1Desc: "La suite ViralAcq Pro è pubblicata dalla società Viral Acquisition S.r.l., con un capitale sociale di 10.000 €, iscritta con il codice fiscale IT820492049, con sede legale a Milano, Italia. Direttore editoriale: Brejnev Diaz, Fondatore & CEO.",
      legalSec2: "2. Hosting",
      legalSec2Desc: "Questa applicazione SaaS è ospitata sui server sicuri di Amazon Web Services (AWS) Europe (Francoforte) e Supabase Inc., garantendo la massima protezione dei tuoi dati e la piena conformità al Regolamento Generale sulla Protezione dei Dati (GDPR).",
      legalSec3: "3. Dati Personali e Sicurezza",
      legalSec3Desc: "In conformità con la legislazione europea, hai il diritto di accedere, rettificare e cancellare i tuoi dati personali. I dati raccolti per la prospezione non vengono mai condivisi con terze parti e rimangono confinati nel tuo CRM privato sicuro.",
      
      q1: "Come funziona la stima del fatturato?",
      a1: "Il nostro algoritmo incrocia il volume di traffico mensile rilevato con il carrello medio tipico del settore (nicchia) e un tasso di conversione standard dell'1.8% al 2.5% per stimare il fatturato generato in modo realistico.",
      q2: "Come vengono identificati i temi e le app Shopify?",
      a2: "Analizzando il codice sorgente HTML pubblico del negozio di destinazione, il nostro sistema rileva le firme CSS dei temi popolari, nonché gli script di tracciamento e le API di terze parti collegate (Klaviyo, Loox, Recharge, ecc.).",
      q3: "Da dove provengono i dati dei prodotti di punta e delle inserzioni?",
      a3: "I prodotti più venduti vengono estratti analizzando il catalogo pubblico del negozio. I creativi pubblicitari vengono recuperati in tempo reale dalla Meta Ads Library, TikTok Creative Center e Pinterest Ads.",
      q4: "Posso esportare un negozio direttamente nel CRM di prospezione?",
      a4: "Sì! Cliccando su 'Prospetta Negozio' o 'Importa', il marchio viene istantaneamente aggiunto ai tuoi lead CRM. Puoi quindi assegnare creatori partner e avviare campagne di outreach automatizzate."
    }
  }[uiLang] || t.fr;

  const stats = [
    { number: "+150k", label: t.shopsAnalyzed, desc: t.shopsDesc },
    { number: "12M+", label: t.creativesIndexed, desc: t.creativesDesc },
    { number: "98.8%", label: t.sourcingRate, desc: t.sourcingDesc },
    { number: "+320%", label: t.roasAverage, desc: t.roasDesc }
  ];

  const partnerships = [
    { name: "Shopify Partner", logo: "https://cdn.simpleicons.org/shopify/96bf48" },
    { name: "Meta Business Partner", logo: "https://cdn.simpleicons.org/meta/0668e1" },
    { name: "TikTok Shop Partner", logo: "https://cdn.simpleicons.org/tiktok/000000" },
    { name: "Pinterest Business", logo: "https://cdn.simpleicons.org/pinterest/bd081c" },
    { name: "AliExpress Sourcing", logo: "https://cdn.simpleicons.org/aliexpress/ff4747" }
  ];

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 }
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* ── SECTION SUCCESS / NOS SUCCÈS ── */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleSuccess}</h3>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descSuccess}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 20, textAlign: "center", transition: "transform 0.2s" }}>
              <div style={{ fontSize: 32, fontWeight: 900, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6, fontFamily: mono }}>{s.number}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: c.textMuted }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION RESSOURCES (INSPIRED BY COPYFY) ── */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleEdu}</h3>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descEdu}</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Live Coaching Card */}
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, flexShrink: 0, fontSize: 20 }}>📢</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: 0 }}>{t.liveCoaching}</h4>
                <span style={{ fontSize: 9, fontWeight: 700, background: c.successSoft, color: c.success, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>{t.everyWeek}</span>
              </div>
              <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                {t.liveCoachingDesc}
              </p>
            </div>
          </div>

          {/* Blog Card */}
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.accent2}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent2, flexShrink: 0, fontSize: 20 }}>📰</div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.blogStrategies}</h4>
              <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                {t.blogDesc}
              </p>
            </div>
          </div>

          {/* Shopify $1 Offer Affiliation Card */}
          <div style={{ background: `linear-gradient(135deg, ${c.card}, rgba(16,185,129,0.02))`, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flex: "1 1 300px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid rgba(149,191,72,0.2)`, background: "rgba(149,191,72,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="https://cdn.simpleicons.org/shopify/96bf48" style={{ width: 32, height: 32 }} alt="Shopify" />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 4px 0" }}>{t.shopifyOffer}</h4>
                <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
                  {t.shopifyOfferDesc}
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.open("https://shopify.pxf.io/c/va-pro", "_blank")}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#96bf48", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono, boxShadow: "0 4px 16px rgba(150,191,72,0.3)" }}
            >
              {t.claimOffer}
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION FAQ (ACCORDION) ── */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleFaq}</h3>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descFaq}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                style={{ 
                  background: c.card, 
                  border: `1.5px solid ${isOpen ? c.borderActive : c.border}`, 
                  borderRadius: 12, 
                  overflow: "hidden",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{ 
                    width: "100%", 
                    padding: "16px 20px", 
                    background: "transparent", 
                    border: "none", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    color: isOpen ? c.accent : c.text, 
                    fontWeight: 700, 
                    fontSize: 14, 
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: 12, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </button>
                
                {isOpen && (
                  <div style={{ 
                    padding: "0 20px 16px 20px", 
                    color: c.textMuted, 
                    fontSize: 13, 
                    lineHeight: 1.5,
                    borderTop: `1px solid ${c.border}22`,
                    paddingTop: 12,
                    animation: "fadeIn 0.2s ease-out" 
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION PARTENARIATS ── */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titlePartners}</h3>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descPartners}</p>
        </div>
        <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center", alignItems: "center" }}>
          {partnerships.map((p, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.7, hover: { opacity: 1 }, transition: "opacity 0.2s" }}>
              <img src={p.logo} style={{ width: 22, height: 22, filter: c.iconFilter }} alt={p.name} />
              <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION MENTIONS LÉGALES ── */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{t.titleLegal}</h3>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>{t.descLegal}</p>
        </div>
        
        <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec1}</h5>
            <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
              {t.legalSec1Desc}
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec2}</h5>
            <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
              {t.legalSec2Desc}
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.legalSec3}</h5>
            <p style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
              {t.legalSec3Desc}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
"""
    with open("src/ResourcesTab.jsx", "w", encoding="utf-8") as f:
        f.write(f.read() if False else code)
    print("Re-written ResourcesTab.jsx successfully with full translations!")

if __name__ == "__main__":
    main()
