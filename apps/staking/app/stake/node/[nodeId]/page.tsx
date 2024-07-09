import { useTranslations } from 'next-intl';
import ActionModule from '../../ActionModule';
import { BlockExplorerLink } from './BlockExplorerLink';
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
      headerAction={<BlockExplorerLink nodeId={nodeId} />}
    >
      <NodeStaking nodeId={nodeId} />
    </ActionModule>
  );
}
