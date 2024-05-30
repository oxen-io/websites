import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const dictionary = useTranslations('home');
  return (
    <div className="flex flex-col-reverse justify-around lg:grid lg:grid-cols-2 w-screen lg:h-screen align-middle items-center lg:p-32 lg:-mt-header-displacement w-max-[1920px]">
      <div className="align-middle flex flex-col gap-10">
        <h1 className="text-5xl lg:text-8xl max-w-[700px] text-center lg:text-left lg:px-0 px-10">
          {dictionary.rich('title', {
            token: '$SENT',
            bold: (chunks) => <b>{chunks}</b>,
          })}
        </h1>
        <div className="hidden lg:flex gap-4 lg:flex-row lg:justify-start">
          <Link href="/stake-now" prefetch>
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
        <div className="flex lg:hidden gap-4 flex-col-reverse justify-center items-center">
          <Link href="/stake-now" prefetch>
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
      <div className="flex items-center align-middle justify-center">
        <Image
          src="/images/cube.png"
          alt="Glass cube with green highlights"
          height={1024}
          width={1024}
        />
      </div>
    </div>
  );
}
