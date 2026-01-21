import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/sun", async (req, res) => {
  try {
    const r = await fetch("https://api-qk87.onrender.com/api/sun");
    const data = await r.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch {
    res.status(500).json({ error: true });
  }
});

app.listen(3000);
