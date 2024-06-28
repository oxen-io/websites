import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const dictionary = useTranslations('home');
  return (
    <div className="-mt-header-displacement max-w-screen-3xl mx-auto flex h-dvh w-screen flex-col-reverse items-center justify-around py-16 align-middle lg:grid lg:grid-cols-2 lg:p-32 lg:py-0">
      <div className="flex flex-col gap-10 align-middle">
        <h1 className="max-w-[700px] px-10 text-center text-5xl font-medium lg:px-0 lg:text-left lg:text-7xl 2xl:text-8xl">
          {dictionary.rich('title')}
        </h1>
        <div className="hidden gap-4 lg:flex lg:flex-row lg:justify-start">
          <Link href="/stake" prefetch>
            <Button size="lg" data-testid={ButtonDataTestId.Home_Run_Node}>
              {dictionary('buttons.primary')}
            </Button>
          </Link>
          <Link href="https://docs.getsession.org/session-nodes">
            <Button size="lg" variant="outline" data-testid={ButtonDataTestId.Home_Run_Node}>
              {dictionary('buttons.secondary')}
            </Button>
          </Link>
        </div>
        <div className="flex flex-col-reverse items-center justify-center gap-4 lg:hidden">
          <Link href="/stake" prefetch>
            <Button size="sm" data-testid={ButtonDataTestId.Home_Run_Node}>
              {dictionary('buttons.primary')}
            </Button>
          </Link>
          <Link href="https://docs.getsession.org/session-nodes" target="_blank">
            <Button size="sm" variant="outline" data-testid={ButtonDataTestId.Home_Run_Node}>
              {dictionary('buttons.secondary')}
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center align-middle">
        <Image src="/images/cube.png" alt={dictionary('heroImageAlt')} height={1024} width={1024} />
      </div>
    </div>
  );
}
