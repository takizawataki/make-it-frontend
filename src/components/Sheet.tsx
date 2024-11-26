import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  Await,
  DeferredPromise,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { FetchUserAttributesOutput } from 'aws-amplify/auth';
import { Menu } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet as ShadcnSheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SessionResponse,
  postSendSummary,
  postSummarize,
} from '@/lib/generatedApi';
import { OpenDialog } from '@/routes/session';

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: DeferredPromise<SessionResponse>;
  setOpenDialog: React.Dispatch<React.SetStateAction<OpenDialog>>;
  userAttributes: FetchUserAttributesOutput;
};

function EscalationPopover({
  question,
  onEscalate,
}: {
  question: string;
  onEscalate: () => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        転送
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-bold">以下の会話を転送しますか？</p>
        <p>{question}</p>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setPopoverOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={onEscalate}>転送</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
interface QuestionRowProps {
  question: string;
  index: number;
  onEscalate: () => void;
  onClickTitle: () => void;
}

function QuestionRow({
  question,
  index,
  onEscalate,
  onClickTitle,
}: QuestionRowProps) {
  return (
    <div
      key={`${index}-question`}
      className="flex items-center justify-between truncate"
    >
      <li className="mr-2 w-full truncate" key={`${index}-question-title`}>
        <Button
          variant="primaryGhost"
          key={`${index}-question-title-button`}
          className="w-full justify-start px-2 text-left"
          onClick={onClickTitle}
        >
          <p className="truncate">{question}</p>
        </Button>
      </li>
      <EscalationPopover question={question} onEscalate={onEscalate} />
    </div>
  );
}

function QuestionsList({
  sessions,
  onEscalate,
}: {
  sessions: DeferredPromise<SessionResponse>;
  onEscalate: (sessionId: string) => void;
}) {
  const navigate = useNavigate();
  const state = useRouterState();
  const sessionPath = '/session';

  return (
    <ScrollArea style={{ height: 'calc(100dvh - 120px)' }} className="mt-8">
      {state.location.pathname === sessionPath ? (
        <Button
          variant="primaryOutline"
          className="mb-4 w-full"
          onClick={() => window.location.reload()}
        >
          新規会話を開始
        </Button>
      ) : (
        <Button
          variant="primaryOutline"
          className="mb-4 w-full"
          onClick={() => navigate({ to: sessionPath })}
        >
          新規会話を開始
        </Button>
      )}
      <div>
        <h1 className="my-4 pl-2 text-lg font-semibold text-foreground">
          過去の会話
        </h1>
        <ul className="text-md text-primary">
          <Suspense fallback={<LoadingRow />}>
            <Await promise={sessions}>
              {(data) => {
                const sessions = data.sessions;
                if (sessions.length === 0) {
                  return (
                    <p className="p-2 text-sm text-stone-800">
                      過去の会話はありません
                    </p>
                  );
                }
                return sessions.map((session, index) => (
                  <QuestionRow
                    question={session.sessionTitle}
                    index={index}
                    onEscalate={() => onEscalate(session.sessionId)}
                    onClickTitle={() =>
                      navigate({ to: `/session/${session.sessionId}` })
                    }
                    key={index}
                  />
                ));
              }}
            </Await>
          </Suspense>
        </ul>
        <h1 className="my-4 pl-2 text-lg font-semibold text-foreground">
          自分に転送された会話
        </h1>
        <ul className="text-md text-primary">
          <Suspense fallback={<LoadingRow />}>
            <Await promise={sessions}>
              {(data) => {
                const escalatedSessions = data.escalatedSessions;
                if (escalatedSessions.length === 0) {
                  return (
                    <p className="p-2 text-sm text-stone-800">
                      転送された会話はありません
                    </p>
                  );
                }
                return escalatedSessions.map((session, index) => (
                  <QuestionRow
                    question={session.sessionTitle}
                    index={index}
                    onEscalate={() => onEscalate(session.sessionId)}
                    onClickTitle={() =>
                      navigate({ to: `/session/${session.sessionId}` })
                    }
                    key={index}
                  />
                ));
              }}
            </Await>
          </Suspense>
        </ul>
      </div>
    </ScrollArea>
  );
}

function LoadingRow() {
  return (
    <div key="loading" className="flex items-center justify-between">
      <li className="mr-2 w-full" key="">
        <Skeleton className="h-6 w-full" />
      </li>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

// https://zenn.dev/web_life_ch/articles/081708764e6eef
export function Sheet({
  open,
  onOpenChange,
  sessions,
  setOpenDialog,
  userAttributes,
}: SheetProps) {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator();

  const onEscalate = async (sessionId: string) => {
    try {
      setOpenDialog((prev) => ({ ...prev, escalating: true }));
      await postSummarize({ sessionId });
      await postSendSummary({
        sessionId: sessionId,
        // TODO: undefined が入った場合は Snackbar などでエラー表示
        fromUserId: userAttributes.sub ?? '',
        fromUserEmail: userAttributes.email ?? '',
      });
      setOpenDialog((prev) => ({ ...prev, escalating: false }));
      setOpenDialog({ escalating: false, completeEscalation: true });
    } catch (error) {
      // TODO エラーハンドリングをリッチにする
      alert(error);
    } finally {
      setOpenDialog((prev) => ({ ...prev, escalating: false }));
    }
  };

  return (
    <ShadcnSheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="pl-4"
      >
        {/* ブラウザからの警告回避のため設置 */}
        <SheetTitle className="sr-only" />
        <SheetDescription className="sr-only" />
        <QuestionsList sessions={sessions} onEscalate={onEscalate} />
        <div className="mt-3 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/sessions' })}
          >
            会話履歴の管理
          </Button>
          <Button variant="primaryOutline" onClick={() => signOut()}>
            サインアウト
          </Button>
        </div>
      </SheetContent>
    </ShadcnSheet>
  );
}
