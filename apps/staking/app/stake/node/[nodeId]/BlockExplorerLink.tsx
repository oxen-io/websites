'use client';

import { OpenNode } from '@session/sent-staking-js/client';
import { LoadingText } from '@session/ui/components/loading-text';
import { LinkOutIcon } from '@session/ui/icons/LinkOutIcon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export const BlockExplorerLink = ({ nodeId }: { nodeId: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [nodes, setNodes] = useState<Array<OpenNode>>([]);
  const dictionary = useTranslations('actionModules.node');

  useEffect(() => {
    fetch('/api/sent/nodes/open')
      .then((res) => res.json())
      .then((data) => setNodes(data.nodes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const node = useMemo(() => {
    /* if (showMockNodes) {
      return generateOpenNodes({ userAddress: address })[0];
    } else if (showNoNodes) {
      return {} as OpenNode;
    } */
    return nodes?.find((node) => node.service_node_pubkey === nodeId);
  }, [nodes]);

  return loading ? (
    <LoadingText />
  ) : node?.contract ? (
    <Link href={`/explorer/${node?.contract}`} target="_blank">
      <span className="text-session-green fill-session-green inline-flex items-center gap-1 align-middle">
        {dictionary('viewOnExplorer')}
        <LinkOutIcon className="h-4 w-4" />
      </span>
    </Link>
  ) : null;
};
