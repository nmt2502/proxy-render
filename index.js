import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== CORS ===== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

/* ===== PROXY CHUNG ===== */
async function proxy(req, res, targetUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s

    const r = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    clearTimeout(timeout);

    if (!r.ok) {
      return res.status(502).json({
        error: true,
        message: "API gốc lỗi",
        status: r.status
      });
    }

    const text = await r.text();

    // parse an toàn
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: true,
        message: "API không phải JSON"
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Proxy timeout / API chết",
      detail: err.message
    });
  }
}

/* ===== ROUTE PROXY SEXY ===== */
app.get("/sexy/:table", async (req, res) => {
  const table = req.params.table.toUpperCase();
  const url = https://apibcrdudoan.onrender.com/sexy/${table};

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!r.ok) {
      return res.status(502).json({
        error: true,
        message: "API gốc lỗi",
        status: r.status
      });
    }

    const data = await r.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Proxy lỗi",
      detail: err.message
    });
  }
});

/* ===== TEST ===== */
app.get("/", (req, res) => {
  res.send("PROXY OK");
});

/* ===== START ===== */
app.listen(PORT, () => {
  console.log("🚀 Proxy running on port", PORT);
});
