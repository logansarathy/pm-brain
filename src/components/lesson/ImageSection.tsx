import React from 'react';
import { ImageItem } from '../../types';
import { LessonSection } from './LessonSection';

interface ImageSectionProps {
  images: ImageItem[];
}

export const ImageSection: React.FC<ImageSectionProps> = ({ images }) => {
  if (!images.length) return null;
  return (
    <LessonSection title="Images">
      {images.map((image) => (
        <div key={image.id} className="card p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-semibold text-sm">{image.title || 'Image'}</div>
          {image.url && <img src={image.url} alt={image.caption || image.title} className="mt-3 w-full rounded-xl" />}
          {image.caption && <div className="mt-2 text-sm text-[var(--text-dim)]">{image.caption}</div>}
        </div>
      ))}
    </LessonSection>
  );
};
