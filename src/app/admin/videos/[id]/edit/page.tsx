import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import { getVideoCached } from '@/video/cache';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';
import { notFound } from 'next/navigation';
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
    title: `Edit Video - ${video.title}`,
  };
}

export default async function AdminVideoEditPage({
  params,
  searchParams,
}: Props) {
  const video = await getVideoCached(params.id);

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