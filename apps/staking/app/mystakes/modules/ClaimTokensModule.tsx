'use client';
import { Module, ModuleText } from '@session/ui/components/Module';
import { PresentIcon } from '@session/ui/icons/PresentIcon';

export default function ClaimTokensModule() {
  return (
    <Module
      className="items-center"
      onClick={() => {
        console.log('clicked claim');
      }}
    >
      <ModuleText className="text-3xl font-bold inline-flex gap-2 align-middle items-center h-full">
        <PresentIcon className="w-6 h-6 fill-session-text hover:fill-session-black" />
        Claim
      </ModuleText>
    </Module>
  );
}
