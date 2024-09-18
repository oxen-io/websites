import { getRemoteFeatureFlagContent, getRemoteFeatureFlags } from '@/lib/feature-flags-server';
import { REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import { Banner } from '@session/ui/components/Banner';
import { RegistrationPausedInfo } from '@/components/RegistrationPausedInfo';
import { NewTokenContractInfo } from '@/components/NewTokenContractInfo';
import { ClaimRewardsDisabledInfo } from '@/components/ClaimRewardsDisabledInfo';

export default async function RemoteBanner() {
  /**
   *  We don't need to handle any errors from the remote flag functions as any errors are handled
   *  in the function call and call happens on the same thread as this is server-side rendered.
   */
  const enabledFlags = new Set((await getRemoteFeatureFlags()).flags);

  // If the custom banner is enabled, fetch the content of the banner
  const customBanner = enabledFlags.has(REMOTE_FEATURE_FLAG.CUSTOM_BANNER)
    ? (await getRemoteFeatureFlagContent(REMOTE_FEATURE_FLAG.CUSTOM_BANNER)).content ?? null
    : null;

  return (
    <>
      {customBanner ? (
        <Banner>
          <span>{customBanner}</span>
        </Banner>
      ) : null}
      {enabledFlags.has(REMOTE_FEATURE_FLAG.NEW_TOKEN_CONTRACT) ? (
        <Banner>
          <NewTokenContractInfo />
        </Banner>
      ) : null}
      {enabledFlags.has(REMOTE_FEATURE_FLAG.DISABLE_CLAIM_REWARDS) ? (
        <Banner>
          <ClaimRewardsDisabledInfo />
        </Banner>
      ) : null}
      {enabledFlags.has(REMOTE_FEATURE_FLAG.DISABLE_NODE_REGISTRATION) ? (
        <Banner>
          <RegistrationPausedInfo />
        </Banner>
      ) : null}
    </>
  );
}
