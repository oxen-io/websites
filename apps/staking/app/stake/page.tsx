import { Input } from '@session/ui/ui/input';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ActionModule from './ActionModule';

export default function Page() {
  const dictionary = useTranslations('actionModules.register');
  return (
    <ActionModule background={1}>
      <div className="flex h-full w-full flex-col items-center px-20 pt-[30%]">
        <p>{dictionary('description')}</p>
        <Input placeholder={dictionary('input.placeholder')} />
        <Link href="/">{dictionary('learnMore')}</Link>
      </div>
    </ActionModule>
  );
}
