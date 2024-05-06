import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children?: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  resetStyles?: boolean;
};

export default function Container({ children, className, resetStyles, as = 'div' }: ContainerProps) {
  const Component = as;
  return <Component className={cn(!resetStyles && 'container mx-auto px-4', className)}>{children}</Component>;
}
