'use client';

import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { useSession } from '@session/auth/client';
import { DiscordAuthButton } from '@session/auth/components/DiscordAuthButton';
import { TelegramAuthButton } from '@session/auth/components/TelegramAuthButton';
import { ModuleGridHeader } from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/ui/button';
import { Input } from '@session/ui/ui/input';
import { useTranslations } from 'next-intl';
import ActionModule, { ActionModuleDivider } from '../stake/ActionModule';

import { WalletAddTokenWithLocales } from '@/components/WalletAddTokenWithLocales';
import { BASE_URL, FAUCET_ERROR } from '@/lib/constants';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAIN } from '@session/contracts';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { toast } from '@session/ui/lib/sonner';
import {
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormMessage,
  FormSubmitButton,
} from '@session/ui/ui/form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { collapseString } from '@session/util/string';
import { WALLET_STATUS, useWallet, useWalletChain } from '@session/wallet/hooks/wallet-hooks';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address, isAddress } from 'viem';
import { z } from 'zod';
import { FaucetTransactions } from './FaucetTransactions';
import { transferTestTokens } from './actions';
import { TransactionHistory } from './utils';

enum FORM_STATE {
  LANDING,
  CONFIRM,
  PENDING,
  SUCCESS,
}

const FaucetTextTooltip = ({ children, tooltip }: { children: ReactNode; tooltip: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="underline">{children}</span>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
);

export const getFaucetFormSchema = () => {
  const dictionary = useTranslations('faucet.form');
  return z.object({
    walletAddress: z.string().refine((value) => isAddress(value), {
      message: dictionary('error.invalidAddress', { example: '0x...' }),
    }),
    discordId: z.string().optional(),
    telegramId: z.string().optional(),
  });
};

export type FaucetFormSchema = z.infer<ReturnType<typeof getFaucetFormSchema>>;

export const AuthModule = () => {
  const dictionary = useTranslations('faucet.form');
  const generalDictionary = useTranslations('general');
  const [submitAttemptCounter, setSubmitAttemptCounter] = useState<number>(0);
  const [formState, setFormState] = useState<FORM_STATE>(FORM_STATE.LANDING);
  const [faucetError, setFaucetError] = useState<FAUCET_ERROR | null>(null);
  const { data, status: authStatus } = useSession();
  const [transactionHash, setTransactionHash] = useState<Address | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
  const { address, disconnect, status: walletStatus } = useWallet();
  const { chain, switchChain } = useWalletChain();

  const FormSchema = getFaucetFormSchema();

  const isConnected = authStatus === 'authenticated';
  /** @ts-expect-error -- Workaround to get id */
  const discordId = data?.user?.discordId;
  /** @ts-expect-error -- Workaround to get id */
  const telegramId = data?.user?.telegramId;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      walletAddress: '',
      discordId: '',
      telegramId: '',
    },
    reValidateMode: 'onChange',
  });

  const successMessage = (hash: Address) => (
    <div className="flex flex-col text-sm font-normal">
      <span>{dictionary('submit.transactionSuccess')}</span>
      <span>{dictionary('submit.transactionSuccessDescription')}</span>
      <span>{dictionary('transactionHash', { hash })}</span>
    </div>
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.walletAddress || !isAddress(data.walletAddress)) {
      return form.setError('walletAddress', {
        type: 'manual',
        message: dictionary('error.invalidAddress', { example: '0x...' }),
      });
    }

    if (discordId) {
      data.discordId = discordId;
    }

    if (telegramId) {
      data.telegramId = telegramId;
    }

    const promise: Promise<Address> = new Promise((resolve, reject) =>
      transferTestTokens(data).then((res) => {
        if (!res) {
          return reject(dictionary('submit.transactionError'));
        }

        const { hash, error, faucetError, history } = res;

        if (history && history.length) {
          setTransactionHistory(history);
        }

        if (hash) {
          setTransactionHash(hash);
          setFormState(FORM_STATE.SUCCESS);
          return resolve(hash);
        }

        if (error) {
          if (faucetError) {
            setFaucetError(faucetError);
            if (
              !(
                faucetError === FAUCET_ERROR.FAUCET_OUT_OF_TOKENS ||
                faucetError === FAUCET_ERROR.INCORRECT_CHAIN ||
                // NOTE: The eth requirement is removed for now, keep this here in case we need it again in the future
                // faucetError === FAUCET_ERROR.INSUFFICIENT_ETH ||
                faucetError === FAUCET_ERROR.INVALID_ADDRESS
              )
            ) {
              form.setError('root', { message: error });
            }
            return reject(error);
          }
          form.setError('root', { message: error });
          return reject(error);
        }
      })
    );

    toast.promise(promise, {
      loading: dictionary('submit.checkingEligibilityText'),
      success: successMessage,
      error: (error: string) => (
        <div className="flex flex-col">
          <span>{dictionary('submit.transactionError')}</span>
          <span>{error}</span>
        </div>
      ),
    });

    await promise;
  }

  const disconnectWallet = () => {
    disconnect();
    if (formState !== FORM_STATE.LANDING) {
      setFormState(FORM_STATE.LANDING);
    }
  };

  // NOTE: The eth requirement is removed for now, keep this here in case we need it again in the future
  /* const ethAmount = useMemo(() => {
    if (typeof ethBalance === 'bigint') {
      return parseFloat(formatEther(ethBalance));
    }
    return null;
  }, [ethBalance]);

  useEffect(() => {
    if (address && ethAmount !== null && ethAmount < FAUCET.MIN_ETH_BALANCE) {
      form.setError('root', {
        type: 'deps',
        message: dictionary('error.insufficientEthTextOnly', {
          gasAmount: ethAmount ?? 0,
        }),
      });
    }
  }, [address, ethAmount, form]); */

  useEffect(() => {
    if (walletStatus === WALLET_STATUS.CONNECTED && address) {
      form.clearErrors();
      form.setValue('walletAddress', address, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
      setTransactionHash(null);
      if (chain !== CHAIN.TESTNET) {
        switchChain(CHAIN.TESTNET);
      }
    } else if (walletStatus === WALLET_STATUS.DISCONNECTED) {
      form.reset({ walletAddress: '' });
      form.clearErrors();
      setTransactionHash(null);
    }
  }, [walletStatus, chain, address, form]);

  return (
    <ActionModule className="p-2 lg:p-10" contentClassName="gap-3">
      {formState !== FORM_STATE.LANDING && formState !== FORM_STATE.SUCCESS ? (
        <span
          className="text-session-text absolute left-6 top-4 inline-flex w-min gap-1 text-sm hover:cursor-pointer hover:underline hover:brightness-125 md:top-6"
          onClick={() => setFormState(FORM_STATE.LANDING)}
        >
          <ArrowDownIcon className="fill-session-text mt-0.5 h-3 w-3 rotate-90" />
          {dictionary('back')}
        </span>
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <ModuleGridHeader />

          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <div className="flex w-full items-center gap-2">
                    <Input
                      placeholder={address ?? dictionary('inputPlaceholder')}
                      disabled={!!address}
                      className="w-full"
                      {...field}
                    />
                    {address ? (
                      <Button
                        type="reset"
                        variant="destructive-outline"
                        rounded="md"
                        className="uppercase"
                        onClick={disconnectWallet}
                        data-testid={ButtonDataTestId.Faucet_Disconnect}
                        aria-label={dictionary('disconnectWalletButtonAria')}
                      >
                        {dictionary('disconnectWalletButtonText')}
                      </Button>
                    ) : null}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formState === FORM_STATE.CONFIRM ? (
            <div className="flex flex-col gap-2">
              <p className="text-center text-sm">
                {dictionary.rich('confirm.connectedWalletInfo', {
                  address: () => (
                    <FaucetTextTooltip tooltip={address}>
                      {address ? collapseString(address, 4, 4) : null}
                    </FaucetTextTooltip>
                  ),
                })}
              </p>

              {discordId ? (
                <p className="text-center text-sm">
                  {dictionary.rich('confirm.discordDisclaimer', {
                    tooltip: (children) => (
                      <FaucetTextTooltip
                        tooltip={dictionary('confirm.discordDisclaimerUserIdTooltip')}
                      >
                        {children}
                      </FaucetTextTooltip>
                    ),
                  })}
                </p>
              ) : null}

              {telegramId ? (
                <p className="text-center text-sm">
                  {dictionary.rich('confirm.telegramDisclaimer', {
                    tooltip: (children) => (
                      <FaucetTextTooltip
                        tooltip={dictionary('confirm.telegramDisclaimerUserIdTooltip')}
                      >
                        {children}
                      </FaucetTextTooltip>
                    ),
                  })}
                </p>
              ) : null}
            </div>
          ) : null}

          {formState !== FORM_STATE.LANDING && !transactionHash ? (
            <FormSubmitButton
              data-testid={ButtonDataTestId.Faucet_Submit}
              rounded="md"
              size="lg"
              disabled={Boolean(transactionHash)}
            >
              {dictionary('submit.getTestTokensText')}
            </FormSubmitButton>
          ) : (
            /** NOTE: FormSubmitButton contaians FormErrorMessage, but we still want to render the error message when the submit button isnt visible */
            <FormErrorMessage />
          )}
        </form>
      </Form>
      {formState !== FORM_STATE.LANDING && transactionHash ? (
        <Button
          data-testid={ButtonDataTestId.Faucet_Submit}
          rounded="md"
          size="lg"
          className="hover:bg-session-green hover:text-session-black opacity-50"
          onClick={() => {
            if (transactionHash) {
              if (submitAttemptCounter > 5) {
                toast.success(dictionary('haveSomeMore'));
              } else {
                toast.error(dictionary('error.alreadyUsed'));
              }
              setSubmitAttemptCounter((prev) => prev + 1);
            }
          }}
        >
          {dictionary('submit.getTestTokensText')}
        </Button>
      ) : null}

      {formState === FORM_STATE.LANDING ? (
        <>
          <span className="text-center">- {generalDictionary('or')} -</span>
          <WalletModalButtonWithLocales rounded="md" size="lg" className="uppercase" hideBalance />
          <span className="inline-flex w-full flex-col gap-2 uppercase xl:flex-row [&>*]:flex-grow">
            {!isConnected || (isConnected && discordId) ? <DiscordAuthButton /> : null}
            {!isConnected || (isConnected && telegramId) ? <TelegramAuthButton /> : null}
          </span>
        </>
      ) : null}

      {transactionHistory && transactionHistory.length > 0 ? (
        <FaucetTransactions transactionHistory={transactionHistory} />
      ) : null}

      <ActionModuleDivider />

      {formState === FORM_STATE.LANDING ? (
        <Button
          data-testid={ButtonDataTestId.Faucet_Continue}
          rounded="md"
          size="lg"
          variant="outline"
          className="uppercase"
          disabled={
            // NOTE: The eth requirement is removed for now, keep this here in case we need it again in the future
            // (ethAmount !== null && ethAmount < FAUCET.MIN_ETH_BALANCE) ||
            !form.formState.isDirty || !form.formState.isValid
          }
          onClick={() => setFormState(FORM_STATE.CONFIRM)}
        >
          {dictionary('submit.continueText')}
        </Button>
      ) : null}

      {faucetError === FAUCET_ERROR.FAUCET_OUT_OF_TOKENS ? (
        <p className="text-destructive text-base">{dictionary('error.faucetOutOfTokens')}</p>
      ) : null}

      {faucetError === FAUCET_ERROR.INCORRECT_CHAIN ? (
        <p className="text-destructive text-base">{dictionary('error.incorrectChain')}</p>
      ) : null}

      {faucetError === FAUCET_ERROR.INVALID_ADDRESS ? (
        <p className="text-destructive text-base">{dictionary('error.invalidAddress')}</p>
      ) : null}

      {/** NOTE: The eth requirement is removed for now, keep this here in case we need it again in the future */}
      {/* {(ethAmount !== null && ethAmount < FAUCET.MIN_ETH_BALANCE) ||
      faucetError === FAUCET_ERROR.INSUFFICIENT_ETH ? (
        <p className="text-destructive text-base">
          {dictionary.rich('error.insufficientEth', {
            gasAmount: ethAmount ?? 0,
          })}
        </p>
      ) : null} */}

      {formState === FORM_STATE.SUCCESS || transactionHistory.length > 0 ? (
        <>
          <p>{dictionary('watchSENTInfo')}</p>
          <WalletAddTokenWithLocales rounded="md" size="md" variant="outline" tokenIcon={`${BASE_URL}/images/token_logo.svg`} />
        </>
      ) : null}
    </ActionModule>
  );
};
