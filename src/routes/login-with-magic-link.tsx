import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { usePasswordless } from 'amazon-cognito-passwordless-auth/react';
import { useEffect, useState } from 'react';
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

type Inputs = {
  email: string;
};

type OpenDialog = {
  requesting: boolean;
  requested: boolean;
};

export const Route = createFileRoute('/login-with-magic-link')({
  component: LoginWithMagicLink,
  validateSearch: (search: Record<string, unknown>): Inputs => {
    return { email: (search.email as string) || '' };
  },
});

function LoginWithMagicLink() {
  const { requestSignInLink, signInStatus } = usePasswordless();
  const { email } = useSearch({ from: '/login-with-magic-link' });
  const [openDialog, setOpenDialog] = useState<OpenDialog>({
    requesting: false,
    requested: false,
  });
  const navigate = useNavigate();

  const form = useForm<Inputs>({
    defaultValues: { email },
  });
  const emailValue = form.watch('email');

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    try {
      setOpenDialog((prev) => ({ ...prev, requesting: true }));
      form.reset({ email: '' });
      console.log(input.email);
      const { signInLinkRequested } = requestSignInLink({
        username: input.email,
      });
      await signInLinkRequested;
      setOpenDialog((prev) => ({
        ...prev,
        requesting: false,
        requested: true,
      }));
    } catch (error) {
      toast.error('エラーが発生しました。', { richColors: true });
      console.error(error);
    } finally {
      setOpenDialog((prev) => ({ ...prev, requesting: false }));
    }
  };

  // ログイン成功時にルートにリダイレクトする
  useEffect(() => {
    if (signInStatus === 'SIGNED_IN') {
      navigate({ to: '/' });
    }
  }, [signInStatus, navigate]);

  return (
    <div className="mx-8 flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="make it logo" className="h-24" />
          <h1 className="text-3xl font-bold">make it !</h1>
        </div>
        <Dialog
          open={openDialog.requesting}
          title="サインインのためのメールを送信中です。"
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
          title="メールを送信しました。"
          description="メールに記載されたリンクを押してください。"
          displayCloseButton
          onClose={() =>
            setOpenDialog((prev) => ({ ...prev, requested: false }))
          }
        >
          <img src="/magic-link.png" alt="make it logo" className="shadow-xl" />
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">サインイン</CardTitle>
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
                  サインインを開始する
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
