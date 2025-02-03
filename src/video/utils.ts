import { Video, VideoData } from './types';
import videoData from './videos.json';

export const getVideos = (): Video[] => {
  return (videoData as VideoData).videos;
};

export const getVideoById = (id: string): Video | undefined => {
  return getVideos().find(video => video.id === id);
};

export const getYouTubeThumbnailUrl = (videoId: string): string => {
  // maxresdefault.jpg 是最高质量的缩略图
  // 如果不可用，会自动回退到 hqdefault.jpg
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}; 
