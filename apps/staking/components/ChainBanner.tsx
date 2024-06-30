'use client';

import { preferredChain } from '@/lib/constants';
import { SpecialDataTestId } from '@/testing/data-test-ids';
import { CHAIN } from '@session/contracts/chains';
import { Banner } from '@session/ui/components/Banner';
import { useWallet, useWalletChain } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export default function ChainBanner() {
  const { isConnected } = useWallet();
  const { chain, switchChain } = useWalletChain();
  const dictionary = useTranslations('chainBanner');

  const handleClick = () => {
    switchChain(preferredChain);
  };

  const isUnsupportedChain = useMemo(
    () => isConnected && chain !== CHAIN.MAINNET && chain !== CHAIN.TESTNET,
    [chain, isConnected]
  );

  return isUnsupportedChain ? (
    <Banner>
      <span>
        {dictionary.rich('unsupportedChain', {
          change: (chunks) => (
            <a
              role="button"
              data-testid={SpecialDataTestId.Unsupported_Chain_Link}
              onClick={handleClick}
              className="underline"
            >
              {chunks}
            </a>
          ),
        })}
      </span>
    </Banner>
  ) : (
    <MainnetNotLiveBanner />
  );
}

function MainnetNotLiveBanner() {
  const { isConnected } = useWallet();
  const { chain, switchChain } = useWalletChain();
  const dictionary = useTranslations('chainBanner');

  const handleClick = () => {
    switchChain(CHAIN.TESTNET);
  };

  const isMainnet = useMemo(() => isConnected && chain === CHAIN.MAINNET, [chain, isConnected]);

  return isMainnet ? (
    <Banner>
      <span>
        {dictionary.rich('mainnetNotLive', {
          change: (chunks) => (
            <a
              role="button"
              data-testid={SpecialDataTestId.Mainnet_Not_Live_Link}
              onClick={handleClick}
              className="underline"
            >
              {chunks}
            </a>
          ),
        })}
      </span>
    </Banner>
  ) : null;
}
