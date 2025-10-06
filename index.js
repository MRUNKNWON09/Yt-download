import express from "express";
import { getInfo, chooseFormat } from "@distube/ytdl-core";

const app = express();

app.get("/", (req, res) => {
  res.send("✅ YouTube Download API is running!");
});

app.get("/yt/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) {
    return res.status(400).json({ error: "❌ Please provide ?url=YouTube_Link" });
  }

  try {
    const info = await getInfo(videoURL);
    const format = chooseFormat(info.formats, { quality: "highest" });

    res.json({
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      download_url: format.url,
      quality: format.qualityLabel,
      type: format.container
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process video",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
