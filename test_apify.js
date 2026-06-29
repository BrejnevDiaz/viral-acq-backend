import { ApifyClient } from 'apify-client';
import { readFileSync } from 'fs';

try {
  const env = readFileSync(".env", "utf8");
  env.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  });
} catch (e) {}

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function test() {
    console.log("Testing Apify Instagram Scraper...");
    try {
        const run = await client.actor("apify/instagram-scraper").call({ search: ["cristiano"], searchType: "user", resultsType: "details" });
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log("SUCCESS:", items.length > 0 ? items[0].followersCount : "No items");
    } catch(err) {
        console.error("FAILED:", err.message);
    }
}
test();
