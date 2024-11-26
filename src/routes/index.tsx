import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Brain, History, Share2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MenuTutorial } from '@/components/MenuTutorial';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog as ShadcnAlertDialog,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getUserUserId, putUserUserId } from '@/lib/generatedApi';

export const Route = createFileRoute('/')({
  component: Menu,
  loader: async () => {
    const userAttributes = await fetchUserAttributes();
    const user = await getUserUserId(userAttributes.sub ?? '');
    return { userAttributes, user };
  },
});

type Inputs = {
  displayName: string;
};

function Menu() {
  const { userAttributes, user } = useLoaderData({ from: '/' });
  const { signOut } = useAuthenticator();
  const navigate = useNavigate();

  const [open, setOpen] = useState(user.displayName == null);

  const form = useForm<Inputs>({
    defaultValues: { displayName: user.displayName ?? '' },
  });
  const displayNameValue = form.watch('displayName');

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    try {
      await putUserUserId(userAttributes.sub ?? '', {
        displayName: input.displayName,
      });
      toast.success('名前の登録が完了しました。', { richColors: true });
      form.reset({ displayName: input.displayName });
    } catch (error) {
      console.error(error);
      toast.error('名前の登録に失敗しました。', { richColors: true });
      return;
    }
  };

  const showTutorial = user.inviter != null;

  return (
    <>
      {showTutorial ? (
        <MenuTutorial />
      ) : (
        <>
          <ShadcnAlertDialog
            open={open}
            onOpenChange={(open) => {
              if (!open) setOpen(false);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>名前を入力</AlertDialogTitle>
                <AlertDialogDescription>
                  アプリで使用する名前を入力してください（ニックネームでも可）
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem className="flex-grow space-y-0">
                        <FormLabel />
                        <FormControl>
                          <Input {...field} placeholder="名前を入力" />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel disabled={user.displayName == null}>
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      disabled={displayNameValue.length === 0}
                    >
                      この名前で登録する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </ShadcnAlertDialog>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="container space-y-2">
              <Button
                size="xlg"
                className="flex flex-col items-start space-y-2 bg-gradient-to-br from-primary to-[hsl(289,90%,55%)] pl-16"
                onClick={() => navigate({ to: '/session' })}
              >
                <Brain size={40} />
                <h1 className="pl-2 text-2xl font-semibold">AI に質問する</h1>
              </Button>
              <Button
                size="xlg"
                className="flex flex-col items-start space-y-2 bg-amber-200 pl-16 text-stone-800 hover:bg-amber-200"
                onClick={() => navigate({ to: '/sessions' })}
              >
                <History size={40} />
                <h1 className="pl-2 text-2xl font-semibold">過去の会話</h1>
              </Button>
              <Button
                size="xlg"
                className="flex flex-col items-start space-y-2 bg-[#CFE1D7] pl-16 text-stone-800 hover:bg-[#CFE1D7]"
                onClick={() => navigate({ to: '/sessions' })}
              >
                <Share2 size={40} />
                <h1 className="pl-2 text-2xl font-semibold">転送された会話</h1>
              </Button>
            </div>
          </div>
          <div className="fixed bottom-2 right-2">
            <Drawer>
              <DrawerTrigger>
                <div className="fixed bottom-2 right-2 flex h-20 w-40 items-center justify-center rounded-full bg-stone-700 text-xl font-black text-white hover:bg-stone-700">
                  メニュー
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="container mx-auto p-5">
                  <DrawerHeader>
                    <DrawerTitle className="text-2xl">メニュー</DrawerTitle>
                    <DrawerDescription>選択してください</DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-md font-bold"
                      onClick={() => navigate({ to: '/invite' })}
                    >
                      ユーザーを招待する
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-md font-bold"
                      onClick={() => setOpen(true)}
                    >
                      自分の名前を変更する
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-md border-primary font-bold text-primary hover:text-primary/80"
                      onClick={() => signOut()}
                    >
                      サインアウト
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </>
      )}
    </>
  );
}
