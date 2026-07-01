const https = require('https');

const fetchFollowers = (username) => {
  return new Promise((resolve, reject) => {
    https.get(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // This endpoint might be blocked or return HTML login page
          const match = data.match(/"edge_followed_by":{"count":(\d+)}/);
          if (match) {
            resolve({ username, followers: parseInt(match[1]) });
          } else {
            resolve({ username, followers: "Unknown (blocked)" });
          }
        } catch (e) {
          resolve({ username, followers: "Error" });
        }
      });
    }).on('error', (e) => resolve({ username, followers: "Error" }));
  });
};

const users = [
  "diariatou__sow",
  "thatsnora",
  "baratta_jessica",
  "katerinmasi_",
  "glamourousclaudia93",
  "c.lau.g",
  "enzaoliva_",
  "rosaryphotofashionmakeuplook"
];

Promise.all(users.map(fetchFollowers)).then(results => console.log(results));
