import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Clipboard } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { postCreateCognitoUser } from '@/lib/generatedApi';

export const Route = createFileRoute('/invite/')({
  component: Invite,
  loader: async () => {
    const userAttributes = await fetchUserAttributes();
    return { userAttributes };
  },
});

type Inputs = {
  email: string;
};

type OpenDialog = {
  requesting: boolean;
  requested: boolean;
};

function Invite() {
  const { userAttributes } = useLoaderData({ from: '/invite/' });
  const [openDialog, setOpenDialog] = useState<OpenDialog>({
    requesting: false,
    requested: false,
  });

  const form = useForm<Inputs>({
    defaultValues: { email: '' },
  });
  const emailValue = form.watch('email');

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    try {
      setOpenDialog((prev) => ({ ...prev, requesting: true }));
      await postCreateCognitoUser({
        email: input.email,
        inviter: userAttributes.sub ?? '',
      });
      setOpenDialog((prev) => ({
        ...prev,
        requesting: false,
        requested: true,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDialog((prev) => ({ ...prev, requesting: false }));
    }
  };

  const parseSearchParams = () => {
    return new URLSearchParams({
      email: emailValue,
    }).toString();
  };

  const baseUrl = 'https://production.angel-make-it.com/login-with-magic-link?';
  const inviteUrl = `${baseUrl}${parseSearchParams()}`;
  const lineUrl = `https://line.me/R/share?text=${encodeURI(baseUrl)}${encodeURIComponent(parseSearchParams())}`;

  console.log(lineUrl);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('クリップボードにコピーしました。', { richColors: true });
    } catch (err) {
      toast.error('クリップボードへのコピーに失敗しました。', {
        richColors: true,
      });
    }
  };
  return (
    <div className="mx-8 flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="make it logo" className="h-24" />
          <h1 className="text-3xl font-bold">make it !</h1>
        </div>
        <Dialog
          open={openDialog.requesting}
          title="招待の準備中です。"
          description="この画面のまま少々お待ちください。"
          showCircleIcon
          hideX
          preventCloseOnOutsideClick
          onClose={() =>
            setOpenDialog((prev) => ({ ...prev, requesting: false }))
          }
        />
        <Dialog
          open={openDialog.requested}
          // open={true}
          title="招待の準備が完了しました。"
          // description="以下のリンクを招待したユーザーに送信してください。"
          displayCloseButton
          onClose={() => {
            setOpenDialog((prev) => ({ ...prev, requested: false }));
            form.reset({ email: '' });
          }}
        >
          <div className="flex flex-col gap-4 pt-6">
            <h2>リンクを招待したユーザーに送信</h2>
            <code className="relative flex rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
              {inviteUrl}
              <button onClick={copyToClipboard}>
                <Clipboard />
              </button>
            </code>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-muted-foreground">もしくは</span>
              <Separator className="flex-1" />
            </div>
            <a className="flex justify-center" href={lineUrl}>
              <img
                src="/line-share.png"
                alt="make it logo"
                className="h-10 object-contain"
              />
            </a>
          </div>
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ユーザーを招待する</CardTitle>
            <CardDescription>
              メールアドレスを入力してボタンを押してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="rounded-full"
                  disabled={emailValue.length === 0}
                >
                  招待する
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
