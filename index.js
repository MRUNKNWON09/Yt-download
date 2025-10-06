import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/yt/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: "No URL provided" });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(videoURL, { waitUntil: "networkidle2" });

    // Title extract করা
    const title = await page.title();

    // Video src + sources extract
    const sources = await page.evaluate(() => {
      const video = document.querySelector("video");
      if (!video) return null;
      return Array.from(video.querySelectorAll("source")).map(s => ({
        quality: s.getAttribute("label") || "default",
        type: s.type,
        url: s.src
      }));
    });

    await browser.close();

    if (!sources || sources.length === 0)
      return res.status(500).json({ error: "Failed to extract video sources" });

    return res.json({
      title,
      sources
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to process video", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
