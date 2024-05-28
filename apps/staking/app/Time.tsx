'use client';

import { formatTimeDistanceToNowClient } from '../lib/locale-client';

export function Time() {
  return <>{formatTimeDistanceToNowClient(new Date(2016, 0, 1))}</>;
}
