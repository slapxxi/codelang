import { cn } from '~/utils';

type ShimmerProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Shimmer: React.FC<ShimmerProps> = (props) => {
  const { className, children } = props;

  return (
    <div
      className={cn(
        'shimmer w-max bg-gray-200/90 text-transparent animate-shimmer shimmer-color-white rounded [&_*]:opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};
