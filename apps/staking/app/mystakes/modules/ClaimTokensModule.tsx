'use client';
import { Module, ModuleText } from '@session/ui/components/Module';
import { PresentIcon } from '@session/ui/icons/PresentIcon';

export default function ClaimTokensModule() {
  return (
    <Module
      className="group items-center"
      onClick={() => {
        console.log('clicked claim');
      }}
    >
      <ModuleText className="inline-flex h-full items-center gap-2 align-middle text-3xl font-bold">
        <PresentIcon className="fill-session-text group-hover:fill-session-black h-6 w-6" />
        <span className="h-8">Claim</span>
      </ModuleText>
    </Module>
  );
}
