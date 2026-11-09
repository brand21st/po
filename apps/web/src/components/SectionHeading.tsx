import type { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, intro, id, tone = 'dark', className = '' }: { eyebrow: string; title: ReactNode; intro?: ReactNode; id?: string; tone?: 'dark' | 'light'; className?: string }) {
  const eyebrowColor = tone === 'dark' ? 'text-petal-deep' : 'text-petal';
  const introColor = tone === 'dark' ? 'text-ink-soft' : 'text-cream/80';
  return (
    <header className={`max-w-3xl ${className}`} data-reveal-group>
      <p className={`eyebrow ${eyebrowColor}`} data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 text-step-4 text-balance" data-reveal>
        {title}
      </h2>
      {intro ? (
        <p className={`mt-6 max-w-2xl text-step-1 text-pretty ${introColor}`} data-reveal>
          {intro}
        </p>
      ) : null}
    </header>
  );
}
