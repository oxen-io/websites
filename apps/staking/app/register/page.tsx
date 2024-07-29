import { siteMetadata } from '@/lib/metadata';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { useTranslations } from 'next-intl';
import ActionModule from '@/components/ActionModule';

export async function generateMetadata() {
  return siteMetadata({
    title: 'Register Session Node',
    description: 'Register a Session Node and stake to it.',
  });
}

export default function Page() {
  const dictionary = useTranslations('modules.nodeRegistrations');
  return (
    <ActionModule background={1}>
      <div className="flex h-full w-full flex-col pt-10 text-lg xl:py-40">
        <ModuleGridInfoContent className="w-full xl:w-3/4">
          <p>{dictionary('landingP1')}</p>
        </ModuleGridInfoContent>
      </div>
    </ActionModule>
  );
}
