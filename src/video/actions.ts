'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import { redirect } from 'next/navigation';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import {
  deleteVideo,
  getVideo,
  getVideos,
  insertVideo,
  updateVideo,
} from './db/query';
import { GetVideosOptions } from './db/query';
import { revalidateVideo } from './cache';
import {
  Video,
  convertVideoToVideoDbInsert,
  extractYouTubeId,
  generateThumbnailUrl,
  generateVideoId,
} from '.';

export const addVideoAction = async (formData: FormData) => {
  return runAuthenticatedAdminServerAction(async () => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      throw new Error('无效的 YouTube 链接');
    }

    const now = new Date();
    const video: Video = {
      id: generateVideoId(),
      title,
      description,
      youtubeId,
      thumbnailUrl: generateThumbnailUrl(youtubeId),
      createdAt: now,
      updatedAt: now,
    };

    await insertVideo(convertVideoToVideoDbInsert(video));
    revalidateVideo(video.id);
    redirect(PATH_ADMIN_VIDEOS);
  });
};

export const updateVideoAction = async (
  videoId: string,
  formData: FormData,
) => {
  return runAuthenticatedAdminServerAction(async () => {
    const existingVideo = await getVideo(videoId, true);
    if (!existingVideo) {
      throw new Error('视频不存在');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      throw new Error('无效的 YouTube 链接');
    }

    const video: Video = {
      ...existingVideo,
      title,
      description,
      youtubeId,
      thumbnailUrl: generateThumbnailUrl(youtubeId),
      updatedAt: new Date(),
    };

    await updateVideo(convertVideoToVideoDbInsert(video));
    revalidateVideo(video.id);
    redirect(PATH_ADMIN_VIDEOS);
  });
};

export const deleteVideoAction = async (videoId: string) => {
  return runAuthenticatedAdminServerAction(async () => {
    await deleteVideo(videoId);
    revalidateVideo(videoId);
    redirect(PATH_ADMIN_VIDEOS);
  });
};

export const getVideosAction = async (options: GetVideosOptions) =>
  getVideos(options); 