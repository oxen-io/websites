import { SessionTokenIcon } from '@session/ui/icons/SessionTokenIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@session/ui/ui/avatar';
import { useWalletInfo } from '@web3modal/wagmi/react';
import { useWallet } from '../hooks/wallet-hooks';

export function ConnectedWalletAvatar({
  className,
  avatarSrc,
}: {
  className?: string;
  avatarSrc?: string | null;
}) {
  const { ensName, ensAvatar } = useWallet();
  const { walletInfo } = useWalletInfo();
  return (
    <WalletAvatar
      className={className}
      avatarSrc={avatarSrc}
      ensAvatar={ensAvatar}
      ensName={ensName}
      walletIcon={walletInfo?.icon}
      walletName={walletInfo?.name}
    />
  );
}

export function WalletAvatar({
  className,
  avatarSrc,
  ensAvatar,
  ensName,
  walletIcon,
  walletName,
}: {
  className?: string;
  avatarSrc?: string | null;
  ensAvatar?: string | null;
  ensName?: string | null;
  walletIcon?: string;
  walletName?: string;
}) {
  return (
    <Avatar className={className}>
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={ensName ?? 'Avatar'} /> : null}
      <Avatar className={className}>
        {ensAvatar ? <AvatarImage src={ensAvatar} alt={ensName ?? 'Ens Avatar'} /> : null}
        <Avatar className={className}>
          <AvatarImage src={walletIcon ?? undefined} alt={walletName ?? 'Wallet Icon'} />
          <AvatarFallback className="bg-session-black">
            <SessionTokenIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Avatar>
    </Avatar>
  );
}
