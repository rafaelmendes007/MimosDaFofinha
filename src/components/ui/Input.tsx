import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const fieldClasses =
  'w-full rounded-xl border border-ink-500 bg-ink-900/70 px-4 py-3 text-sm text-cream-100 placeholder:text-cream-400/70 transition-colors ' +
  'focus:border-gold-400/70 focus:outline-none focus:ring-2 focus:ring-gold-400/20'

interface FieldWrapperProps {
  label?: string
  error?: string
  id?: string
}

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldWrapperProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-cream-200">
            {label}
          </label>
        )}
        <input
          id={fieldId}
          ref={ref}
          className={cn(fieldClasses, error && 'border-wine-300 focus:ring-wine-300/30', className)}
          {...props}
        />
        {error && <span className="text-xs text-wine-300">{error}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldWrapperProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-cream-200">
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          className={cn(fieldClasses, 'min-h-28 resize-none', error && 'border-wine-300 focus:ring-wine-300/30', className)}
          {...props}
        />
        {error && <span className="text-xs text-wine-300">{error}</span>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
