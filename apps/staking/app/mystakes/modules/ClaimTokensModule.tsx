'use client';

import { Module, ModuleContent, ModuleText } from '@session/ui/components/Module';
import { PresentIcon } from '@session/ui/icons/PresentIcon';

export default function ClaimTokensModule() {
  return (
    <Module className="items-center">
      <ModuleContent className="flex h-full select-none flex-row items-center gap-2 align-middle font-bold hover:bg-inherit">
        <PresentIcon className="fill-session-text group-hover:fill-session-black h-6 w-6 opacity-50" />
        <ModuleText className="h-8 text-3xl opacity-50 group-hover:text-black">Claim</ModuleText>
      </ModuleContent>
    </Module>
  );
}
