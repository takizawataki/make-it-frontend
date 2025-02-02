/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginWithMagicLinkImport } from './routes/login-with-magic-link'
import { Route as IndexImport } from './routes/index'
import { Route as UserIndexImport } from './routes/user/index'
import { Route as SessionsIndexImport } from './routes/sessions/index'
import { Route as SessionIndexImport } from './routes/session/index'
import { Route as InviteIndexImport } from './routes/invite/index'
import { Route as FooIndexImport } from './routes/foo/index'
import { Route as SessionSessionIdIndexImport } from './routes/session/$sessionId/index'

// Create/Update Routes

const LoginWithMagicLinkRoute = LoginWithMagicLinkImport.update({
  path: '/login-with-magic-link',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UserIndexRoute = UserIndexImport.update({
  path: '/user/',
  getParentRoute: () => rootRoute,
} as any)

const SessionsIndexRoute = SessionsIndexImport.update({
  path: '/sessions/',
  getParentRoute: () => rootRoute,
} as any)

const SessionIndexRoute = SessionIndexImport.update({
  path: '/session/',
  getParentRoute: () => rootRoute,
} as any)

const InviteIndexRoute = InviteIndexImport.update({
  path: '/invite/',
  getParentRoute: () => rootRoute,
} as any)

const FooIndexRoute = FooIndexImport.update({
  path: '/foo/',
  getParentRoute: () => rootRoute,
} as any)

const SessionSessionIdIndexRoute = SessionSessionIdIndexImport.update({
  path: '/session/$sessionId/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/login-with-magic-link': {
      id: '/login-with-magic-link'
      path: '/login-with-magic-link'
      fullPath: '/login-with-magic-link'
      preLoaderRoute: typeof LoginWithMagicLinkImport
      parentRoute: typeof rootRoute
    }
    '/foo/': {
      id: '/foo/'
      path: '/foo'
      fullPath: '/foo'
      preLoaderRoute: typeof FooIndexImport
      parentRoute: typeof rootRoute
    }
    '/invite/': {
      id: '/invite/'
      path: '/invite'
      fullPath: '/invite'
      preLoaderRoute: typeof InviteIndexImport
      parentRoute: typeof rootRoute
    }
    '/session/': {
      id: '/session/'
      path: '/session'
      fullPath: '/session'
      preLoaderRoute: typeof SessionIndexImport
      parentRoute: typeof rootRoute
    }
    '/sessions/': {
      id: '/sessions/'
      path: '/sessions'
      fullPath: '/sessions'
      preLoaderRoute: typeof SessionsIndexImport
      parentRoute: typeof rootRoute
    }
    '/user/': {
      id: '/user/'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserIndexImport
      parentRoute: typeof rootRoute
    }
    '/session/$sessionId/': {
      id: '/session/$sessionId/'
      path: '/session/$sessionId'
      fullPath: '/session/$sessionId'
      preLoaderRoute: typeof SessionSessionIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  LoginWithMagicLinkRoute,
  FooIndexRoute,
  InviteIndexRoute,
  SessionIndexRoute,
  SessionsIndexRoute,
  UserIndexRoute,
  SessionSessionIdIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login-with-magic-link",
        "/foo/",
        "/invite/",
        "/session/",
        "/sessions/",
        "/user/",
        "/session/$sessionId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/login-with-magic-link": {
      "filePath": "login-with-magic-link.tsx"
    },
    "/foo/": {
      "filePath": "foo/index.tsx"
    },
    "/invite/": {
      "filePath": "invite/index.tsx"
    },
    "/session/": {
      "filePath": "session/index.tsx"
    },
    "/sessions/": {
      "filePath": "sessions/index.tsx"
    },
    "/user/": {
      "filePath": "user/index.tsx"
    },
    "/session/$sessionId/": {
      "filePath": "session/$sessionId/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
