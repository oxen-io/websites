import { ButtonDataTestId } from '@/testing/data-test-ids';
import { HomeIcon } from '@session/ui/icons/HomeIcon';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const dictionary = useTranslations('notFound');
  return (
    <div className="flex items-center w-full h-screen align-middle p-32 -mt-header-displacement justify-center">
      <div className="flex flex-row gap-10 items-center h-[200px] align-middle justify-center">
        <span className="text-[200px] font-bold pt-10">404</span>
        <div className="w-px bg-gray-300 h-[180px]" />
        <div className="flex flex-col gap-5">
          <p className="text-xl max-w-[340px]">{dictionary('description')}</p>
          <Link href="/" prefetch={false}>
            <Button
              size="lg"
              variant="outline"
              className="group"
              data-testid={ButtonDataTestId.Not_Found_Return_Home}
            >
              <HomeIcon className="h-6 w-6 mr-2 fill-session-green group-hover:fill-session-black" />{' '}
              {dictionary('homeButton')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
