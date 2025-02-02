'use client';

import { Video } from '@/types/video';
import { useState } from 'react';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import LoaderButton from '@/components/primitives/LoaderButton';
import Note from '@/components/Note';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';

export default function AdminVideoEditClient({ video }: { video: Video }) {
  const router = useRouter();
  const [videoTitle, setVideoTitle] = useState(video.title);
  const [videoDescription, setVideoDescription] = useState(video.description || '');
  const [videoUrl, setVideoUrl] = useState(`https://www.youtube.com/watch?v=${video.youtubeId}`);

  const handleSave = async () => {
    // 这里添加保存视频到数据库的逻辑
    console.log('Saving video:', {
      id: video.id,
      title: videoTitle,
      description: videoDescription,
      url: videoUrl,
    });
    
    // 保存成功后返回列表页面
    router.push(PATH_ADMIN_VIDEOS);
  };

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <Note color="gray">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Video Title
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className={clsx(
                      'mt-1 block w-full rounded-md',
                      'border border-gray-300 dark:border-gray-700',
                      'bg-white dark:bg-gray-800',
                      'px-3 py-2'
                    )}
                    placeholder="Enter Video Title"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Video Description
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    className={clsx(
                      'mt-1 block w-full rounded-md',
                      'border border-gray-300 dark:border-gray-700',
                      'bg-white dark:bg-gray-800',
                      'px-3 py-2'
                    )}
                    rows={3}
                    placeholder="Enter Video Description"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  YouTube Video Link
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={clsx(
                      'mt-1 block w-full rounded-md',
                      'border border-gray-300 dark:border-gray-700',
                      'bg-white dark:bg-gray-800',
                      'px-3 py-2'
                    )}
                    placeholder="Enter YouTube Video Link"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <LoaderButton
                  onClick={() => router.push(PATH_ADMIN_VIDEOS)}
                >
                  取消
                </LoaderButton>
                <LoaderButton
                  onClick={handleSave}
                  disabled={!videoTitle || !videoUrl}
                  primary
                >
                  保存
                </LoaderButton>
              </div>
            </div>
          </Note>

          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      }
    />
  );
} 