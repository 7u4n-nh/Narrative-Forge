import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return <div className="flex min-h-[70dvh] items-center justify-center">
    <div className="max-w-md px-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.22)] text-[hsl(var(--foreground))]"><Compass size={24} /></div>
      <div className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Loose page / 404</div>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em]">This thread ends here.</h1>
      <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">That route is not part of this story yet. Return to the workspace and pick up another thread.</p>
      <Link href="/" data-testid="link-return-workspace" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))]"><ArrowLeft size={14} /> Return to workspace</Link>
    </div>
  </div>;
}