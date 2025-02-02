import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import { getVideoCached } from '@/video/cache';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { VideoPageParams } from '@/types/next';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(
  props: VideoPageParams,
): Promise<Metadata> {
  const video = await getVideoCached(props.params.id);
  
  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  return {
    title: `Edit Video - ${video.title}`,
  };
}

export default async function AdminVideoEditPage(
  props: VideoPageParams,
) {
  const video = await getVideoCached(props.params.id);

  if (!video) {
    notFound();
  }

  return (
    <AdminChildPage
      backLabel="Videos"
      backPath={PATH_ADMIN_VIDEOS}
      breadcrumb="Edit Video"
    >
      <AdminVideoEditClient video={video} />
    </AdminChildPage>
  );
} 