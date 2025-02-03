import { Video, VideoData } from './types';
import videoData from './videos.json';

export const getVideos = (): Video[] => {
  return (videoData as VideoData).videos;
};

export const getVideoById = (id: string): Video | undefined => {
  return getVideos().find(video => video.id === id);
}; 
