import { URL } from '@/lib/constants';
import { siteMetadata } from '@/lib/metadata';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ActionModulePage } from '@/components/ActionModule';

export async function generateMetadata() {
  return siteMetadata({
    title: 'Stake Now',
    description: 'Browse open Session Nodes to stake to.',
  });
}

export default function Page() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <ActionModulePage>
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
    </ActionModulePage>
  );
}
