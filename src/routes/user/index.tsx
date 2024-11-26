import {
  Await,
  createFileRoute,
  defer,
  useLoaderData,
} from '@tanstack/react-router';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Suspense } from 'react';
import { getUserUserId } from '@/lib/generatedApi';

export const Route = createFileRoute('/user/')({
  component: User,
  loader: async () => {
    const userAttributes = await fetchUserAttributes();
    const user = getUserUserId(userAttributes.sub ?? '');

    const inviter = user.then((user) => {
      if (!user.inviter) {
        return undefined;
      }
      return getUserUserId(user.inviter);
    });

    return {
      userAttributes,
      user: defer(user),
      inviter: defer(inviter),
    };
  },
});

function User() {
  const { user, inviter } = useLoaderData({ from: '/user/' });

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Await promise={user}>
          {(user) => {
            return (
              <>
                <div>userId: {user.userId}</div>
                <div>email: {user.email}</div>
                <div>displayName: {user.displayName}</div>
                <div>inviter: {user.inviter}</div>
                {/* <div>sessionIds: {user.sessionIds}</div>
                <div>escalatedSessionIds: {user.escalatedSessionIds}</div> */}
              </>
            );
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Await promise={inviter}>
          {(user) =>
            user && (
              <>
                <div>userId: {user.userId}</div>
                <div>email: {user.email}</div>
                <div>displayName: {user.displayName}</div>
                <div>inviter: {user.inviter}</div>
              </>
            )
          }
        </Await>
      </Suspense>
    </>
  );
}
