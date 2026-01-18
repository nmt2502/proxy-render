import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ DANH SÁCH API ĐƯỢC PHÉP
const ALLOW_LIST = [
  "https://apidulieugame.onrender.com/api/dudoan/SUNWIN",
  "https://apidulieugame.onrender.com/api/dudoan/SICBO_SUN",
  "https://luckywingugu.onrender.com/luck/md5",
  "https://luckywingugu.onrender.com/luck8/tx",
  "https://allgametx.onrender.com/api/lc",
  "https://apidulieugame.onrender.com/api/dudoan/LC79_THUONG",
  "https://apibcrvip.onrender.com/api/ban"
];

// ✅ PROXY
app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing url" });
  }

  // ❌ CHẶN LINK KHÔNG NẰM TRONG LIST
  if (!ALLOW_LIST.includes(url)) {
    return res.json({
      error: "Blocked",
      allow: ALLOW_LIST
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
