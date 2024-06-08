'use client';
import { preferredChain } from '@/lib/constants';
import { SpecialDataTestId } from '@/testing/data-test-ids';
import { CHAIN } from '@session/contracts/chains';
import { useWalletChain } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';

export default function ChainBanner() {
  const { chain, switchChain } = useWalletChain();
  const dictionary = useTranslations('chainBanner');

  const handleClick = () => {
    switchChain(preferredChain);
  };

  const invalidChain = chain && chain !== CHAIN.MAINNET && chain !== CHAIN.TESTNET;

  return invalidChain ? (
    <div className="bg-session-green text-session-black flex flex-wrap items-center justify-around p-2 text-sm">
      <span>
        {dictionary.rich('unsupportedChain', {
          change: (chunks) => (
            <a
              role="button"
              aria-label={dictionary('ariaUnsupportedChain')}
              data-testid={SpecialDataTestId.Unsupported_Chain_Link}
              onClick={handleClick}
              className="underline"
            >
              {chunks}
            </a>
          ),
        })}
      </span>
    </div>
  ) : null;
}
