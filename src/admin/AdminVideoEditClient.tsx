'use client';

import { Video } from '@/types/video';
import { useState } from 'react';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import LoaderButton from '@/components/primitives/LoaderButton';
import Note from '@/components/Note';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import { updateVideoAction } from '@/video/actions';

export default function AdminVideoEditClient({ video }: { video: Video }) {
  const router = useRouter();
  const [videoTitle, setVideoTitle] = useState(video.title);
  const [videoDescription, setVideoDescription] = useState(video.description || '');
  const [videoUrl, setVideoUrl] = useState(`https://www.youtube.com/watch?v=${video.youtubeId}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('youtubeUrl', videoUrl);
      
      await updateVideoAction(video.id, formData);
      router.push(PATH_ADMIN_VIDEOS);
      router.refresh();
    } catch (error) {
      console.error('更新视频失败:', error);
      alert(error instanceof Error ? error.message : '更新视频失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <Note color="gray">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  视频标题
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
                    placeholder="输入视频标题"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  视频描述
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
                    placeholder="输入视频描述"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  YouTube 视频链接
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
                    placeholder="输入 YouTube 视频链接"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <LoaderButton
                  onClick={() => router.push(PATH_ADMIN_VIDEOS)}
                  disabled={isSubmitting}
                >
                  取消
                </LoaderButton>
                <LoaderButton
                  onClick={handleSave}
                  disabled={isSubmitting || !videoTitle || !videoUrl}
                  isLoading={isSubmitting}
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