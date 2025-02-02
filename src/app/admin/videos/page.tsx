import AdminChildPage from '@/components/AdminChildPage';
import { getVideosCached, getVideosMetaCached } from '@/video/cache';
import AdminVideosClient from '@/admin/AdminVideosClient';
import { cookies } from 'next/headers';
import { TIMEZONE_COOKIE_NAME } from '@/utility/timezone';

const INFINITE_SCROLL_INITIAL_ADMIN_VIDEOS = 25;
const INFINITE_SCROLL_MULTIPLE_ADMIN_VIDEOS = 50;

export default async function AdminVideosPage() {
  const timezone = (await cookies()).get(TIMEZONE_COOKIE_NAME)?.value;

  const [
    videos,
    videosCount,
  ] = await Promise.all([
    getVideosCached({
      hidden: 'include',
      sortBy: 'createdAt',
      limit: INFINITE_SCROLL_INITIAL_ADMIN_VIDEOS,
    }).catch(() => []),
    getVideosMetaCached({ hidden: 'include' })
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    <AdminChildPage>
      <AdminVideosClient {...{
        videos,
        videosCount,
        infiniteScrollInitial: INFINITE_SCROLL_INITIAL_ADMIN_VIDEOS,
        infiniteScrollMultiple: INFINITE_SCROLL_MULTIPLE_ADMIN_VIDEOS,
        timezone,
      }} />
    </AdminChildPage>
  );
} 
