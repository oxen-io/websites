'use client';
import { OpenNode, OpenNodeCard } from '@/components/OpenNodeCard';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { useTranslations } from 'next-intl';

const openNodes: Array<OpenNode> = [
  {
    pubKey:
      'LCys52dasGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p4',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },

  {
    pubKey:
      'LCyJd2dFcGmZsz5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p5',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCya52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p6',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCyJg2dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p7',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCyJ5bdFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p8',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
];

export default function OpenNodesModule() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
      </ModuleGridHeader>
      <OpenNodes />
    </>
  );
}

function OpenNodes() {
  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {openNodes.map((node) => (
        <OpenNodeCard key={node.pubKey} node={node} />
      ))}
    </ModuleGridContent>
  );
}
