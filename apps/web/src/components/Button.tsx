import { motion } from 'framer-motion';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'petal' | 'ghost' | 'light';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-step--1 font-semibold tracking-wide transition-colors duration-300 ease-power2-out disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px]';

const variants: Record<Variant, string> = {
  primary: 'bg-botanic text-cream hover:bg-botanic-soft',
  petal: 'bg-petal text-ink hover:bg-petal-soft',
  ghost: 'border border-current text-current hover:bg-ink/5',
  light: 'bg-cream text-botanic hover:bg-petal-soft',
};

export const buttonClass = (variant: Variant = 'primary', extra = '') => `${base} ${variants[variant]} ${extra}`;

const tap = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.35 } } as const;

const MotionLink = motion.create(Link);

// DOM animation/drag handlers clash with Framer Motion's own signatures.
type SafeLinkProps = Omit<LinkProps, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd'>;

export function ButtonLink({ variant = 'primary', className = '', children, ...props }: SafeLinkProps & { variant?: Variant; children: ReactNode }) {
  return (
    <MotionLink {...tap} className={buttonClass(variant, className)} {...props}>
      {children}
    </MotionLink>
  );
}

type ButtonProps = Omit<ComponentPropsWithoutRef<typeof motion.button>, 'children'> & { variant?: Variant; children: ReactNode };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', className = '', children, ...props }, ref) {
  return (
    <motion.button ref={ref} {...tap} className={buttonClass(variant, typeof className === 'string' ? className : '')} {...props}>
      {children}
    </motion.button>
  );
});

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 10h13M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
