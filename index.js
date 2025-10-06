import express from "express";
import ytdl from "@distube/ytdl-core";

const { getInfo, chooseFormat } = ytdl;

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/yt/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: "No URL provided" });

  try {
    const info = await getInfo(videoURL);
    const format = chooseFormat(info.formats, { quality: "highest" });

    return res.json({
      title: info.videoDetails.title,
      download: format.url,
      lengthSeconds: info.videoDetails.lengthSeconds
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to process video", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
