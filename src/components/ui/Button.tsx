import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { sfx } from '../../audio/audio';

type Variant = 'primary' | 'accent' | 'soft' | 'sun';

const variants: Record<Variant, string> = {
  primary: 'bg-grape text-cream shadow-[0_6px_0_var(--color-grape-deep)]',
  accent: 'bg-berry text-cream shadow-[0_6px_0_#d93a6d]',
  sun: 'bg-sunshine text-ink shadow-[0_6px_0_#e0a500]',
  soft: 'bg-white text-ink shadow-[0_6px_0_rgba(43,33,64,0.15)] border-2 border-cream-deep',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, onClick, ...rest }: ButtonProps) {
  return (
    <button
      className={[
        'font-display font-semibold rounded-2xl px-6 py-3 text-lg',
        'transition-transform duration-100 active:translate-y-1 active:shadow-none',
        'disabled:opacity-50 disabled:active:translate-y-0',
        variants[variant],
        className,
      ].join(' ')}
      onClick={(e) => {
        sfx.click();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
