import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WorkspaceShell } from '@/components/workspace-shell';
import { ProjectWorkspaceProvider } from '@/components/project-workspace';
import {
  BiblePage,
  CharactersPage,
  DashboardPage,
  FlowchartPage,
  QAPage,
  SettingsPage,
  StoryPage,
  TimelinePage,
  VariablesPage,
  WorldPage,
} from '@/pages/workspace-pages';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return <WorkspaceShell>
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/characters" component={CharactersPage} />
        <Route path="/story" component={StoryPage} />
        <Route path="/world" component={WorldPage} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/flowchart" component={FlowchartPage} />
        <Route path="/variables" component={VariablesPage} />
        <Route path="/qa" component={QAPage} />
        <Route path="/bible" component={BiblePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  </WorkspaceShell>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectWorkspaceProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </ProjectWorkspaceProvider>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;