import { lazy } from 'react';

/**
 * NOTE: React.lazy は関数コンポーネントを返す必要があるため arrow function でラップする
 */
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export default TanStackRouterDevtools;
