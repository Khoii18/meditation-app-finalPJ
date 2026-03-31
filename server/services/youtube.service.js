import axios from "axios";

export const getVideos = async (profile, exercise) => {
  const query = `${exercise} ${profile.level} ${profile.goal} ${profile.injury || ""} proper form`;

  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      part: "snippet",
      maxResults: 10
    }
  });

  return res.data.items.slice(0, 5).map(v => ({
    title: v.snippet.title,
    url: `https://youtube.com/watch?v=${v.id.videoId}`
  }));
};