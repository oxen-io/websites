import { LinkOutIcon } from '@session/ui/icons/LinkOutIcon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ActionModule from '../../ActionModule';
import NodeStaking from './NodeStaking';

interface NodePageParams {
  params: {
    nodeId: string;
  };
}

export default function NodePage({ params }: NodePageParams) {
  const { nodeId } = params;
  const dictionary = useTranslations('actionModules.node');
  return (
    <ActionModule
      background={1}
      title={dictionary('title')}
      headerAction={
        <Link href={`/explorer/${nodeId}`}>
          <span className="text-session-green fill-session-green inline-flex items-center gap-1 align-middle">
            {dictionary('viewOnExplorer')}
            <LinkOutIcon className="h-4 w-4" />
          </span>
        </Link>
      }
    >
      <NodeStaking nodeId={nodeId} />
    </ActionModule>
  );
}
