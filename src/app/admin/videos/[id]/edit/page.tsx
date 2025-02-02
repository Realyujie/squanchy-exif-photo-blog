import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';
import { getVideoCached } from '@/video/cache';
import { notFound } from 'next/navigation';

type tParams = Promise<{ id: string }>;

interface PageProps {
  params: tParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AdminVideoEditPage({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoCached(id);

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