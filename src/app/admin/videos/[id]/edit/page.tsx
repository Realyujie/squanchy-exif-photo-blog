import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_VIDEOS } from '@/site/paths';
import { Video } from '@/types/video';
import AdminVideoEditClient from '@/admin/AdminVideoEditClient';

// 这里先用模拟数据，之后可以从数据库获取
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: '示例视频 1',
    description: '这是一个示例视频描述',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
];

export default function AdminVideoEditPage({ params }: { params: { id: string } }) {
  const video = MOCK_VIDEOS.find(v => v.id === params.id);

  if (!video) {
    return null; // 或者显示一个 404 页面
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