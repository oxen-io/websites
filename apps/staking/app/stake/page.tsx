import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ActionModule from './ActionModule';

export default function Page() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <ActionModule background={1}>
      <div className="flex h-full w-full flex-col pt-10 text-lg xl:py-40">
        <ModuleGridInfoContent className="w-full xl:w-3/4">
          <p>{dictionary('landingP1')}</p>
          <p>{dictionary.rich('landingP2', { link: externalLink(URL.SESSION_NODE_DOCS) })}</p>
          <Link href={URL.SESSION_NODE_DOCS} prefetch>
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
