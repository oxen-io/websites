import { siteMetadata } from '@/lib/metadata';
import { useTranslations } from 'next-intl';
import { ActionModulePage } from '@/components/ActionModule';

export async function generateMetadata() {
  return siteMetadata({
    title: 'Register Session Node',
    description: 'Register a Session Node and stake to it.',
  });
}

export default function Page() {
  const dictionary = useTranslations('modules.nodeRegistrations');
  return (
    <ActionModulePage>
      <p>{dictionary('landingP1')}</p>
    </ActionModulePage>
  );
}
