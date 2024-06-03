import { cn } from '../lib/utils';
import './loading.css';

export const Loading = ({ global, absolute }: { global?: boolean; absolute?: boolean }) => {
  return (
    <div
      className={cn(
        'align-center flex items-center justify-center',
        global && 'h-screen w-screen',
        absolute && 'absolute'
      )}
    >
      <div>
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
