import { useNavigate } from '@tanstack/react-router';
import { Brain, History, Lightbulb, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const tutorialKey = 'makeIt:tutorial:shown';

export function MenuTutorial() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem(tutorialKey, 'true');
    navigate({ to: '/session' });
  };
  return (
    <div className="flex h-[100vh] flex-col items-center gap-2 p-2">
      <div className="container space-y-2">
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger className="w-full">
              <div
                className="inline-flex h-48 w-full flex-col items-start justify-center space-y-2 whitespace-nowrap rounded-md bg-primary bg-gradient-to-br from-primary to-[hsl(289,90%,55%)] pl-16 text-lg font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleClick}
              >
                <Brain size={40} />
                <h1 className="pl-2 text-2xl font-semibold">AI に質問する</h1>
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-3 bg-yellow-50 p-5 text-xl font-bold text-stone-800">
              <Lightbulb className="animate-bounce text-orange-600" size={30} />
              <h1>
                「AIに質問をする」を押して
                <br />
                AI に質問してみましょう！
              </h1>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          disabled
          size="xlg"
          className="flex flex-col items-start space-y-2 bg-amber-200 pl-16 text-stone-800 hover:bg-amber-200"
        >
          <History size={40} />
          <h1 className="pl-2 text-2xl font-semibold">過去の会話</h1>
        </Button>
        <Button
          disabled
          size="xlg"
          className="flex flex-col items-start space-y-2 bg-[#CFE1D7] pl-16 text-stone-800 hover:bg-[#CFE1D7]"
        >
          <Share2 size={40} />
          <h1 className="pl-2 text-2xl font-semibold">転送された会話</h1>
        </Button>
      </div>
    </div>
  );
}
