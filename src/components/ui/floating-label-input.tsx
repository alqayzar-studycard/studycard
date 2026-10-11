import * as React from "react"

import { cn } from "@/lib/utils"

import { Input } from "./input"
import { Textarea } from "./textarea"

type FloatingLabelInputProps = React.ComponentPropsWithoutRef<typeof Input> & {
  label: string
  containerClassName?: string
}

type FloatingLabelTextareaProps = React.ComponentPropsWithoutRef<typeof Textarea> & {
  label: string
  containerClassName?: string
}

function FloatingLabelField(props: { label: string; fieldId: string; containerClassName?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative", props.containerClassName)}>
      <label className="absolute -top-2 left-3 z-10 px-1 text-sm font-black text-secondary bg-inherit" htmlFor={props.fieldId}>
        {props.label}
      </label>
      {props.children}
    </div>
  )
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>((props, ref) => {
  const { label, id, className, containerClassName, ...inputProps } = props
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  return (
    <FloatingLabelField label={label} fieldId={inputId} containerClassName={containerClassName}>
      <Input ref={ref} id={inputId} className={cn("h-12 bg-paper px-4 py-3 text-lg font-black", className)} {...inputProps} />
    </FloatingLabelField>
  )
})
FloatingLabelInput.displayName = "FloatingLabelInput"

const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>((props, ref) => {
  const { label, id, className, containerClassName, ...textareaProps } = props
  const generatedId = React.useId()
  const textareaId = id ?? generatedId

  return (
    <FloatingLabelField label={label} fieldId={textareaId} containerClassName={containerClassName}>
      <Textarea
        ref={ref}
        id={textareaId}
        className={cn("min-h-28 resize-y bg-paper px-4 py-3 text-lg font-black", className)}
        {...textareaProps}
      />
    </FloatingLabelField>
  )
})
FloatingLabelTextarea.displayName = "FloatingLabelTextarea"

export { FloatingLabelInput, FloatingLabelTextarea }
