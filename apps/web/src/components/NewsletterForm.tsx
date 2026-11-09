import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { NewsletterRequestSchema, type NewsletterRequest } from '@flower/shared';
import { Button } from './Button';
import { useNewsletterSignup } from '@/hooks/queries';
import { ApiRequestError } from '@/lib/api';

export function NewsletterForm({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const id = useId();
  const mutation = useNewsletterSignup();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterRequest>({ resolver: zodResolver(NewsletterRequestSchema), defaultValues: { email: '', firstName: '' } });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      reset();
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.issues) {
        for (const [field, msgs] of Object.entries(err.body.issues)) {
          if (field === 'email' || field === 'firstName' || field === 'consent') setError(field, { message: msgs[0] });
        }
      } else {
        setError('root', { message: 'Something went wrong. Please try again in a moment.' });
      }
    }
  });

  const light = tone === 'light';
  const field = `w-full rounded-full border px-5 py-3 min-h-[48px] bg-transparent placeholder:opacity-60 focus:outline-none focus-visible:ring-2 ${
    light ? 'border-cream/30 text-cream focus-visible:ring-petal' : 'border-ink/20 text-ink focus-visible:ring-petal-deep'
  }`;
  const errColor = light ? 'text-petal' : 'text-petal-deep';

  return (
    <div>
      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <motion.p
            key="ok"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-step-2"
          >
            {mutation.data.message}
          </motion.p>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -8 }} className="grid gap-4" aria-describedby={errors.root ? `${id}-root` : undefined}>
            <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
              <div>
                <label htmlFor={`${id}-name`} className="mb-2 block text-step--1 font-medium">
                  First name <span className="opacity-70">(optional)</span>
                </label>
                <input id={`${id}-name`} autoComplete="given-name" className={field} {...register('firstName')} />
              </div>
              <div>
                <label htmlFor={`${id}-email`} className="mb-2 block text-step--1 font-medium">
                  Email address
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${id}-email-err` : undefined}
                  className={field}
                  {...register('email')}
                />
                {errors.email && (
                  <p id={`${id}-email-err`} className={`mt-2 text-step--1 ${errColor}`}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="flex items-start gap-3 text-step--1">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--c-petal-deep))]"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
                  {...register('consent')}
                />
                <span className={light ? 'text-cream/85' : 'text-ink-soft'}>Yes, send me show news, early-bird offers and the planting calendar. Unsubscribe any time.</span>
              </label>
              {errors.consent && (
                <p id={`${id}-consent-err`} className={`mt-2 text-step--1 ${errColor}`}>
                  {errors.consent.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p id={`${id}-root`} role="alert" className={`text-step--1 ${errColor}`}>
                {errors.root.message}
              </p>
            )}
            <Button type="submit" variant={light ? 'petal' : 'primary'} disabled={isSubmitting} className="justify-self-start">
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
