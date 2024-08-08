import { Faucet } from '@/app/faucet/page';

interface FaucetCodePageParams {
  params: {
    referralCode: string;
  };
}

export default function FaucetCodePage({ params }: FaucetCodePageParams) {
  const { referralCode } = params;
  return <Faucet referralCode={referralCode} />;
}
