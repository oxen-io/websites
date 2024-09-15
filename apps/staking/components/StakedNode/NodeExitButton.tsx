import { ButtonDataTestId } from '@/testing/data-test-ids';
import { useTranslations } from 'next-intl';
import { Button } from '@session/ui/ui/button';
import { CollapsableContent } from '@/components/StakedNodeCard';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@session/ui/lib/utils';

export const NodeExitButton = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & {
    disabled?: boolean;
  }
>(({ disabled, className, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.staked.exit');
  return (
    <CollapsableContent
      className={cn('bottom-4 right-6 flex items-end min-[500px]:absolute', className)}
      size="buttonMd"
      width="w-max"
      {...props}
      ref={ref}
    >
      <Button
        aria-label={dictionary('buttonAria')}
        data-testid={ButtonDataTestId.Staked_Node_Exit}
        disabled={disabled}
        rounded="md"
        size="md"
        variant="destructive-outline"
        className="uppercase"
      >
        {dictionary('buttonText')}
      </Button>
    </CollapsableContent>
  );
});
