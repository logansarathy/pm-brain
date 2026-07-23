import React from 'react';
import { VideoItem } from '../../types';
import { LessonSection } from './LessonSection';

interface VideoSectionProps {
  videos: VideoItem[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  if (!videos.length) return null;
  return (
    <LessonSection title="Videos">
      {videos.map((video) => (
        <div key={video.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{video.title}</div>
          <div className="text-xs text-[var(--text-faint)]">{video.duration || 'Duration not set'}</div>
          {video.description && <div className="text-sm text-[var(--text-dim)] mt-2">{video.description}</div>}
          <a href={video.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] text-xs font-semibold">
            Open video ↗
          </a>
        </div>
      ))}
    </LessonSection>
  );
};
