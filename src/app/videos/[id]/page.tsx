import { getVideoCached } from '@/video/cache';
import SiteGrid from '@/components/SiteGrid';
import { notFound } from 'next/navigation';
import { clsx } from 'clsx/lite';
import { cookies } from 'next/headers';
import { TIMEZONE_COOKIE_NAME } from '@/utility/timezone';
import PhotoDate from '@/photo/PhotoDate';
import { Metadata } from 'next';

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
  const video = await getVideoCached(params.id);
  
  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  return {
    title: video.title,
    description: video.description,
  };
}

export default async function VideoPage({
  params,
  searchParams,
}: Props) {
  const timezone = (await cookies()).get(TIMEZONE_COOKIE_NAME)?.value;
  const video = await getVideoCached(params.id);
  
  if (!video) {
    notFound();
  }

  return (
    <div className="mt-4">
      <SiteGrid
        contentMain={
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="text-dim uppercase">
                <PhotoDate
                  photo={{
                    id: video.id,
                    title: video.title,
                    createdAt: video.createdAt,
                    updatedAt: video.updatedAt,
                    takenAt: video.createdAt,
                    takenAtNaive: video.createdAt.toISOString(),
                    takenAtNaiveFormatted: video.createdAt.toISOString(),
                    tags: [],
                    url: video.thumbnailUrl,
                    blurData: '',
                    aspectRatio: 1.777,
                    extension: 'jpg',
                  }}
                  dateType="createdAt"
                  timezone={timezone}
                />
              </div>
            </div>

            <div className={clsx(
              'w-full aspect-video relative',
              'rounded-lg overflow-hidden',
              'border border-gray-200 dark:border-gray-800'
            )}>
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {video.description && (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {video.description}
              </p>
            )}
          </div>
        }
      />
    </div>
  );
} 
