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

/* ===== PROXY SEXY ===== */
app.get("/sexy/:table", async (req, res) => {
  const { table } = req.params;
  const url = https://apibcrdudoan.onrender.com/sexy/${table};

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const r = await fetch(url, { signal: controller.signal });
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
      message: "Proxy lỗi / timeout"
    });
  }
});

/* ===== START ===== */
app.listen(PORT, () =>
  console.log("Proxy running on port", PORT)
);
