import { forwardRef } from 'react';
import { BaseDataTestId, TestingProps } from '../data-test-ids';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { toast } from '../lib/sonner';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export interface CopyToClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    TestingProps<BaseDataTestId.Button> {
  textToCopy: string;
  copyToClipboardToastMessage: string;
  onCopyComplete?: () => void;
}

/**
 * Copies the specified text to the clipboard and displays a success toast message.
 *
 * @param textToCopy The text to be copied to the clipboard.
 * @param copyToClipboardToastMessage The message to be displayed in the success toast.
 */
function copyToClipboard(
  textToCopy: string,
  copyToClipboardToastMessage: string,
  onCopyComplete?: () => void
) {
  navigator.clipboard.writeText(textToCopy);
  toast.success(copyToClipboardToastMessage);
  if (onCopyComplete) {
    onCopyComplete();
  }
}

const CopyToClipboardButton = forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  ({ textToCopy, copyToClipboardToastMessage, onCopyComplete, className, ...props }, ref) => {
    return (
      <Button
        onClick={() => copyToClipboard(textToCopy, copyToClipboardToastMessage, onCopyComplete)}
        variant="ghost"
        className={cn(className, 'select-all p-0')}
        ref={ref}
        {...props}
        data-testid={props['data-testid']}
      >
        <ClipboardIcon />
      </Button>
    );
  }
);
CopyToClipboardButton.displayName = 'CopyToClipboardButton';

export { CopyToClipboardButton };
