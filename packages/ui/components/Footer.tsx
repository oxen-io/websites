import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../lib/utils';
import SocialLinkList, { SocialLink } from './SocialLinkList';
import { Button, ButtonProps } from './ui/button';

const BottomJsx = ({
  footerCopyright,
  className,
}: {
  footerCopyright?: string;
  className?: string;
}) => (
  <div
    className={cn(
      'mx-0 mt-auto flex w-full flex-col items-start text-xs',
      'sm:text-sm',
      'lg:gap-1',
      className
    )}
  >
    <span className={cn('flex flex-row gap-2 whitespace-nowrap leading-tight')}>
      {footerCopyright ? <span>&copy; {footerCopyright}</span> : null}
      {footerCopyright ? <span>All rights reserved.</span> : null}
    </span>
  </div>
);

export type FooterItem = {
  title: string;
  slug?: string;
  href?: string;
};

export type FooterProps = {
  logo: { src: string; alt: string };
  menuItems: Array<FooterItem>;
  socialLinks: Array<SocialLink>;
  footerCTA?: ButtonProps;
  footerManagedBy: string;
  footerCopyright?: string;
  className?: string;
};

export function Footer(props: FooterProps) {
  const { logo, menuItems, socialLinks, footerCTA, footerManagedBy, footerCopyright, className } =
    props;

  return (
    <footer className={className}>
      <div
        className={cn(
          'grid w-full grid-cols-2 pt-10',
          'border-x-0 border-b-0 border-t-2 border-solid border-[#676767]',
          'lg:flex lg:flex-row lg:justify-between lg:pt-16'
        )}
      >
        <div className={cn('xl:w-1/3 xl:max-w-sm')}>
          <div className={cn('mb-5 flex flex-col', 'lg:mb-0 lg:w-full')}>
            <div className={cn('h-10 w-auto', 'lg:block lg:h-auto lg:w-72', 'xl:w-full')}>
              <Link href={'/'}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </Link>
            </div>
            <span
              className={cn(
                'my-6 text-xs font-medium uppercase',
                'sm:text-sm',
                'md:mt-16',
                'lg:mb-24 lg:mt-8'
              )}
            >
              {footerManagedBy}
            </span>
            <BottomJsx footerCopyright={footerCopyright} className="lg:hidden" />
          </div>
        </div>
        <div className={cn('lg:mt-2 lg:flex lg:justify-around', 'xl:w-1/3')}>
          <div
            className={cn(
              '-mt-1 ml-12 grid grid-cols-1 gap-5',
              'md:grid-cols-2',
              'lg:ml-0 lg:mt-0 lg:w-full lg:gap-x-12 lg:gap-y-0'
            )}
          >
            {menuItems.map((item, index) => {
              return (
                <div
                  key={`${item.title}-${index}`}
                  className={cn('cursor-pointer text-sm', 'sm:text-base', 'hover:text-primary')}
                >
                  {item.slug || item.href ? (
                    <Link
                      key={`${item.title}-${index}`}
                      href={item.slug ? `/${item.slug}` : item.href ?? '/'}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={cn(
            'col-span-2 mt-8 flex flex-col gap-8',
            'md:col-span-1',
            'lg:mt-0 lg:w-1/3 lg:gap-4'
          )}
        >
          {footerCTA ? (
            <Button {...footerCTA} size="lg" className="hidden max-h-10 max-w-48 lg:flex" />
          ) : null}
          <SocialLinkList
            socialLinks={socialLinks}
            className={cn('flex w-full max-w-36 flex-row flex-wrap gap-3', 'sm:max-w-none')}
          />
        </div>
      </div>
      <BottomJsx footerCopyright={footerCopyright} className={'hidden lg:flex'} />
    </footer>
  );
}
