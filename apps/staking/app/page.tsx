import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const dictionary = useTranslations('home');
  return (
    <div className="lg:-mt-header-displacement w-max-[1920px] flex w-screen flex-col-reverse items-center justify-around align-middle lg:grid lg:h-screen lg:grid-cols-2 lg:p-32">
      <div className="flex flex-col gap-10 align-middle">
        <h1 className="max-w-[700px] px-10 text-center text-5xl font-medium lg:px-0 lg:text-left lg:text-7xl 2xl:text-8xl">
          {dictionary.rich('title', {
            tokenSymbol: SENT_SYMBOL,
            bold: (chunks) => <b className="font-semibold">{chunks}</b>,
          })}
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
          <Link href="https://docs.getsession.org/session-nodes">
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
