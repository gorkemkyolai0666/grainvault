import { cn } from '@/lib/utils';
const variants = {
  default: 'bg-amber/15 text-amber-dark border-amber/30',
  secondary: 'bg-sage/15 text-sage-dark border-sage/30',
  success: 'bg-success/15 text-success border-success/30',
  outline: 'border-border text-muted-foreground',
} as const;
export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)} {...props} />;
}
