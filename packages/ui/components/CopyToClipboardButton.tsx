import { type ButtonHTMLAttributes, forwardRef, useState } from 'react';
import { BaseDataTestId, TestingProps } from '../data-test-ids';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { toast } from '../lib/toast';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { CheckIcon } from 'lucide-react';
import { Spinner } from '../icons/Spinner';

export interface CopyToClipboardButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    TestingProps<BaseDataTestId.Button> {
  textToCopy: string;
  copyToClipboardToastMessage?: string;
  onCopyComplete?: () => void;
}

/**
 * Copies the specified text to the clipboard and displays a success toast message.
 *
 * @param textToCopy The text to be copied to the clipboard.
 * @param copyToClipboardToastMessage The message to be displayed in the success toast.
 */
async function copyToClipboard(
  textToCopy: string,
  copyToClipboardToastMessage?: string,
  onCopyComplete?: () => void
) {
  await navigator.clipboard.writeText(textToCopy);
  if (copyToClipboardToastMessage) {
    toast.success(copyToClipboardToastMessage);
  }
  if (onCopyComplete) {
    onCopyComplete();
  }
}

const CopyToClipboardButton = forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  ({ textToCopy, copyToClipboardToastMessage, onCopyComplete, className, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = async () => {
      if (isLoading || isCopied) return;
      setIsLoading(true);
      await copyToClipboard(textToCopy, copyToClipboardToastMessage, onCopyComplete);
      setIsCopied(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        rounded={'md'}
        className={cn('select-all p-0', className)}
        ref={ref}
        {...props}
        data-testid={props['data-testid']}
      >
        {isLoading ? (
          <Spinner className="h-5 w-5" />
        ) : isCopied ? (
          <CheckIcon className="stroke-session-green h-5 w-5" />
        ) : (
          <ClipboardIcon className="fill-session-white h-5 w-5" />
        )}
      </Button>
    );
  }
);
CopyToClipboardButton.displayName = 'CopyToClipboardButton';

export { CopyToClipboardButton };
