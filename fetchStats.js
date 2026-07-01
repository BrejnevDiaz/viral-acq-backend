import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'apify_api_M5QkLm3exdvJUNqfE93ZpwxtP8jgiI20kWU8' });

async function getStats(username) {
  const run = await client.actor("apify/instagram-profile-scraper").call({ usernames: [username] });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  if (items.length > 0) {
    const profile = items[0];
    const followers = profile.followersCount || 0;
    const posts = profile.latestPosts || [];
    let interactions = 0;
    posts.slice(0, 5).forEach(p => interactions += p.likesCount + p.commentsCount);
    let engRate = "0.0%";
    if (posts.length > 0 && followers > 0) {
      engRate = ((interactions / Math.min(posts.length, 5)) / followers * 100).toFixed(1) + "%";
    }
    console.log(`${username}: ${followers} followers, ${engRate} eng`);
  } else {
    console.log(`${username}: NOT FOUND`);
  }
}

async function run() {
  await getStats('diariatou__sow');
  await getStats('thatsnora');
  await getStats('baratta_jessica');
  await getStats('katerinmasi_');
  await getStats('glamourousclaudia93');
}

run();
