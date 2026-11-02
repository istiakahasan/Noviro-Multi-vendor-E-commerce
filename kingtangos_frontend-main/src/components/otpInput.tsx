"use client"

import { useId } from "react"
import { OTPInput, SlotProps } from "input-otp"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>OTP input (spaced)</Label>
      <OTPInput
        id={id}
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        maxLength={4}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
      <p
        className="mt-2 text-xs text-neutral-500"
        role="region"
        aria-live="polite"
      >
        Built with{""}
        <a
          className="underline hover:text-neutral-950 "
          href="https://github.com/guilhermerodz/input-otp"
          target="_blank"
          rel="noopener nofollow"
        >
          Input OTP
        </a>
      </p>
    </div>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-md border border-neutral-200 bg-white font-medium text-neutral-950 shadow-xs transition-[color,box-shadow]" 
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
