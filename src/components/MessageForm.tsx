import { InputBase } from '@mui/material';
import { CirclePause, Lightbulb, Mic } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { ListeningOptions } from 'react-speech-recognition';
import { Messages } from '@/components/ChatBubbles';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type Inputs = {
  message: string;
};

type MessageFormProps = {
  form: UseFormReturn<Inputs, unknown, undefined>;
  onSubmit: SubmitHandler<Inputs>;
  isLoading: boolean;
  transcript: string;
  listening: boolean;
  startListening(options?: ListeningOptions): Promise<void>;
  stopListening(): Promise<void>;
  messages: Messages[];
};

export function MessageForm({
  form,
  onSubmit,
  isLoading,
  transcript,
  listening,
  startListening,
  stopListening,
  messages,
}: MessageFormProps) {
  const messageValue = form.watch('message');

  useEffect(() => {
    if (transcript !== '') {
      form.setValue('message', transcript);
    }
  }, [transcript, form]);

  return (
    <div className="fixed bottom-4 left-1/2 w-full max-w-[min(700px,calc(100%-32px))] -translate-x-1/2 transform">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row items-end gap-1"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-grow space-y-0">
                <FormLabel />
                <FormControl>
                  {/* TODO: shadcn に置き換える */}
                  <div>
                    <TooltipProvider>
                      <Tooltip open={messages.length === 0}>
                        <TooltipTrigger asChild>
                          <InputBase
                            {...field}
                            fullWidth
                            multiline
                            placeholder="メッセージを入力"
                            className="min-h-10 rounded-[20px] border border-solid border-gray-200 bg-white py-2"
                            endAdornment={
                              <SpeechIcon
                                listening={listening}
                                startListening={startListening}
                                stopListening={stopListening}
                                messages={messages}
                              />
                            }
                            inputProps={{
                              style: {
                                paddingLeft: '20px',
                                lineHeight: '1.5',
                              },
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="text-md flex items-center gap-2 border-none bg-yellow-50 p-4 text-stone-800">
                          <>
                            <Lightbulb
                              className="animate-bounce text-orange-600"
                              size={16}
                            />
                            <p>
                              まずは相談したい内容を入力して
                              <br />
                              送信 ボタンを押してみましょう！
                            </p>
                          </>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-full"
            disabled={isLoading || messageValue.length === 0}
            // onClick={stopListening}
          >
            送信
          </Button>
        </form>
      </Form>
    </div>
  );
}

function SpeechIcon({
  listening,
  startListening,
  stopListening,
  messages,
}: {
  listening: boolean;
  startListening(options?: ListeningOptions): Promise<void>;
  stopListening(): Promise<void>;
  messages: Messages[];
}) {
  if (listening) {
    return (
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger onClick={() => stopListening()}>
            <CirclePause className="mr-3 text-primary" />
          </TooltipTrigger>
          <TooltipContent>音声認識中です。話しかけてください。</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        startListening({
          continuous: true,
        })
      }
    >
      <TooltipProvider>
        <Tooltip open={messages.length === 2}>
          <TooltipTrigger onClick={() => stopListening()} asChild>
            <Mic className="mr-3 text-stone-500" />
          </TooltipTrigger>
          <TooltipContent
            className="text-md flex items-center gap-2 border-none bg-yellow-50 p-4 text-stone-800"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <>
              <Lightbulb className="animate-bounce text-orange-600" size={16} />
              <p className="text-left">
                マイクのマークを押して
                <br />
                音声で入力することもできます。
              </p>
            </>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </button>
  );
}
