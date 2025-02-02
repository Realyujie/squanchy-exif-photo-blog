import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';
import { getVideoCached } from '@/video/cache';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AdminVideoEditPage({ params }: PageProps) {
  const video = await getVideoCached(params.id);

  if (!video) {
    notFound();
  }

  return (
    <AdminChildPage
      backLabel="视频"
      backPath={PATH_ADMIN_VIDEOS}
      breadcrumb="编辑视频"
    >
      <AdminVideoEditClient video={video} />
    </AdminChildPage>
  );
} 