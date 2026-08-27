import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BookOpenText,
  Braces,
  CalendarClock,
  ChevronRight,
  Command,
  GitBranch,
  LayoutDashboard,
  Lightbulb,
  Menu,
  PanelLeft,
  Plus,
  ScanSearch,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  Workflow,
  X,
} from 'lucide-react';
import { useProjectWorkspace } from '@/components/project-workspace';
import type { ProjectInput } from '@workspace/api-client-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const primaryNav: NavItem[] = [
  { href: '/', label: 'Workspace', icon: LayoutDashboard },
  { href: '/characters', label: 'Characters', icon: UsersRound },
  { href: '/story', label: 'Story structure', icon: BookOpenText },
];

const craftNav: NavItem[] = [
  { href: '/world', label: 'Worldbuilding', icon: Lightbulb },
  { href: '/timeline', label: 'Timeline', icon: CalendarClock },
  { href: '/flowchart', label: 'Flowchart', icon: GitBranch },
  { href: '/variables', label: 'State variables', icon: Braces },
];

const reviewNav: NavItem[] = [
  { href: '/qa', label: 'Narrative QA', icon: ScanSearch },
  { href: '/bible', label: 'Canon & ideas', icon: BookMarked },
];

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [location] = useLocation();
  const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
        active
          ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] shadow-[inset_3px_0_0_hsl(var(--sidebar-primary))]'
          : 'text-[hsl(var(--sidebar-foreground)/.62)] hover:bg-[hsl(var(--sidebar-accent)/.7)] hover:text-[hsl(var(--sidebar-foreground))]'
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
      <span>{item.label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--sidebar-primary))]" />}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-8 pt-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_7px_18px_hsl(var(--sidebar-primary)/.24)]">
          <Sparkles size={18} strokeWidth={2.2} />
          <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[hsl(var(--sidebar))] bg-[hsl(var(--accent))]" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold tracking-tight text-[hsl(var(--sidebar-foreground))]">Narrative Forge</div>
          <div className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.43)]">Studio / 01</div>
        </div>
      </div>
      <div className="space-y-7 px-3">
        <div>
          <div className="mb-2 px-3 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.34)]">Shape the story</div>
          <nav className="space-y-1">{primaryNav.map((item) => <SidebarLink key={item.href} item={item} onNavigate={onNavigate} />)}</nav>
        </div>
        <div>
          <div className="mb-2 px-3 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.34)]">Build the world</div>
          <nav className="space-y-1">{craftNav.map((item) => <SidebarLink key={item.href} item={item} onNavigate={onNavigate} />)}</nav>
        </div>
        <div>
          <div className="mb-2 px-3 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.34)]">Check the weave</div>
          <nav className="space-y-1">{reviewNav.map((item) => <SidebarLink key={item.href} item={item} onNavigate={onNavigate} />)}</nav>
        </div>
      </div>
      <div className="mt-auto space-y-3 px-3 pb-4">
        <Link href="/settings" onClick={onNavigate} data-testid="link-nav-settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[hsl(var(--sidebar-foreground)/.62)] transition-colors hover:bg-[hsl(var(--sidebar-accent)/.7)] hover:text-[hsl(var(--sidebar-foreground))]">
          <Settings2 size={17} strokeWidth={1.7} />
          <span>Project settings</span>
        </Link>
        <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.54)] p-3">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[hsl(var(--sidebar-foreground)/.48)]"><Activity size={12} /> Forge session</div>
          <div className="flex items-center justify-between text-[12px] text-[hsl(var(--sidebar-foreground)/.78)]"><span>Coherence scan</span><span className="font-mono-ui text-[10px] text-[hsl(var(--accent))]">ready</span></div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--sidebar-foreground)/.1)]"><div className="h-full w-[82%] rounded-full bg-[hsl(var(--accent))]" /></div>
        </div>
        <div className="flex items-center gap-2 px-3 pt-1 text-[10px] text-[hsl(var(--sidebar-foreground)/.36)]"><Command size={11} /> <span>Press ⌘ K to jump</span></div>
      </div>
    </div>
  );
}

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { projects, selectedProject, selectedProjectId, selectProject } = useProjectWorkspace();
  const pageName = location === '/' ? 'Workspace' : location.slice(1).split('/')[0].replaceAll('-', ' ');

  return (
    <div className="paper-noise min-h-[100dvh] bg-[hsl(var(--background))]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[246px] border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] lg:block">
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>
      {mobileOpen && <button aria-label="Close navigation" data-testid="button-close-mobile-nav" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-[hsl(var(--foreground)/.34)] lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} data-testid="button-dismiss-mobile-nav" className="absolute right-4 top-5 rounded-md p-1.5 text-[hsl(var(--sidebar-foreground)/.6)] hover:bg-[hsl(var(--sidebar-accent))]"><X size={18} /></button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>
      <div className="lg:pl-[246px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] px-4 backdrop-blur-md sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} data-testid="button-open-mobile-nav" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] lg:hidden"><Menu size={20} /></button>
            <div className="flex min-w-0 items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]"><PanelLeft size={14} className="hidden shrink-0 sm:block" /><span className="capitalize">{pageName}</span><ChevronRight size={13} className="shrink-0" /><select aria-label="Select project" value={selectedProjectId ?? ''} onChange={(event) => selectProject(event.target.value)} data-testid="select-project" className="max-w-[170px] truncate bg-transparent font-medium text-[hsl(var(--foreground))] outline-none"><option value="" disabled>Loading project…</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}{project.isExample ? ' · Example' : ''}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setLocation('/story')} data-testid="button-command-search" className="hidden items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-1.5 text-[11px] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary)/.5)] hover:text-[hsl(var(--foreground))] sm:flex"><Command size={13} /><span>Jump to story...</span><kbd className="ml-3 rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono-ui text-[9px]">⌘K</kbd></button>
            <button onClick={() => setNewProjectOpen(true)} data-testid="button-header-new-project" className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3 py-2 text-[11px] font-bold text-[hsl(var(--primary-foreground))] shadow-[0_6px_15px_hsl(var(--primary)/.18)] transition-transform hover:-translate-y-0.5"><Plus size={14} /><span className="hidden sm:inline">New project</span></button>
            <button onClick={() => setLocation('/settings')} data-testid="button-header-settings" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"><SlidersHorizontal size={17} /></button>
            <div data-testid="avatar-project-owner" className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--accent))] font-display text-xs font-bold text-[hsl(var(--foreground))] shadow-[0_0_0_1px_hsl(var(--border))]">AR</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-7 sm:px-7 lg:px-10">{children}</main>
      </div>
      {newProjectOpen && <NewProjectModal onClose={() => setNewProjectOpen(false)} />}
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject, isCreating, createError } = useProjectWorkspace();
  const [form, setForm] = useState<ProjectInput>({ name: '', genre: 'Visual novel', description: '' });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createProject(form, { onSuccess: onClose });
  };

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[hsl(var(--foreground)/.42)] p-0 backdrop-blur-sm sm:items-center sm:p-5">
    <div role="dialog" aria-modal="true" aria-labelledby="new-project-title" className="w-full max-w-lg rounded-t-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl sm:rounded-2xl">
      <div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5 sm:px-7">
        <div><div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Workspace / new project</div><h2 id="new-project-title" className="mt-1 font-display text-2xl font-semibold tracking-[-.03em]">Start a new story.</h2><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">The example stays safe while you shape a new narrative.</p></div>
        <button onClick={onClose} data-testid="button-close-new-project" className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><X size={18} /></button>
      </div>
      <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-7">
        <label className="block space-y-2 text-xs font-semibold">Project name<input required autoFocus value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} data-testid="input-new-project-name" placeholder="e.g. The Last Lighthouse" className="workspace-input" /></label>
        <label className="block space-y-2 text-xs font-semibold">Genre<input required value={form.genre} onChange={(event) => setForm((current) => ({ ...current, genre: event.target.value }))} data-testid="input-new-project-genre" placeholder="e.g. Mystery · Romance" className="workspace-input" /></label>
        <label className="block space-y-2 text-xs font-semibold">Premise or working description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} data-testid="input-new-project-description" placeholder="What is this story about?" rows={3} className="workspace-input resize-none" /></label>
        {createError && <div className="rounded-lg bg-[hsl(var(--destructive)/.08)] p-3 text-xs text-[hsl(var(--destructive))]">Couldn’t create the project. Try again.</div>}
        <div className="flex justify-end gap-2 border-t border-[hsl(var(--border))] pt-5"><button type="button" onClick={onClose} data-testid="button-cancel-new-project" className="rounded-lg px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]">Cancel</button><button type="submit" disabled={isCreating} data-testid="button-create-project" className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] disabled:cursor-wait disabled:opacity-60">{isCreating ? 'Creating…' : 'Create project'}<ArrowUpRight size={14} /></button></div>
      </form>
    </div>
  </div>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <div className="mb-2 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{eyebrow}</div>}
      <h1 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-[1.02] tracking-[-.04em] text-[hsl(var(--foreground))]">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p>}
    </div>
    {action}
  </div>;
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes('complete') || normalized.includes('ready') || normalized.includes('active') || normalized.includes('published') ? 'teal' : normalized.includes('draft') || normalized.includes('progress') || normalized.includes('review') ? 'gold' : 'muted';
  return <span data-testid={`status-${status.toLowerCase().replaceAll(' ', '-')}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.08em] ${tone === 'teal' ? 'bg-[hsl(var(--chart-2)/.13)] text-[hsl(var(--chart-2))]' : tone === 'gold' ? 'bg-[hsl(var(--accent)/.2)] text-[hsl(35 52% 33%)]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

export function LoadingBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[hsl(var(--muted))] ${className}`} />;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div className="rounded-2xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.06)] p-8 text-center">
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]"><Activity size={18} /></div>
    <h2 className="font-display text-lg font-semibold">The forge is quiet</h2><p className="mx-auto mt-1 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">We couldn’t load this part of the project. Try the connection again.</p>
    {onRetry && <button onClick={onRetry} data-testid="button-retry" className="mt-4 rounded-lg bg-[hsl(var(--foreground))] px-4 py-2 text-xs font-semibold text-[hsl(var(--background))]">Try again</button>}
  </div>;
}

export function EmptyState({ icon: Icon = Lightbulb, title, detail, action }: { icon?: typeof Lightbulb; title: string; detail: string; action?: ReactNode }) {
  return <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.45)] px-6 py-10 text-center">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--foreground))]"><Icon size={19} /></div>
    <h2 className="font-display text-lg font-semibold">{title}</h2><p className="mt-1 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{detail}</p>{action && <div className="mt-5">{action}</div>}
  </div>;
}