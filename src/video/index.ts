import { nanoid } from 'nanoid';

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl: string;
  priorityOrder?: number;
  hidden?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoDb {
  id: string;
  title: string;
  description?: string;
  youtube_id: string;
  thumbnail_url: string;
  priority_order?: number;
  hidden?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VideoDbInsert {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl: string;
  priorityOrder?: number;
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const parseVideoFromDb = (video: VideoDb): Video => ({
  id: video.id,
  title: video.title,
  description: video.description,
  youtubeId: video.youtube_id,
  thumbnailUrl: video.thumbnail_url,
  priorityOrder: video.priority_order,
  hidden: video.hidden,
  createdAt: video.created_at,
  updatedAt: video.updated_at,
});

export const parseCachedVideoDates = (video: Video) => ({
  ...video,
  createdAt: new Date(video.createdAt),
  updatedAt: new Date(video.updatedAt),
} as Video);

export const parseCachedVideosDates = (videos: Video[]) =>
  videos.map(parseCachedVideoDates);

export const convertVideoToVideoDbInsert = (
  video: Video,
): VideoDbInsert => ({
  ...video,
  youtubeId: video.youtubeId,
  thumbnailUrl: video.thumbnailUrl,
  createdAt: video.createdAt.toISOString(),
  updatedAt: video.updatedAt.toISOString(),
});

export const generateVideoId = () => nanoid(8);

export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const generateThumbnailUrl = (youtubeId: string): string =>
  `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`; 