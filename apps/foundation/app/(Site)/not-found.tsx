import { ButtonDataTestId } from '@/testing/data-test-ids';
import { HomeIcon } from '@session/ui/icons/HomeIcon';
import { Button } from '@session/ui/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const dictionary = await getTranslations('notFound');
  return {
    title: dictionary('metaTitle'),
    description: dictionary('metaDescription'),
  };
}

export default async function NotFound() {
  const dictionary = await getTranslations('notFound');
  return (
    <div className="-mt-header-displacement flex h-screen w-full items-center justify-center p-32 align-middle">
      <div className="flex flex-col items-center justify-center text-center align-middle md:flex-row md:gap-10 md:text-left lg:h-[140px]">
        <span className="font-monument-extended text-9xl font-bold leading-none lg:mt-[-30px] lg:max-h-[140px] lg:text-[192px]">
          404
        </span>
        <div className="bg-text-primary m-0 hidden h-full w-px p-0 lg:block" />
        <div className="flex h-full flex-col justify-between gap-4 md:gap-0">
          <p className="max-w-[380px] text-xl md:text-2xl">{dictionary('description')}</p>
          <Link href="/" prefetch={false}>
            <Button
              size="lg"
              variant="secondary"
              className="group"
              data-testid={ButtonDataTestId.Not_Found_Return_Home}
            >
              <HomeIcon className="fill-session-green group-hover:fill-session-black mr-2 h-6 w-6" />{' '}
              {dictionary('homeButton')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
