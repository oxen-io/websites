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
}

/**
 * Copies the specified text to the clipboard and displays a success toast message.
 *
 * @param textToCopy The text to be copied to the clipboard.
 * @param copyToClipboardToastMessage The message to be displayed in the success toast.
 */
function copyToClipboard(textToCopy: string, copyToClipboardToastMessage: string) {
  navigator.clipboard.writeText(textToCopy);
  toast.success(copyToClipboardToastMessage);
}

const CopyToClipboardButton = forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  ({ textToCopy, copyToClipboardToastMessage, className, ...props }, ref) => {
    return (
      <Button
        onClick={() => copyToClipboard(textToCopy, copyToClipboardToastMessage)}
        variant="ghost"
        className={cn(className, 'p-0 select-all')}
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
