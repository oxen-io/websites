'use client';

import { OpenNode, OpenNodeCard } from '@/components/OpenNodeCard';
import { ModuleGridContent } from '@session/ui/components/ModuleGrid';

const openNodes: Array<OpenNode> = [
  {
    pubKey:
      'LCyJ52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p4',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },

  {
    pubKey:
      'LCyJ52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p5',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCyJ52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p6',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCyJ52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p7',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
  {
    pubKey:
      'LCyJ52dFcGmZxo5uC9smEKJHeNGQgc6FU4UtfxXbK7u4H3asfL5dRfoRBajnuuQdEhXjHggCtMTfA6BSoT8eb3G7Fd6p8',
    maxContribution: 1000,
    minContribution: 100,
    operatorFee: 0.1,
  },
];

export default function OpenNodes() {
  return (
    <ModuleGridContent>
      {openNodes.map((node) => (
        <OpenNodeCard key={node.pubKey} node={node} />
      ))}
    </ModuleGridContent>
  );
}
