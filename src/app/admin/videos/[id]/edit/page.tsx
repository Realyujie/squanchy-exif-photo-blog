import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import { getVideoCached } from '@/video/cache';
import { notFound } from 'next/navigation';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';

export default async function AdminVideoEditPage({ 
  params 
}: { 
  params: { id: string } 
}) {
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