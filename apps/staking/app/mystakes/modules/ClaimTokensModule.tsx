'use client';
import { Module, ModuleContent, ModuleText } from '@session/ui/components/Module';
import { PresentIcon } from '@session/ui/icons/PresentIcon';

export default function ClaimTokensModule() {
  return (
    <Module
      className="group items-center"
      onClick={() => {
        console.log('clicked claim');
      }}
    >
      <ModuleContent className="flex h-full select-none flex-row items-center gap-2 align-middle font-bold">
        <PresentIcon className="fill-session-text group-hover:fill-session-black h-6 w-6" />
        <ModuleText className="h-8 text-3xl group-hover:text-black">Claim</ModuleText>
      </ModuleContent>
    </Module>
  );
}
