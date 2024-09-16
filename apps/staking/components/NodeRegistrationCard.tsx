'use client';

import { ButtonDataTestId } from '@/testing/data-test-ids';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes } from 'react';
import type { Registration } from '@session/sent-staking-js/client';
import { InfoNodeCard, NodeItem, NodeItemLabel, NodeItemValue } from '@/components/InfoNodeCard';

const NodeRegistrationCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: Registration }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.pending');
  const titleFormat = useTranslations('modules.title');

  const { pubkey_ed25519: pubKey, type: nodeType } = node;

  // TODO - Include feature when we have user preference support
  /*const hideRegistrationsEnabled = useExperimentalFeatureFlag(
    EXPERIMENTAL_FEATURE_FLAG.HIDE_REGISTRATIONS
  );
  const hiddenPreparedRegistrations = useUserPreference('hiddenPreparedRegistrations');
  const { setUserPreference } = useSetUserPreference();
  const [toggleHiddenButtonFocused, setToggleHiddenButtonFocused] = useState<boolean>(false);


  const hidden = useMemo(
    () => hiddenPreparedRegistrations?.includes(pubKey),
    [hiddenPreparedRegistrations?.length, pubKey]
  );

  const handleHideButtonClick = () => {
    if (toggleHiddenButtonFocused) {
      if (hidden) {
        const newHiddenList = hiddenPreparedRegistrations?.filter((key) => key !== pubKey) ?? [];
        setUserPreference('hiddenPreparedRegistrations', newHiddenList);
      } else {
        const newHiddenList = new Set([...(hiddenPreparedRegistrations ?? []), pubKey]);
        setUserPreference('hiddenPreparedRegistrations', [...newHiddenList]);
      }
      setToggleHiddenButtonFocused(false);
    } else {
      setToggleHiddenButtonFocused(true);
    }
  };*/

  return (
    <InfoNodeCard
      ref={ref}
      className={className}
      pubKey={pubKey}
      /*buttonSiblings={
        hideRegistrationsEnabled ? (
          <Button
            variant={hidden ? 'outline' : 'destructive-outline'}
            size="sm"
            rounded="md"
            onClick={handleHideButtonClick}
            onBlur={() => setToggleHiddenButtonFocused(false)}
            data-testid={ButtonDataTestId.Hide_Prepared_Registration}
            className="group inline-flex gap-1 align-middle"
          >
            {hidden ? (
              <EyeIcon className="stroke-session-green group-hover:stroke-session-black h-5 w-5" />
            ) : (
              <EyeOffIcon className="stroke-destructive group-hover:stroke-session-black h-5 w-5" />
            )}
            {toggleHiddenButtonFocused ? (
              <span className="group-hover:text-session-black mt-0.5">
                {hidden ? 'Show' : 'Hide'}
              </span>
            ) : null}
          </Button>
        ) : null
      }*/
      button={{
        ariaLabel: dictionary('registerButton.ariaLabel'),
        text: dictionary('registerButton.text'),
        dataTestId: ButtonDataTestId.Node_Card_Register,
        link: `/register/${pubKey}`,
      }}
      {...props}
    >
      <NodeItem>
        <NodeItemLabel>{titleFormat('format', { title: dictionary('type') })}</NodeItemLabel>
        <NodeItemValue>{dictionary(nodeType === 'solo' ? 'solo' : 'multi')}</NodeItemValue>
      </NodeItem>
    </InfoNodeCard>
  );
});

NodeRegistrationCard.displayName = 'NodeRegistrationCard';

export { NodeRegistrationCard };
