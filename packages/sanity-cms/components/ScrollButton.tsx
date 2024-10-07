'use client';

import { Button } from '@session/ui/ui/button';
import { LongArrowIcon } from '@session/ui/icons/LongArrowIcon';
import { cn } from '@session/ui/lib/utils';

export function ScrollButton({
  scrollText,
  targetId,
  isRTLLocale,
  className,
}: {
  scrollText: string;
  targetId: string;
  isRTLLocale?: boolean;
  className?: string;
}) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollBy({ behavior: 'smooth', left: isRTLLocale ? -240 : 240 });
    }
  };
  return (
    <Button
      className={cn('text-session-text-black-secondary gap-2 fill-current px-1', className)}
      size="xs"
      rounded="md"
      variant="ghost"
      data-testid={`button:scroll-${targetId}`}
      onClick={handleClick}
    >
      {scrollText}
      <LongArrowIcon className={cn('h-6 w-12 fill-current', isRTLLocale && 'rotate-180')} />
    </Button>
  );
}
