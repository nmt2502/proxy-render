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

/* ===== HÀM PROXY CHUNG ===== */
async function proxy(res, url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

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

    const text = await r.text();

    // đề phòng API trả rác trước JSON
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON");
    }

    const data = JSON.parse(text.slice(start, end + 1));
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Proxy lỗi / API chết",
      detail: err.message
    });
  }
}

/* ===== ROUTE SEXY (C01–C16) ===== */
app.get("/sexy/:table", (req, res) => {
  const table = req.params.table.toUpperCase();
  const url = https://apibcrdudoan.onrender.com/sexy/${table};
  proxy(res, url);
});

/* ===== START ===== */
app.listen(PORT, () =>
  console.log("✅ Proxy running on port", PORT)
);
