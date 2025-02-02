import { getVideosCached, getVideosMetaCached } from '@/video/cache';
import SiteGrid from '@/components/SiteGrid';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { TIMEZONE_COOKIE_NAME } from '@/utility/timezone';
import PhotoDate from '@/photo/PhotoDate';

const VIDEOS_PER_PAGE = 12;

export default async function VideosPage() {
  const timezone = (await cookies()).get(TIMEZONE_COOKIE_NAME)?.value;

  const [videos, { count: totalCount }] = await Promise.all([
    getVideosCached({
      limit: VIDEOS_PER_PAGE,
      sortBy: 'createdAt',
    }).catch(() => []),
    getVideosMetaCached().catch(() => ({ count: 0 })),
  ]);

  if (videos.length === 0) {
    return (
      <div className="mt-4">
        <SiteGrid
          contentMain={
            <div className="text-center text-gray-500 dark:text-gray-400">
              No Video Here
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <SiteGrid
        contentMain={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Videos ({totalCount})</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className={clsx(
                    'group block',
                    'rounded-lg overflow-hidden',
                    'border border-gray-200 dark:border-gray-800',
                    'transition-all duration-300 hover:scale-[1.02]'
                  )}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className={clsx(
                      'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100',
                      'flex items-center justify-center',
                      'transition-opacity duration-300'
                    )}>
                      <div className="text-white text-lg">Play Video</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-medium mb-1">{video.title}</h2>
                    <div className="text-sm text-dim uppercase">
                      <PhotoDate
                        photo={{
                          createdAt: video.createdAt,
                          updatedAt: video.updatedAt,
                        }}
                        dateType="createdAt"
                        timezone={timezone}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
} 
