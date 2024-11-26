import {
  Await,
  createFileRoute,
  defer,
  useLoaderData,
} from '@tanstack/react-router';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { Lightbulb, Mail } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { toast } from 'sonner';
import { ChatBubbles, Messages } from '@/components/ChatBubbles';
import { Dialog } from '@/components/Dialog';
import { Inputs, MessageForm } from '@/components/MessageForm';
import { Sheet } from '@/components/Sheet';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialog as ShadcnAlertDialog,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  GenerateAiReplyRequest,
  UserUserResponse,
  getSession,
  getSessionSessionId,
  getUserUserId,
  postGenerateSessionTitle,
  postSendSummary,
  postSummarize,
} from '@/lib/generatedApi';

export const Route = createFileRoute('/session/$sessionId/')({
  component: PastSession,
  loader: async ({ params }) => {
    const userAttributes = await fetchUserAttributes();
    const user = await getUserUserId(userAttributes.sub ?? '');
    let inviter: Promise<UserUserResponse | undefined> =
      Promise.resolve(undefined);
    if (user.inviter) {
      inviter = getUserUserId(user.inviter);
    }
    const sessions = getSession({ userId: userAttributes.sub ?? '' });
    const session = getSessionSessionId(params.sessionId);
    return {
      userAttributes,
      inviter: defer(inviter),
      sessions: defer(sessions),
      session: defer(session),
      sessionId: params.sessionId,
    };
  },
});

export type OpenDialog = {
  escalating: boolean;
  completeEscalation: boolean;
};

// 離脱時にセッションタイトルを生成するための変数
// リアクティブな変数だと、useEffect の依存配列に入れなければならないため、グローバル変数で宣言
let sessionIdForTitle: string;
let sessionHistoryForTitle: Messages[];

function PastSession() {
  const { userAttributes, inviter, sessions, session, sessionId } =
    useLoaderData({
      from: '/session/$sessionId/',
    });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<OpenDialog>({
    escalating: false,
    completeEscalation: false,
  });
  const [messages, setMessages] = useState<Messages[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const isEscalateTooltipOpen = messages.length >= 6;

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const GENERATE_RESPONSE_URL = import.meta.env.VITE_GENERATE_RESPONSE_URL;

  const form = useForm<Inputs>({
    defaultValues: { message: '' },
  });

  const onSubmit: SubmitHandler<Inputs> = (input) => {
    resetTranscript();
    form.reset({ message: '' });
    sendMessage(input.message);
  };

  const onEscalateWithMail = async () => {
    try {
      setOpenDialog((prev) => ({ ...prev, escalating: true }));
      await postSummarize({ sessionId });
      await postSendSummary({
        sessionId,
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

  const prefix =
    'make it ! から転送されました。\nhttps://production.angel-make-it.com/\n\n';

  const buildShareUrl = (summary: string) => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(prefix + summary)}`;
    return url;
  };

  const onEscalateWithLine = async () => {
    try {
      setOpenDialog((prev) => ({ ...prev, escalating: true }));
      const res = await postSummarize({ sessionId });
      window.location.href = buildShareUrl(res.summarizedText);
    } catch (error) {
      // TODO エラーハンドリングをリッチにする
      alert(error);
    } finally {
      setOpenDialog((prev) => ({ ...prev, escalating: false }));
    }
  };

  const sendMessage = async (message: string) => {
    try {
      setIsAiLoading(true);
      setMessages((prev) => [...prev, { role: 'human', message }]);

      // 型だけ API client から import（実際の宛先は関数 URL のため）
      const payload: GenerateAiReplyRequest = {
        userId: userAttributes.sub ?? '',
        sessionId,
        message,
        dateTime: new Date().toISOString(),
      };

      const authSession = await fetchAuthSession();
      const idToken = authSession.tokens?.idToken?.toString();
      if (!idToken) {
        toast.error('トークンの取得に失敗しました。');
        return;
      }

      try {
        const response = await fetch(GENERATE_RESPONSE_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            Authorization: idToken,
          },
        });

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullResponse = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: !done });
          fullResponse += chunk;
          setAiResponse((prev) => prev + chunk);
        }

        setMessages((prev) => [...prev, { role: 'ai', message: fullResponse }]);
        setAiResponse(''); // ストリーミングメッセージをリセット
        sessionIdForTitle = sessionId;
        sessionHistoryForTitle = [
          ...((await session).sessionHistory as Messages[]),
          ...messages,
          { role: 'human', message },
          { role: 'ai', message: fullResponse },
        ];
      } catch (error) {
        console.error('Error fetching stream:', error);
        setAiResponse('Error occurred while fetching streaming data.');
      } finally {
        setIsAiLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ページ離脱時にセッションタイトルを生成
  useEffect(() => {
    const generateSessionTitle = async () => {
      await postGenerateSessionTitle({
        sessionId: sessionIdForTitle,
        sessionHistory: sessionHistoryForTitle,
      });
    };
    return () => {
      if (sessionIdForTitle && sessionHistoryForTitle) {
        generateSessionTitle();
      }
    };
  }, []);

  return (
    <div className="min-h-[100vh] xl:flex">
      {/* サイドメニュー常時表示できる */}
      {/* <div className="bg-stone-500 max-xl:hidden xl:w-[384px]" /> */}
      <header className="fixed left-0 top-0 z-50 flex w-full justify-between bg-white/70 p-4 backdrop-blur-md">
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          sessions={sessions}
          setOpenDialog={setOpenDialog}
          userAttributes={userAttributes}
        />
        <ShadcnAlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <TooltipProvider>
                <Tooltip open={isEscalateTooltipOpen}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      type="button"
                      variant="primaryOutline"
                      className="rounded-xl"
                      disabled={isAiLoading || messages.length === 0}
                    >
                      <Suspense
                        fallback={
                          <div className="mr-2 h-3 w-3 animate-spin rounded-sm bg-primary"></div>
                        }
                      >
                        <Await promise={inviter}>
                          {(data) => {
                            if (!data) {
                              return '招待者';
                            }
                            return data.displayName
                              ? data.displayName
                              : '招待者';
                          }}
                        </Await>
                      </Suspense>
                      に聞く
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-md flex items-center gap-2 border-none bg-yellow-50 text-stone-800">
                    <>
                      <Lightbulb
                        className="animate-bounce text-orange-600"
                        size={16}
                      />
                      AI だけでは解決が難しそうですか？
                    </>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Suspense
                  fallback={
                    <div className="mr-2 h-3 w-3 animate-spin rounded-sm bg-primary"></div>
                  }
                >
                  <Await promise={inviter}>
                    {(data) => {
                      const displayName = data
                        ? data.displayName
                          ? data.displayName
                          : '招待者'
                        : '招待者';
                      return <>{displayName}さんに転送しますか？</>;
                    }}
                  </Await>
                </Suspense>
              </AlertDialogTitle>
              <AlertDialogDescription>
                招待者に会話の要約を送信します。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={onEscalateWithMail}>
                <Mail className="ml-1 mr-2" />
                メールで送信
              </AlertDialogAction>
              <AlertDialogAction
                className="mb-2 bg-[#06C755] font-bold"
                onClick={onEscalateWithLine}
              >
                <img
                  src="/line-square.png"
                  className="mr-2 h-8 object-contain"
                />
                LINE で送信
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </ShadcnAlertDialog>
      </header>
      <Dialog
        open={openDialog.escalating}
        title="ただいま会話の内容を要約、転送中です。"
        description="この処理には数分かかる可能性があります。少々お待ちください。"
        showCircleIcon
        hideX
        preventCloseOnOutsideClick
        onClose={() =>
          setOpenDialog((prev) => ({ ...prev, escalating: false }))
        }
      />
      <Dialog
        open={openDialog.completeEscalation}
        title="会話の内容を要約、転送しました。"
        displayCloseButton
        onClose={() =>
          setOpenDialog((prev) => ({ ...prev, completeEscalation: false }))
        }
      />
      <div className="mx-auto h-full min-h-[100vh] max-w-[700px] px-2 xl:w-[700px]">
        <Suspense fallback={null}>
          <Await promise={session}>
            {(data) => {
              const history = data.sessionHistory as Messages[];
              return (
                <>
                  <ChatBubbles
                    messages={history}
                    isLoading={false}
                    isPastSession
                    hideBottomPadding
                  />
                </>
              );
            }}
          </Await>
        </Suspense>
        <ChatBubbles
          messages={messages}
          isLoading={isAiLoading}
          aiResponse={aiResponse}
          isPastSession
          hideTopPadding
        />
        <MessageForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isAiLoading}
          transcript={transcript}
          listening={listening}
          startListening={SpeechRecognition.startListening}
          stopListening={SpeechRecognition.stopListening}
          messages={messages}
        />
      </div>
    </div>
  );
}
