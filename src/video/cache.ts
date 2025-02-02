import {
  revalidatePath,
  revalidateTag,
  unstable_cache,
} from 'next/cache';
import {
  getVideo,
  getVideos,
  getVideosMeta,
  GetVideosOptions,
} from './db/query';
import { parseCachedVideoDates, parseCachedVideosDates, Video } from '.';
import { PATH_ADMIN_VIDEOS, PATH_VIDEOS } from '@/site/paths';

// Table key
const KEY_VIDEOS = 'videos';
const KEY_VIDEO = 'video';
// Type keys
const KEY_COUNT = 'count';

const getVideosCacheKeyForOption = (
  options: GetVideosOptions,
  option: keyof GetVideosOptions,
): string | null => {
  const value = options[option];
  return value !== undefined ? `${option}-${value}` : null;
};

const getVideosCacheKeys = (options: GetVideosOptions = {}) => {
  const tags: string[] = [];

  Object.keys(options).forEach(key => {
    const tag = getVideosCacheKeyForOption(
      options,
      key as keyof GetVideosOptions,
    );
    if (tag) { tags.push(tag); }
  });

  return tags;
};

export const revalidateVideosKey = () =>
  revalidateTag(KEY_VIDEOS);

export const revalidateAllKeys = () => {
  revalidateVideosKey();
};

export const revalidateVideo = (videoId: string) => {
  // Tags
  revalidateTag(videoId);
  revalidateVideosKey();
  // Paths
  revalidatePath(PATH_VIDEOS, 'layout');
  revalidatePath(PATH_ADMIN_VIDEOS, 'layout');
};

// Cache

export const getVideosCached = (
  ...args: Parameters<typeof getVideos>
) => unstable_cache<Promise<Video[]>>(
  () => getVideos(...args).then(parseCachedVideosDates),
  [KEY_VIDEOS, ...getVideosCacheKeys(...args)],
)();

export const getVideoCached = (...args: Parameters<typeof getVideo>) =>
  unstable_cache<Promise<Video | undefined>>(
    () => getVideo(...args).then(video => video ? parseCachedVideoDates(video) : undefined),
    [KEY_VIDEOS, KEY_VIDEO],
  )();

export const getVideosMetaCached = (
  ...args: Parameters<typeof getVideosMeta>
) => unstable_cache(
  () => getVideosMeta(...args),
  [KEY_VIDEOS, KEY_COUNT, ...getVideosCacheKeys(...args)],
)(); 
