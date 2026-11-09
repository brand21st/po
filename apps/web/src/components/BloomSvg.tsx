import { memo, useId } from 'react';
import { petalPath } from '@flower/shared';

/**
 * Layered SVG flower for the hero. Rendered fully open (the reduced-motion
 * and no-JS state); the Hero timeline closes it into a bud and scrubs it open.
 *
 * Coordinates: viewBox is centred on 0,0 so `svgOrigin: "0 0"` is the flower centre.
 */
export const BLOOM_LAYERS = [
  { n: 11, L: 470, W: 140, inner: '#F6D3DB', outer: '#D97A92', shape: 'round' as const },
  { n: 10, L: 390, W: 130, inner: '#FBE6EA', outer: '#E79AAC', shape: 'round' as const },
  { n: 9, L: 300, W: 110, inner: '#FFF3F0', outer: '#EFB4C1', shape: 'heart' as const },
  { n: 8, L: 210, W: 84, inner: '#FFFFFF', outer: '#F6CFD8', shape: 'heart' as const },
];

export const BloomSvg = memo(function BloomSvg({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="-520 -520 1040 1040" className={className} aria-hidden="true" focusable="false">
      <defs>
        {BLOOM_LAYERS.map((l, i) => (
          <radialGradient key={i} id={`${uid}-g${i}`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={l.L}>
            <stop offset="0" stopColor={l.inner} />
            <stop offset="0.7" stopColor={l.outer} />
            <stop offset="1" stopColor={l.outer} stopOpacity="0.85" />
          </radialGradient>
        ))}
        <radialGradient id={`${uid}-c`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#F4DE9C" />
          <stop offset="1" stopColor="#B88A3A" />
        </radialGradient>
      </defs>

      <g className="bloom-rotor">
        {BLOOM_LAYERS.map((l, li) => {
          const d = petalPath(l.shape, l.L, l.W);
          const offset = (li % 2) * (180 / l.n);
          return (
            <g key={li} className="bloom-layer" data-layer={li}>
              {Array.from({ length: l.n }, (_, i) => {
                const a = (360 / l.n) * i + offset;
                return (
                  <path
                    key={i}
                    className="bloom-petal"
                    data-angle={a}
                    d={d}
                    transform={`rotate(${a})`}
                    fill={`url(#${uid}-g${li})`}
                    stroke="#FFFFFF"
                    strokeOpacity="0.25"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })}
        <g className="bloom-center">
          <circle r="62" fill={`url(#${uid}-c)`} />
          {Array.from({ length: 18 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 18;
            return <circle key={i} cx={Math.cos(a) * 40} cy={Math.sin(a) * 40} r="5" fill="#FFF4D2" opacity="0.85" />;
          })}
        </g>
      </g>
    </svg>
  );
});
