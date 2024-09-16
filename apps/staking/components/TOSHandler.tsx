'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@session/ui/ui/dialog';
import * as React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { TOS_LOCKED_PATHS, URL } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '@session/ui/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSubmitButton,
} from '@session/ui/components/ui/form';
import { toast } from '@session/ui/lib/toast';
import { XIcon } from '@session/ui/icons/XIcon';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { FEATURE_FLAG } from '@/lib/feature-flags';
import { useFeatureFlag } from '@/lib/feature-flags-client';
import { useSetTOS, useTOS } from '@/providers/tos-provider';

const FormSchema = z.object({
  accept: z
    .boolean()
    .default(false)
    .refine((value) => value),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export function TOSHandler() {
  const pathname = usePathname();
  const clearAcceptTOSFlag = useFeatureFlag(FEATURE_FLAG.CLEAR_ACCEPT_BUG_BOUNTY);
  const accepted = useTOS();
  const { acceptTOS } = useSetTOS();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accept: false,
    },
  });

  function onSubmit(data: FormSchemaType) {
    if (!data.accept) {
      toast.error(
        <span>
          You must accept the{' '}
          <Link href={URL.INCENTIVE_PROGRAM_TOS} className="underline" target="_blank" prefetch>
            Terms and Conditions
          </Link>{' '}
          to participate
        </span>
      );
    } else {
      toast.success(
        <span>
          You have accepted the Testnet Incentive Program{' '}
          <Link href={URL.INCENTIVE_PROGRAM_TOS} className="underline" target="_blank" prefetch>
            Terms and Conditions
          </Link>
          .
        </span>
      );
      acceptTOS(true);
    }
  }

  useEffect(() => {
    if (clearAcceptTOSFlag) {
      acceptTOS(false);
    }
  }, [clearAcceptTOSFlag]);

  return (
    <Dialog open={!accepted && TOS_LOCKED_PATHS.some((path) => pathname.startsWith(path))}>
      <DialogContent hideCloseButton className="bg-session-black text-session-white">
        <DialogHeader>
          <DialogTitle>
            Incentivised Testnet Terms{' '}
            <Link
              href="/"
              prefetch
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Link>
          </DialogTitle>
          <DialogDescription className="text-session-white">
            By accessing or using the Session Testnet Software, you agree to comply with and be
            bound by the{' '}
            <Link
              href={URL.INCENTIVE_PROGRAM_TOS}
              className="text-session-green"
              target="_blank"
              prefetch
            >
              Terms and Conditions
            </Link>
            . Please read these Terms carefully. If you do not agree to these Terms, you must not
            use the Software or attempt to participate in the Program.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accept"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 text-xs">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="leading-none">
                    I have read, understand, and agree to the{' '}
                    <Link
                      href={URL.INCENTIVE_PROGRAM_TOS}
                      target="_blank"
                      className="text-session-green"
                      prefetch
                    >
                      Terms and Conditions
                    </Link>
                    , including any additional guidelines and future modifications outlined therein.
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormSubmitButton data-testid={ButtonDataTestId.Agree_TOS}>Continue</FormSubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
