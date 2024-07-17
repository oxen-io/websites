import { URL } from '@/lib/constants';
import { siteMetadata } from '@/lib/metadata';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ActionModule from './ActionModule';

export async function generateMetadata() {
  return siteMetadata({
    title: 'Stake Now',
    description: 'Browse open Session Nodes to stake to.',
  });
}

export default function Page() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <ActionModule background={1}>
      <div className="flex h-full w-full flex-col pt-10 text-lg xl:py-40">
        <ModuleGridInfoContent className="w-full xl:w-3/4">
          <p>{dictionary('landingP1')}</p>
          <p>{dictionary('landingP2')}</p>
          <Link
            href={URL.SESSION_NODE_SOLO_SETUP_DOCS}
            prefetch
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <Button
              aria-label={dictionary('learnMoreButtonAria')}
              data-testid={ButtonDataTestId.Learn_More_Open_Nodes}
              rounded="md"
              size="xl"
              className="md:px-20"
            >
              {dictionary('learnMoreButtonText')}
            </Button>
          </Link>
        </ModuleGridInfoContent>
      </div>
    </ActionModule>
  );
}
