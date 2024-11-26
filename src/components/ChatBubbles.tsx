import Linkify from 'linkify-react';
import { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export type Messages = {
  role: 'human' | 'ai';
  message: string;
};

const bubbleStyles = 'whitespace-pre-wrap break-all py-3 px-5';
const humanBubbleStyles = cn(
  bubbleStyles,
  'ml-auto max-w-[70%] rounded-[20px_20px_0_20px] bg-stone-100',
);
const aiBubbleStyles = cn(
  bubbleStyles,
  'rounded-[0_20px_20px_20px] bg-gradient-to-br to-[hsl(335,78%,53%)] from-primary text-white',
);

export function ChatBubbles({
  messages,
  isLoading,
  aiResponse,
  isPastSession = false,
  hideTopPadding = false,
  hideBottomPadding = false,
}: {
  messages: Messages[];
  isLoading: boolean;
  aiResponse?: string;
  isPastSession?: boolean;
  hideTopPadding?: boolean;
  hideBottomPadding?: boolean;
}) {
  useEffect(() => {
    animateScroll.scrollToBottom({ duration: 100, smooth: true });
  }, [messages]);
  useEffect(() => {
    animateScroll.scrollToBottom({ duration: 0, smooth: false });
  }, [aiResponse]);

  return (
    <>
      {isPastSession || messages.length > 0 ? (
        <>
          <div
            className={
              'flex flex-col gap-3 ' + (!hideTopPadding ? 'pt-20' : 'mt-3')
            }
          >
            {messages.map((message, index) => {
              switch (message.role) {
                case 'human':
                  return <HumanBubble key={index} message={message.message} />;
                case 'ai':
                  return <AiBubble key={index} message={message.message} />;
                default:
                  return null;
              }
            })}
            {isLoading && !aiResponse && (
              <AiBubble showCircularProgress message="  AI が考え中..." />
            )}
            {aiResponse && <AiBubble key="999" message={aiResponse} />}
          </div>
          {!hideBottomPadding && <div className="flex h-20"></div>}
        </>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <img src="/logo.png" alt="make it logo" className="h-16" />
        </div>
      )}
    </>
  );
}

const HumanBubble = ({ message }: { message: string }) => (
  <p className={humanBubbleStyles}>{message}</p>
);

const AiBubble = ({
  message,
  showCircularProgress,
}: {
  message: string;
  showCircularProgress?: boolean;
}) => {
  const trimmedMessage = message.replace(/^\n+/, '');
  return (
    <div className="flex gap-2">
      {/* <Bot className="min-h-8 min-w-8 text-stone-600" /> */}
      <Avatar className="items-center justify-center border border-amber-500">
        <AvatarImage src="/logo.png" className="h-5 w-6" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <Linkify
        options={{
          render: {
            url: ({ attributes, content }) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                {...attributes}
                className="font-medium underline"
              >
                {content}
              </a>
            ),
          },
        }}
      >
        {showCircularProgress ? (
          <div className={cn(aiBubbleStyles, 'flex items-center')}>
            <div className="h-4 w-4 animate-spin rounded-md bg-white"></div>
            {trimmedMessage}
          </div>
        ) : (
          <div className={aiBubbleStyles}>{trimmedMessage}</div>
        )}
      </Linkify>
    </div>
  );
};
