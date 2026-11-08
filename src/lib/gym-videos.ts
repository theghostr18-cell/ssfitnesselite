import v1 from "@/assets/videos/gym-film-1.mp4.asset.json";
import v2 from "@/assets/videos/gym-film-2.mp4.asset.json";
import v3 from "@/assets/videos/gym-film-3.mp4.asset.json";
import p1 from "@/assets/videos/gym-film-1.jpg.asset.json";
import p2 from "@/assets/videos/gym-film-2.jpg.asset.json";
import p3 from "@/assets/videos/gym-film-3.jpg.asset.json";

export const GYM_VIDEOS = [
  { src: v1.url, poster: p1.url },
  { src: v2.url, poster: p2.url },
  { src: v3.url, poster: p3.url },
] as const;