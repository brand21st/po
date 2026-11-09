import { ButtonLink } from '@/components/Button';

export default function NotFoundPage() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="eyebrow text-petal-deep">404</p>
      <h1 className="mt-4 text-step-5 text-balance">This path leads off the garden map.</h1>
      <ButtonLink to="/" className="mt-8 self-start">
        Back to the show
      </ButtonLink>
    </div>
  );
}
