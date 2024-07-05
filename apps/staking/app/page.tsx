import { Footer } from '@/components/Footer';
import { URL } from '@/lib/constants';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { cn } from '@session/ui/lib/utils';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const dictionary = useTranslations('home');
  return (
    <div className={cn('mx-auto flex flex-col items-center justify-center')}>
      <div
        className={cn(
          'max-w-screen-3xl flex h-dvh w-screen flex-col-reverse items-center justify-around py-16 align-middle',
          'md:-mt-header-displacement',
          'lg:grid lg:grid-cols-2 lg:p-8 lg:py-0',
          'xl:p-32'
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-10 align-middle',
            'md:-mt-header-displacement',
            'lg:mt-0'
          )}
        >
          <h1
            className={cn(
              'w-full max-w-[700px] px-8 text-center text-4xl font-medium',
              'sm:text-5xl',
              'md:px-10 md:text-5xl',
              'lg:px-0 lg:text-start lg:text-7xl',
              'xl:pe-10 xl:ps-0',
              '2xl:text-8xl'
            )}
          >
            {dictionary.rich('title')}
          </h1>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 lg:flex-nowrap lg:justify-start">
            <Link href="/stake" prefetch className="lg:hidden">
              <Button size="sm" data-testid={ButtonDataTestId.Home_Run_Node} className="uppercase">
                {dictionary('buttons.primary')}
              </Button>
            </Link>
            <Link href={URL.SESSION_NODE_DOCS} target="_blank" className="lg:hidden">
              <Button
                size="sm"
                variant="outline"
                data-testid={ButtonDataTestId.Home_Run_Node}
                className="uppercase"
              >
                {dictionary('buttons.secondary')}
              </Button>
            </Link>
            <Link href="/stake" prefetch className="hidden lg:inline">
              <Button size="lg" data-testid={ButtonDataTestId.Home_Run_Node} className="uppercase">
                {dictionary('buttons.primary')}
              </Button>
            </Link>
            <Link href={URL.SESSION_NODE_DOCS} target="_blank" className="hidden lg:inline">
              <Button
                size="lg"
                variant="outline"
                data-testid={ButtonDataTestId.Home_Run_Node}
                className="uppercase"
              >
                {dictionary('buttons.secondary')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex max-w-[50vh] items-center justify-center align-middle lg:max-w-full">
          <Image
            src="/images/cube.png"
            alt={dictionary('heroImageAlt')}
            height={1024}
            width={1024}
            priority
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
