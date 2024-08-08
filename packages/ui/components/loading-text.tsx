import './loading-text.css';
import { cn } from '../lib/utils';

export const LoadingText = ({ className }: { className: string }) => {
  return (
    <div className={cn('lds-ellipsis', className)}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
