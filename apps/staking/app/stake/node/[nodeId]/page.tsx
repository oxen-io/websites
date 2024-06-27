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
      headerAction={<Link href={`/explorer/${nodeId}`}>{dictionary('viewOnExplorer')}</Link>}
    >
      <NodeStaking nodeId={nodeId} />
    </ActionModule>
  );
}
