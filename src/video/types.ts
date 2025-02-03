export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
}

export interface VideoData {
  videos: Video[];
} 
