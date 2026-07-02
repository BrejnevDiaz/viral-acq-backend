const fs = require('fs');
let lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const selectIdx = lines.findIndex((l, i) => i > 1500 && l.includes('<select') && lines[i+1].includes('value={uiLang}'));
if (selectIdx === -1) {
  console.log("Could not find select for uiLang in header.");
  process.exit(0);
}

let endIdx = lines.findIndex((l, i) => i > selectIdx && l.includes('</button>'));
if (endIdx === -1) {
  console.log("Could not find end button.");
  process.exit(1);
}

// Ensure endIdx includes the closing </div> if it's there
let blockEnd = endIdx;
if (lines[blockEnd + 1] && lines[blockEnd + 1].includes('          </div>')) {
  // It's the closing div of `desktop-only` which we SHOULD NOT delete because other things might be in it?
  // Actually, wait:
  //            {emailsSent > 0 && <div className="desktop-only"><Badge...</div>}
  //
  //            <select ...
  //            </select>
  //            <button ...
  //            </button>
  //          </div>
  //        </div>
  // So we just delete from <select> to </button>.
}

lines.splice(selectIdx, blockEnd - selectIdx + 1);
fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Header controls removed dynamically!');
