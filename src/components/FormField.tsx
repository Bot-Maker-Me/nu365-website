import type { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  label: string;
  name: string;
  icon?: LucideIcon;
  type?: string;
  placeholder?: string;
  required?: boolean;
  /** When set, renders a textarea with this many rows instead of an input. */
  rows?: number;
};

const fieldClass = 'border-[#1F1F2E] bg-secondary/20';

/** Label + input (or textarea). Uncontrolled: read values with `new FormData(form)`. */
export function FormField({ label, name, icon: Icon, rows, ...props }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </Label>
      {rows ? (
        <Textarea id={name} name={name} rows={rows} className={`${fieldClass} resize-none`} {...props} />
      ) : (
        <Input id={name} name={name} className={fieldClass} {...props} />
      )}
    </div>
  );
}

/** Hidden field that real visitors never fill in; bots do. The API drops submissions that have it. */
export function Honeypot() {
  return <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />;
}
