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
    <div className="-mt-header-displacement max-w-screen-3xl mx-auto flex h-dvh w-screen flex-col-reverse items-center justify-around py-16 align-middle lg:grid lg:grid-cols-2 lg:p-32 lg:py-0">
      // TODO Review after https://github.com/oxen-io/websites/pull/10 is merged
      <div className="flex w-full flex-col gap-10 align-middle">
        <div className={'z-10 flex flex-col items-center justify-start lg:items-start'}>
          <h1 className="whitespace-nowrap text-center text-5xl font-medium md:text-7xl lg:text-start 2xl:text-8xl">
            {dictionary.rich('title')}
          </h1>
          <h2
            className={cn(
              'whitespace-nowrap text-center text-3xl font-medium md:text-4xl lg:text-start xl:text-7xl 2xl:text-8xl'
            )}
          >
            {dictionary('titleDescription')}
          </h2>
        </div>
        <div className="hidden gap-4 lg:flex lg:flex-row lg:justify-start">
          <Link href="/stake" prefetch>
            <Button size="lg" data-testid={ButtonDataTestId.Home_Run_Node} className="uppercase">
              {dictionary('buttons.primary')}
            </Button>
          </Link>
          <Link href={URL.SESSION_NODE_DOCS} target="_blank">
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
        <div className="flex flex-col-reverse items-center justify-center gap-4 lg:hidden">
          <Link href="/stake" prefetch>
            <Button size="sm" data-testid={ButtonDataTestId.Home_Run_Node} className="uppercase">
              {dictionary('buttons.primary')}
            </Button>
          </Link>
          <Link href={URL.SESSION_NODE_DOCS} target="_blank">
            <Button
              size="sm"
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
  );
}
