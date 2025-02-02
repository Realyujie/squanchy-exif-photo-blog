'use client';

import { Video } from '@/types/video';
import { useState } from 'react';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import AdminTable from './AdminTable';
import LoaderButton from '@/components/primitives/LoaderButton';
import { MdAdd } from 'react-icons/md';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Note from '@/components/Note';
import Image from 'next/image';
import PhotoDate from '@/photo/PhotoDate';
import { addVideoAction, deleteVideoAction } from '@/video/actions';
import { useRouter } from 'next/navigation';
import { Timezone } from '@/utility/timezone';

interface Props {
  videos: Video[];
  videosCount: number;
  infiniteScrollInitial: number;
  infiniteScrollMultiple: number;
  timezone?: Timezone;
}

export default function AdminVideosClient({
  videos,
  videosCount,
  infiniteScrollInitial,
  infiniteScrollMultiple,
  timezone,
}: Props) {
  const router = useRouter();
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVideo = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      await addVideoAction(formData);
      setIsAddingVideo(false);
      router.refresh();
    } catch (error) {
      console.error('Add Video Failed:', error);
      alert(error instanceof Error ? error.message : 'Add Video Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Are you sure to delete this video？')) {
      try {
        setIsSubmitting(true);
        await deleteVideoAction(videoId);
        router.refresh();
      } catch (error) {
        console.error('Delete Video Failed:', error);
        alert(error instanceof Error ? error.message : 'Delete Video Failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <LoaderButton
              onClick={() => setIsAddingVideo(true)}
              icon={<MdAdd size={20} />}
              primary
              disabled={isSubmitting}
            >
              Add A Video
            </LoaderButton>
          </div>

          {isAddingVideo && (
            <Note color="gray">
              <form action={handleAddVideo} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Video Title
                    <input
                      type="text"
                      name="title"
                      required
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
                      name="description"
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
                      name="youtubeUrl"
                      required
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
                    onClick={() => setIsAddingVideo(false)}
                    disabled={isSubmitting}
                  >
                    取消
                  </LoaderButton>
                  <LoaderButton
                    type="submit"
                    disabled={isSubmitting}
                    primary
                  >
                    保存
                  </LoaderButton>
                </div>
              </form>
            </Note>
          )}

          <AdminTable>
            {videos.map((video) => (
              <div
                key={video.id}
                className={clsx(
                  'col-span-3 grid grid-cols-[auto_1fr_auto] gap-4',
                  'items-center py-2',
                  'border-b border-gray-200 dark:border-gray-800'
                )}
              >
                <div className="w-24 h-16 relative">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-[50%] flex items-center">
                    <Link
                      href={`/videos/${video.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-medium">{video.title}</h3>
                    </Link>
                  </div>
                  <div className="lg:w-[50%] text-dim uppercase">
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
                <div className="flex gap-2">
                  <Link
                    href={`/admin/videos/${video.id}/edit`}
                    className={clsx(
                      'p-2 rounded-md',
                      'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <FaRegEdit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    disabled={isSubmitting}
                    className={clsx(
                      'p-2 rounded-md text-red-500',
                      'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </AdminTable>
        </div>
      }
    />
  );
} 
