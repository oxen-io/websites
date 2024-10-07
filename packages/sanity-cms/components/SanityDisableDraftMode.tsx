'use client';

import { Button } from '@session/ui/ui/button';
import { ButtonDataTestId } from '../testing/data-test-ids';
import { Portal } from 'next/dist/client/portal';

export default function SanityDisableDraftMode({
  disableDraftModePath,
}: {
  disableDraftModePath: string;
}) {
  return (
    <Portal type="div">
      <a href={disableDraftModePath} className="fixed bottom-0 right-0 m-4">
        <Button data-testid={ButtonDataTestId.Disable_Draft_Mode} rounded="md" size="xs">
          Disable Draft Mode
        </Button>
      </a>
    </Portal>
  );
}
