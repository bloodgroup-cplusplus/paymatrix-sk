import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
};

function toast({ title, description }: ToastProps) {
  const id = sonnerToast(title, {
    description,
  });

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
  };
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => {
      if (toastId !== undefined) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}

export { useToast, toast };


