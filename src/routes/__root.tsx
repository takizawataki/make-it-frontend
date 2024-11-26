import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ReactNode, Suspense } from 'react';
import 'amazon-cognito-passwordless-auth/passwordless.css';
import { Toaster } from '@/components/ui/sonner';
// import TanStackRouterDevtools from '@/routes/-TanStackRouterDevtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <RootLayout>
        <Outlet />
        <Toaster />
      </RootLayout>
      <Suspense>
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
      </Suspense>
    </>
  ),
});

function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
