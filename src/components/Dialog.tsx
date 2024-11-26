import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog as ShadcnDialog,
} from '@/components/ui/dialog';

export type OnlyContentDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  showCircleIcon?: boolean;
  hideX?: boolean;
  hideDescription?: boolean;
  displayCloseButton?: boolean;
  preventCloseOnOutsideClick?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export function Dialog({
  open,
  title,
  description,
  showCircleIcon = false,
  hideX = false,
  hideDescription = false,
  displayCloseButton = false,
  preventCloseOnOutsideClick = false,
  onClose,
  children,
}: OnlyContentDialogProps) {
  return (
    <ShadcnDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-description="test"
        hideX={hideX}
        onInteractOutside={
          preventCloseOnOutsideClick
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            {showCircleIcon && (
              <div className="h-4 w-4 animate-spin rounded-md bg-primary"></div>
            )}
            {title}
          </DialogTitle>
          <DialogDescription
            className={hideDescription ? 'sr-only' : undefined}
          >
            {description}
          </DialogDescription>
          {children}
        </DialogHeader>
        {displayCloseButton && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>
                閉じる
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </ShadcnDialog>
  );
}
