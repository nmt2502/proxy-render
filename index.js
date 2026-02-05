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

/* ===== ROUTE TEST ===== */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Proxy running"
  });
});

/* ===== PROXY API SEXY ===== */
app.get("/sexy/:table", async (req, res) => {
  const table = req.params.table.toUpperCase();

  // ⚠️ DÒNG NÀY BẮT BUỘC DÙNG BACKTICK
  const url = https://apibcrdudoan.onrender.com/sexy/${table}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const r = await fetch(url, {
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

    const data = await r.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Proxy lỗi / API chết",
      detail: err.message
    });
  }
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
