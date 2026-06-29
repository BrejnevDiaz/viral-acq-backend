with open('server.js', 'r', encoding='utf-8') as f:
    code = f.read()

if '/api/image-proxy' not in code:
    proxy_logic = """
app.get("/api/image-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing URL");
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,*/*'
      }
    });
    if (!response.ok) throw new Error("Fetch failed");
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Proxy error");
  }
});
"""
    target = 'app.post("/api/vetting"'
    idx = code.find(target)
    if idx != -1:
        new_code = code[:idx] + proxy_logic + '\n' + code[idx:]
        with open('server.js', 'w', encoding='utf-8') as f:
            f.write(new_code)
        print("PATCHED")
else:
    print("EXISTS")
