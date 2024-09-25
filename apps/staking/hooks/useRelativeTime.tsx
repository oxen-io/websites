import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '@/lib/locale-client';
import { formatDistanceToNowStrict, FormatDistanceToNowStrictOptions } from 'date-fns';
import { getDateFnsLocale } from '@/lib/locale-util';

/**
 * Returns the time to next unit change (e.g. 1000 for seconds, 60_000 for minutes)
 * @param diffInSeconds - The difference in seconds between the current time and the target date
 *
 * If the time difference is less than 60_000 seconds (1 minute), the function returns 1000 (1 second).
 * Otherwise, it returns 60_000 (1 minute).
 */
function getTimeToNextUnitChange(diffInSeconds?: number) {
  return diffInSeconds && diffInSeconds < 60_000 ? 1000 : 60_000;
}

/**
 * Returns an updating relative time string based on the target date and the current time.
 *
 * If the timer is showing a time that is less than 60 seconds, (eg: `in 58 seconds`) it will
 * update the relative time string every second. So the timer will tick down every second.
 *
 * If the timer is showing a time that is greater than 60 seconds, (eg: `in 50 minutes`) it will
 * update the relative time string every minute. So the timer will tick down every minute.
 *
 * NOTE: Timers in the hours, days, weeks, months, and years units will also update every minute.
 *
 * @param targetDate - The target date to calculate the relative time from.
 * @param options - The options to pass to the date-fns formatDistanceToNowStrict function.
 * @returns The relative time string.
 */
export default function useRelativeTime(
  targetDate?: Date | null,
  options?: Omit<FormatDistanceToNowStrictOptions, 'locale'>
) {
  const locale = useLocale();
  const [relativeTime, setRelativeTime] = useState<string | null>(null);

  const dateFnsLocale = useMemo(() => getDateFnsLocale(locale), [locale]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    function updateRelativeTime() {
      let diffInMs: number | undefined;
      if (targetDate) {
        diffInMs = Math.abs(targetDate.getTime() - Date.now());

        /**
         * NOTE: We cant use {@link formatLocalizedRelativeTimeToNowClient} here because it requires
         * the {@link useLocale} hook to be called. For some reason the localization library builders
         * didn't create a `getLocale` function for client-side usage.
         * TODO: Create a getLocale function for client-side usage.
         */
        const formatted = formatDistanceToNowStrict(targetDate, {
          ...options,
          locale: dateFnsLocale,
        });
        setRelativeTime(formatted);
      }

      const timeToNextChange = getTimeToNextUnitChange(diffInMs);
      timer = setTimeout(updateRelativeTime, timeToNextChange);
    }

    updateRelativeTime();

    return () => {
      clearTimeout(timer);
    };
  }, [targetDate]);

  return relativeTime;
}
