/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** vite-imagetools `&as=picture` output. */
declare module '*as=picture' {
  const picture: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default picture;
}

/** vite-imagetools single-URL output (e.g. a tiny blurred backdrop). */
declare module '*&format=webp' {
  const src: string;
  export default src;
}
