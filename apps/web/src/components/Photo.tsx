import { useState, type ImgHTMLAttributes } from 'react';
import type { Photo as PhotoData } from '@/lib/photos';

const TYPE: Record<string, string> = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

type Props = {
  photo: PhotoData;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  /** Pass true when the image is decorative (an adjacent caption carries the meaning). */
  decorative?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>;

/** <picture> with AVIF → WebP → JPG, intrinsic size (no CLS) and a tone placeholder. */
export function Photo({ photo, className = '', imgClassName = '', eager = false, decorative = false, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  const { sources, img } = photo.picture;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: photo.tone }}>
      <picture>
        {Object.entries(sources).map(([fmt, srcset]) => (
          <source key={fmt} type={TYPE[fmt] ?? `image/${fmt}`} srcSet={srcset} />
        ))}
        <img
          src={img.src}
          width={img.w}
          height={img.h}
          alt={decorative ? '' : photo.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ease-power2-out ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          {...rest}
        />
      </picture>
    </div>
  );
}
