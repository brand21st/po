import { useState, type ImgHTMLAttributes } from 'react';
import type { Image } from '@flower/shared';
import { assetUrl } from '@/lib/api';

type Props = { image: Image; className?: string; imgClassName?: string; eager?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>;

/** Lazy image with a dominant-colour placeholder and a soft fade-in. */
export function ArtImage({ image, className = '', imgClassName = '', eager = false, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: image.dominant }}>
      <img
        src={assetUrl(image.src)}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ease-power2-out ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}
