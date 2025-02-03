'use client';

import { useState } from 'react';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import { Video } from './types';
import { getVideos } from './utils';

export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videos = getVideos();

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          {selectedVideo ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-dim hover:text-gray-900 dark:hover:text-gray-100"
              >
                ← 返回视频列表
              </button>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                <p className="text-dim">{selectedVideo.description}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={clsx(
                    'cursor-pointer',
                    'transition-transform duration-200',
                    'hover:scale-105'
                  )}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-lg font-medium truncate">
                    {video.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
} 