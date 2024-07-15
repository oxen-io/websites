'use client';

import { preferredChain } from '@/lib/constants';
import { SpecialDataTestId } from '@/testing/data-test-ids';
import { CHAIN } from '@session/contracts/chains';
import { Banner } from '@session/ui/components/Banner';
import { useWallet, useWalletChain } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { SwitchChainErrorType } from 'viem';
import { toast } from '@session/ui/lib/sonner';

export default function ChainBanner() {
  const { isConnected } = useWallet();
  const { chain, switchChain } = useWalletChain();
  const dictionary = useTranslations('chainBanner');
  const generalDictionary = useTranslations('wallet.networkDropdown');

  // TODO - handle specific errors
  const handleError = (error: SwitchChainErrorType) => {
    toast.error(generalDictionary('errorNotSupported'));
  };

  const handleClick = async () => {
    await switchChain(preferredChain, handleError);
  };

  const isUnsupportedChain = useMemo(
    () => isConnected && chain !== CHAIN.MAINNET && chain !== CHAIN.TESTNET,
    [chain, isConnected]
  );

  return isUnsupportedChain ? (
    <Banner>
      <span>
        {dictionary.rich('unsupportedChain', {
          link: (chunks) => (
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
  const generalDictionary = useTranslations('wallet.networkDropdown');

  // TODO - handle specific errors
  const handleError = (error: SwitchChainErrorType) => {
    toast.error(generalDictionary('errorNotSupported'));
  };

  const handleClick = () => {
    switchChain(CHAIN.TESTNET, handleError);
  };

  const isMainnet = useMemo(() => isConnected && chain === CHAIN.MAINNET, [chain, isConnected]);

  return isMainnet ? (
    <Banner>
      <span>
        {dictionary.rich('mainnetNotLive', {
          link: (children) => (
            <a
              role="button"
              data-testid={SpecialDataTestId.Mainnet_Not_Live_Link}
              onClick={handleClick}
              className="underline"
            >
              {children}
            </a>
          ),
        })}
      </span>
    </Banner>
  ) : null;
}
