const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const mobileCSS = `

/* --- MOBILE RESPONSIVE UTILITIES --- */
@media (max-width: 768px) {
  /* Layout classes */
  .flex-col-mobile {
    flex-direction: column !important;
  }
  .hide-mobile {
    display: none !important;
  }
  .show-mobile-flex {
    display: flex !important;
  }
  .w-full-mobile {
    width: 100% !important;
    max-width: 100% !important;
  }
  .h-auto-mobile {
    height: auto !important;
  }
  
  /* Text adjustments */
  .text-mobile-h1 {
    fontSize: 40px !important;
    lineHeight: 1.2 !important;
  }
  .text-mobile-h2 {
    fontSize: 32px !important;
    lineHeight: 1.3 !important;
  }
  .text-mobile-h3 {
    fontSize: 24px !important;
  }
  .text-mobile-p {
    fontSize: 16px !important;
  }
  .text-center-mobile {
    text-align: center !important;
  }
  
  /* Margins and Paddings */
  .p-mobile-md {
    padding: 24px !important;
  }
  .p-mobile-sm {
    padding: 16px !important;
  }
  .m-mobile-0 {
    margin: 0 !important;
  }
  .mb-mobile-sm {
    margin-bottom: 16px !important;
  }
  .mt-mobile-lg {
    margin-top: 48px !important;
  }
  
  /* Components */
  .hero-container-mobile {
    padding-top: 100px !important;
  }
  .nav-menu-desktop {
    display: none !important;
  }
  .mobile-menu-btn {
    display: flex !important;
  }
  .dashboard-sidebar {
    position: fixed;
    z-index: 50;
    left: -100%;
    transition: left 0.3s;
  }
  .dashboard-sidebar.open {
    left: 0;
  }
  
  /* Grid conversions */
  .grid-1-mobile {
    grid-template-columns: 1fr !important;
  }
}

/* Default state for mobile-only classes on desktop */
.show-mobile-flex { display: none; }
.mobile-menu-btn { display: none; }
`;

if (!css.includes('MOBILE RESPONSIVE UTILITIES')) {
    fs.appendFileSync('src/index.css', mobileCSS);
    console.log('Mobile utilities appended to index.css');
} else {
    console.log('Mobile utilities already exist.');
}
