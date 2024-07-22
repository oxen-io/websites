import { Footer } from '@/components/Footer';
import { LANDING_BUTTON_URL } from '@/lib/constants';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { cn } from '@session/ui/lib/utils';
import { Button } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const PrimaryButton = ({ size, className }: { size: 'sm' | 'lg'; className?: string }) => {
  const dictionary = useTranslations('home');

  return (
    <Link href={LANDING_BUTTON_URL.PRIMARY} prefetch className={className}>
      <Button size={size} data-testid={ButtonDataTestId.Home_Primary} className="uppercase">
        {dictionary('buttons.primary')}
      </Button>
    </Link>
  );
};

const SecondaryButton = ({ size, className }: { size: 'sm' | 'lg'; className?: string }) => {
  const dictionary = useTranslations('home');

  return (
    <Link href={LANDING_BUTTON_URL.SECONDARY} target="_blank" prefetch className={className}>
      <Button
        size={size}
        data-testid={ButtonDataTestId.Home_Secondary}
        variant="outline"
        className="uppercase"
      >
        {dictionary('buttons.secondary')}
      </Button>
    </Link>
  );
};

export default function LandingPage() {
  const dictionary = useTranslations('home');
  return (
    <div className={cn('mx-auto flex flex-col items-center justify-center overflow-hidden')}>
      <div
        className={cn(
          'max-w-screen-3xl flex h-dvh w-screen flex-col-reverse items-center justify-around py-16 align-middle',
          'md:-mt-header-displacement',
          'lg:grid lg:grid-cols-2 lg:gap-x-48 lg:p-8 lg:py-0',
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
          <div
            className={'flex flex-col items-center justify-start backdrop-blur-sm lg:items-start'}
          >
            <h1 className="3xl:text-8xl whitespace-nowrap text-center text-5xl font-medium md:text-7xl lg:text-start">
              {dictionary.rich('title')}
            </h1>
            <h2
              className={cn(
                '3xl:text-8xl whitespace-nowrap text-center text-3xl font-medium md:text-4xl lg:text-start xl:text-7xl'
              )}
            >
              {dictionary('titleDescription')}
            </h2>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 lg:flex-nowrap lg:justify-start">
            <SecondaryButton size="sm" className="lg:hidden" />
            <PrimaryButton size="sm" className="lg:hidden" />
            <PrimaryButton size="lg" className="hidden lg:inline" />
            <SecondaryButton size="lg" className="hidden lg:inline" />
          </div>
        </div>
        <div className="-z-10 flex max-w-[50vh] items-center justify-center overflow-hidden align-middle lg:max-w-full">
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
