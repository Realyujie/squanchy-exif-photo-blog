import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import {
  getPhotosMetaCached,
  getPhotosMostRecentUpdateCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_ADMIN_VIDEOS,
} from '@/site/paths';
import AdminNavClient from './AdminNavClient';
import { getVideosMetaCached } from '@/video/cache';

export default async function AdminNav() {
  const [
    countPhotos,
    countUploads,
    countTags,
    countVideos,
    mostRecentPhotoUpdateTime,
  ] = await Promise.all([
    getPhotosMetaCached({ hidden: 'include' })
      .then(({ count }) => count)
      .catch(() => 0),
    getStorageUploadUrlsNoStore()
      .then(urls => urls.length)
      .catch(e => {
        console.error(`Error getting blob upload urls: ${e}`);
        return 0;
      }),
    getUniqueTagsCached().then(tags => tags.length).catch(() => 0),
    getVideosMetaCached({ hidden: 'include' })
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosMostRecentUpdateCached().catch(() => undefined),
  ]);

  // Photos
  const items = [{
    label: 'Photos',
    href: PATH_ADMIN_PHOTOS,
    count: countPhotos,
  }];

  // Videos
  items.push({
    label: 'Videos',
    href: PATH_ADMIN_VIDEOS,
    count: countVideos,
  });

  // Uploads
  if (countUploads > 0) { items.push({
    label: 'Uploads',
    href: PATH_ADMIN_UPLOADS,
    count: countUploads,
  }); }

  // Tags
  if (countTags > 0) { items.push({
    label: 'Tags',
    href: PATH_ADMIN_TAGS,
    count: countTags,
  }); }

  return (
    <AdminNavClient {...{ items, mostRecentPhotoUpdateTime }} />
  );
}
