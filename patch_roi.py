import codecs

with codecs.open('server.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

target = """    // Anthropic Vetting
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (latestPosts.length > 0 && anthropicKey && !anthropicKey.includes("XXXX")) {"""

idx = code.find(target)
if idx != -1:
    end_target = "    res.json({"
    end_idx = code.find(end_target, idx)
    
    new_logic = """    let estimatedROI = "";

    // Anthropic Vetting
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (latestPosts.length > 0 && anthropicKey && !anthropicKey.includes("XXXX")) {
      const postsInfo = latestPosts.map(p => `Likes: ${p.likes}\\nComments: ${p.comments}`).join("\\n\\n");
      const promptLang = lang === 'en' ? 'English' : (lang === 'it' ? 'Italian' : 'French');
      const prompt = `Profile: ${username}\\nFollowers: ${followers}\\nEngagement: ${engRate}%\\nRecent posts:\\n${postsInfo}\\n\\nAs an influencer marketing expert, analyze this data. Does this profile have authentic audience or potential fake followers? Also, estimate the potential ROI (Return on Investment) for a brand sponsoring this influencer, assuming an average product price of 40€.\\nRespond ONLY with a JSON object containing:\\n"trustScore": a number from 1 to 100.\\n"roiEstimate": a short string estimating revenue per post (e.g. "150€ - 300€").\\n"summary": a short summary (max 3 sentences) focusing on authenticity and profitability, in ${promptLang}.`;

      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }]
          })
        });
        const data = await r.json();
        if (r.ok) {
          const text = data.content?.[0]?.text || "{}";
          const parsed = JSON.parse(text.match(/\\{[\\s\\S]*\\}/)?.[0] || "{}");
          if (parsed.trustScore) trustScore = parsed.trustScore;
          if (parsed.summary) aiSummary = parsed.summary;
          if (parsed.roiEstimate) estimatedROI = parsed.roiEstimate;
        }
      } catch (err) {
        console.error("Anthropic error:", err);
      }
    }

    if (!aiSummary && trustScore === 0) {
      trustScore = parseFloat(engRate) > 2 ? 85 : 45;
      aiSummary = msgOrganic;
    }
    
    // Fallback ROI if AI didn't provide one
    if (!estimatedROI) {
        const activeAudience = followers * (parseFloat(engRate) / 100);
        const clicks = activeAudience * 0.1; // 10% click
        const sales = clicks * 0.02; // 2% convert
        const minRevenue = Math.floor(sales * 30);
        const maxRevenue = Math.floor(sales * 50);
        estimatedROI = `${minRevenue}€ - ${maxRevenue}€`;
    }

"""
    new_code = code[:idx] + new_logic + code[end_idx:]
    with codecs.open('server.js', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print("PATCHED_ROI")
else:
    print("NOT_FOUND")

# Add estimatedROI to json response
with codecs.open('server.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

target2 = """    res.json({
      platform,
      username: username,
      profilePic,
      followersCount: followers,
      engagementRate: `${engRate}%`,
      trustScore,
      aiSummary,"""

idx2 = code.find(target2)
if idx2 != -1:
    new_code2 = code.replace(target2, """    res.json({
      platform,
      username: username,
      profilePic,
      followersCount: followers,
      engagementRate: `${engRate}%`,
      trustScore,
      estimatedROI,
      aiSummary,""")
    with codecs.open('server.js', 'w', encoding='utf-8') as f:
        f.write(new_code2)
    print("PATCHED_JSON")
