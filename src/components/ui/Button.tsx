import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'md' | 'lg' | 'icon'

type ConflictingHandlers =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-wine-400 to-wine-600 text-cream-100 shadow-glow hover:from-wine-300 hover:to-wine-500',
  secondary:
    'bg-ink-700 text-cream-100 border border-ink-500 hover:bg-ink-600',
  outline:
    'border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400',
  ghost: 'text-cream-200 hover:bg-ink-700/60',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
  icon: 'h-11 w-11',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={props.type ?? 'button'}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-wine-400 disabled:hover:to-wine-600',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'
