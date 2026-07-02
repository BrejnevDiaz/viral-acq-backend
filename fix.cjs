const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const searchString = 'return (\n      <div style={{ minHeight: "100vh", background: "#080810"';
const oldReturnStart = c.indexOf(searchString);

if (oldReturnStart !== -1) {
  // Find the next `return (` which is the dashboard
  const nextReturn = c.indexOf('return (', oldReturnStart + 100);
  if (nextReturn !== -1) {
    const newC = c.substring(0, oldReturnStart) + c.substring(nextReturn);
    fs.writeFileSync('src/App.jsx', newC);
    console.log('Fixed leftover code!');
  } else {
    console.log('Could not find next return');
  }
} else {
  console.log('Could not find search string');
}
