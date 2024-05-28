import { cn } from '../lib/utils';
import './loading.css';

export const Loading = ({ global, absolute }: { global?: boolean; absolute?: boolean }) => {
  return (
    <div
      className={cn(
        'flex align-center justify-center items-center',
        global && 'w-screen h-screen',
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
