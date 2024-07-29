import {
  ModuleGrid,
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { type ReactNode } from 'react';
import { InfoNodeCardSkeleton } from '@/components/InfoNodeCard';

export default function NodesListModule({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <ModuleGrid variant="section" colSpan={2} className="h-full">
      <ModuleGridHeader>
        <ModuleGridTitle>{title}</ModuleGridTitle>
      </ModuleGridHeader>
      <ModuleGridContent className="h-full md:overflow-y-auto">{children}</ModuleGridContent>
    </ModuleGrid>
  );
}

export function NodesListSkeleton() {
  return (
    <>
      <InfoNodeCardSkeleton />
      <InfoNodeCardSkeleton />
      <InfoNodeCardSkeleton />
    </>
  );
}
