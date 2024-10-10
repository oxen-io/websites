'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type RouterResetInputProps = {
  id: string;
  className?: string;
};

export default function RouterResetInput({ id, className }: RouterResetInputProps) {
  const pathname = usePathname();

  const setCheckboxToFalse = () => {
    const input = document.getElementById(id);
    if (input && 'checked' in input) {
      if (input.checked) {
        input.checked = false;
      }
    }
  };

  useEffect(() => {
    setCheckboxToFalse();
  }, [pathname]);
  return <input id={id} type="checkbox" className={className} />;
}
