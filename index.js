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
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing url" });
  }

  // ❌ CHẶN LINK KHÔNG ĐÚNG PREFIX
  const isAllowed = ALLOW_PREFIX.some(prefix =>
    url.startsWith(prefix)
  );

  if (!isAllowed) {
    return res.json({
      error: "Blocked",
      allow_prefix: ALLOW_PREFIX
    });
  }

  try {
    const r = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Proxy-BiNhoi"
      }
    });

    const contentType = r.headers.get("content-type") || "";

    res.set("Content-Type", contentType);

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
