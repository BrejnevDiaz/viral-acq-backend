const fs = require('fs');
let lines = fs.readFileSync('src/App.jsx', 'utf8').split(/\r?\n/);

let f2Idx = lines.findIndex(l => l.includes('Pilotez vos campagnes et votre'));
let sectionEndIdx = lines.findIndex((l, i) => i > f2Idx && l.includes('</section>'));

// Insert the missing </div> right before the </section>
lines.splice(sectionEndIdx, 0, '            </div>');

fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Fixed missing div!');
