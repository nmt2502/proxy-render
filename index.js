import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

/* ===== DANH SÁCH API ĐƯỢC PHÉP (PREFIX) ===== */
const ALLOW_PREFIX = [
  "https://apidulieugame.onrender.com/api/dudoan/",
  "https://apidulieugame.onrender.com/check/api/",
  "https://apitest-e7gt.onrender.com/api/",

  // ✅ BCR VIP (CHO PHÉP /api/ban/c01 → c99)
  "https://apibcrvip.onrender.com/api/ban/",
  "https://bcrvip.onrender.com/api/ban/"
];

// ===== PROXY =====
app.get("/proxy", async (req, res) => {
  let url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing url" });
  }

  // ✅ QUAN TRỌNG
  url = decodeURIComponent(url);

  const allow = ALLOW_LIST.some(allowUrl =>
    url.startsWith(allowUrl)
  );

  if (!allow) {
    return res.json({
      error: "Blocked",
      url
    });
  }

  try {
    const r = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Proxy-BiNhoi"
      }
    });

    const text = await r.text();
    res.send(text);
  } catch (e) {
    res.json({ error: e.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy PRO running on port", PORT);
});
