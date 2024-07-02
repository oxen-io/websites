import ActionModule from './ActionModule';

export default function Page() {
  return (
    <ActionModule background={1}>
      <div className="flex h-full w-full flex-col px-20 py-16 text-lg">
        <h2 className="text-2xl font-medium">Staking</h2>
      </div>
    </ActionModule>
  );
}
