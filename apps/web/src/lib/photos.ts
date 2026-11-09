/**
 * Golden-hour reference photography, optimized at build time by vite-imagetools.
 * Sources live in src/assets/photos. They are small (max 506px wide), so we never
 * upscale them in the build. Layouts show them at or near native size, and the
 * full-bleed backdrop uses a tiny pre-blurred copy where low resolution can't show.
 * See docs/golden-hour-meta-prompt.md for the art direction and regeneration prompts.
 */
import cosmosField from '@/assets/photos/cosmos-field.png?format=avif;webp;jpg&as=picture';
import dewDaisy from '@/assets/photos/dew-daisy.png?format=avif;webp;jpg&as=picture';
import peachDahlias from '@/assets/photos/peach-dahlias.webp?format=avif;webp;jpg&as=picture';
import wildflowerMeadow from '@/assets/photos/wildflower-meadow.png?format=avif;webp;jpg&as=picture';
import meadowBlur from '@/assets/photos/wildflower-meadow.png?w=96&blur=6&quality=60&format=webp';
import dahliasBlur from '@/assets/photos/peach-dahlias.webp?w=96&blur=6&quality=60&format=webp';

export type PictureData = typeof dewDaisy;

export type Photo = {
  id: string;
  picture: PictureData;
  alt: string;
  /** Mean colour, used as the loading placeholder */
  tone: string;
};

export const PHOTOS = {
  dewDaisy: {
    id: 'dew-daisy',
    picture: dewDaisy,
    alt: 'A pink daisy beaded with dew, backlit by low morning sun',
    tone: '#C37C7C',
  },
  peachDahlias: {
    id: 'peach-dahlias',
    picture: peachDahlias,
    alt: 'A field of peach dahlias glowing in hazy golden light',
    tone: '#CC9A7F',
  },
  wildflowerMeadow: {
    id: 'wildflower-meadow',
    picture: wildflowerMeadow,
    alt: 'A wildflower meadow of cosmos and lavender at sunrise',
    tone: '#B1845E',
  },
  cosmosField: {
    id: 'cosmos-field',
    picture: cosmosField,
    alt: 'Pink and pale yellow cosmos flowers in soft sunlight',
    tone: '#CC9776',
  },
} satisfies Record<string, Photo>;

/** Tiny pre-blurred backdrops: scaled up full-bleed, the blur hides the low source resolution. */
export const BACKDROPS = { meadow: meadowBlur, dahlias: dahliasBlur };
