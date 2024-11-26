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

type AlertDialogProps = {
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText: string;
  cancelText?: string;
  children: React.ReactNode; // children プロパティを追加
};

export function AlertDialog({
  onConfirm,
  title,
  content,
  confirmText,
  cancelText = 'キャンセル',
  children,
}: AlertDialogProps) {
  return (
    <ShadcnAlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
}
