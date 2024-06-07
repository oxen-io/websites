'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAIN, SENT_SYMBOL } from '@session/contracts';
import { Module, ModuleContent } from '@session/ui/components/Module';
import { Button } from '@session/ui/ui/button';
import { Input } from '@session/ui/ui/input';
import { collapseString } from '@session/util/string';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address, formatEther, isAddress } from 'viem';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { z } from 'zod';
import { sentTestSent } from './actions';

import { WalletAddTokenWithLocales } from '@/components/WalletAddTokenWithLocales';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { toast } from '@session/ui/lib/sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmitButton,
} from '@session/ui/ui/form';

export default function FaucetModule() {
  const dictionary = useTranslations('faucet');
  const [transactionHash, setTransactionHash] = useState<Address | null>(null);
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ethBalance } = useBalance({ address, query: { enabled: !!address } });

  const FormSchema = z.object({
    walletAddress: z.string().refine((value) => isAddress(value), {
      message: dictionary('form.errorInvalidAddress', { example: '0x...' }),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      walletAddress: '',
    },
  });

  const successMessage = (hash: Address) => (
    <div className="flex flex-col text-sm font-normal">
      <span>{dictionary('form.success', { tokenSymbol: SENT_SYMBOL })}</span>
      <span>{dictionary('form.transactionHash', { hash })}</span>
    </div>
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { walletAddress } = data;
    if (!walletAddress || !isAddress(walletAddress)) {
      return;
    }
    const promise = sentTestSent({ address: walletAddress, chain: CHAIN.TESTNET });
    toast.promise(promise, {
      loading: dictionary('form.loading', { tokenSymbol: SENT_SYMBOL }),
      success: successMessage,
      error: (error: Error) => (
        <div className="flex flex-col">
          <span>{dictionary('form.error', { tokenSymbol: SENT_SYMBOL })}</span>
          <span>{error?.message}</span>
        </div>
      ),
    });

    try {
      const hash = await promise;
      setTransactionHash(hash);
    } catch (error) {
      if (error instanceof Error) {
        form.setError('root', { message: error.message });
      } else {
        form.setError('root', { message: dictionary('form.error', { tokenSymbol: SENT_SYMBOL }) });
      }
    }
  }

  const disconnectWallet = () => {
    disconnect();
  };

  const ethAmount = useMemo(() => {
    if (!address || ethBalance === undefined) {
      return null;
    }
    return parseFloat(formatEther(ethBalance.value));
  }, [ethBalance, address]);

  useEffect(() => {
    if (status === 'connected') {
      form.clearErrors();
      form.setValue('walletAddress', address, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
      setTransactionHash(null);
    } else if (status === 'disconnected') {
      form.reset({ walletAddress: '' });
      form.clearErrors();
      setTransactionHash(null);
    }
  }, [status, address, form]);

  return (
    <Module className="max-w-xl items-center">
      <ModuleContent className="flex h-full flex-col items-center gap-2 align-middle font-bold">
        {address && ethAmount !== null && ethAmount <= 0.001 ? (
          <p className="text-destructive text-lg">
            {dictionary.rich('form.lowEthBalance', {
              link: (chunks) => (
                <a
                  href="https://faucet.quicknode.com/arbitrum/sepolia"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline"
                >
                  {chunks}
                </a>
              ),
              ethAmount,
            })}
          </p>
        ) : null}
        {address ? (
          <p className="text-md font-normal">
            {dictionary('connectedWalletInfo', {
              address: collapseString(address, 6, 6),
            })}
          </p>
        ) : (
          <WalletModalButtonWithLocales />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  {address ? null : <span> - {dictionary('or')} - </span>}
                  {address ? null : (
                    <FormLabel title={dictionary('form.description', { tokenSymbol: SENT_SYMBOL })}>
                      {dictionary('form.label')}
                    </FormLabel>
                  )}
                  <FormControl>
                    <div className="flex w-full items-center gap-2">
                      <Input
                        placeholder={address ?? dictionary('form.placeholder')}
                        disabled={!!address}
                        className="w-full"
                        {...field}
                      />
                      {address ? (
                        <Button
                          variant="destructive"
                          onClick={disconnectWallet}
                          data-testid={ButtonDataTestId.Faucet_Disconnect}
                        >
                          {dictionary('form.disconnectWallet')}
                        </Button>
                      ) : null}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmitButton data-testid={ButtonDataTestId.Faucet_Submit}>
              {dictionary('form.button', { tokenSymbol: SENT_SYMBOL })}
            </FormSubmitButton>
          </form>
        </Form>
        {transactionHash ? successMessage(transactionHash) : null}
        {address ? <div className="my-6 w-11/12 border" /> : null}
        {address ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-normal">
              {dictionary('addTokenInfo', { tokenSymbol: SENT_SYMBOL })}
            </p>
            <WalletAddTokenWithLocales variant="outline" />
          </div>
        ) : null}
      </ModuleContent>
    </Module>
  );
}
