import { SHOW } from '@flower/shared';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg aria-hidden="true" viewBox="-50 -50 100 100" className="h-7 w-7">
        <g fill="currentColor" opacity="0.9">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0 0C14-8 13-32 0-38C-13-32-14-8 0 0Z" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="7" fill="rgb(var(--c-gold))" />
      </svg>
      <span className="font-display text-step-1 font-medium tracking-tight">{SHOW.name}</span>
    </span>
  );
}
