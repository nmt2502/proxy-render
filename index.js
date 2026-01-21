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
      message: "Proxy lỗi / API chết"
    });
  }
}

/* ===== ROUTES ===== */
app.get("/api/sun", (req, res) =>
  proxy(res, "https://api-qk87.onrender.com/api/sun")
);

app.get("/api/bet", (req, res) =>
  proxy(res, "https://apidulieugame.onrender.com/api/dudoan/BET_THUONG")
);

app.get("/api/68gb", (req, res) =>
  proxy(res, "https://apidulieugame.onrender.com/api/dudoan/68GB_MD5")
);

/* ===== START ===== */
app.listen(PORT, () =>
  console.log("Proxy running on port", PORT)
);
