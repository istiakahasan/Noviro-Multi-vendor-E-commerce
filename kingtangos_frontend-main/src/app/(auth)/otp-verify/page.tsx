"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

type OtpFormValues = { code: string[] };

const OTP_LENGTH = 6;
const COUNTDOWN_SEC = 90;

export default function OtpVerify() {
  const { control, handleSubmit, setValue, getValues } = useForm<OtpFormValues>({
    defaultValues: { code: Array(OTP_LENGTH).fill("") },
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC);
  const isExpired = seconds <= 0;

  // Countdown timer
  useEffect(() => {
    if (isExpired) return;
    
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isExpired]);

  const handleChange = useCallback((idx: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    setValue(`code.${idx}`, digit);
    
    if (digit && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }, [setValue]);

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = getValues(`code.${idx}`);
    
    switch(e.key) {
      case "Backspace":
        if (!currentValue && idx > 0) {
          inputsRef.current[idx - 1]?.focus();
        }
        break;
      case "ArrowLeft":
        if (idx > 0) inputsRef.current[idx - 1]?.focus();
        break;
      case "ArrowRight":
        if (idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
        break;
    }
  }, [getValues]);

  const onSubmit = useCallback((data: OtpFormValues) => {
    const joinedCode = data.code.join("");
    
    if (joinedCode.length !== OTP_LENGTH) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    
    console.log("OTP SUBMIT →", { code: joinedCode });
    toast.success("Code submitted!");
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 text-center">
          <div className="text-xl font-semibold">Reset Your Password</div>
          <p className="mt-1 text-xs text-gray-500">
            Enter the 6-digit verification code sent to your email.
          </p>
          <p className="mt-1 text-xs text-rose-500">
            This code will expire in {mm}:{ss}
          </p>
        </div>

        <label className="mb-2 block text-xs text-gray-600">Enter Your Code</label>

        <div className="mb-5 flex items-center justify-between gap-2">
          {Array.from({ length: OTP_LENGTH }, (_, i) => (
            <Controller
              key={i}
              control={control}
              name={`code.${i}`}
              render={({ field: { value } }) => (
                <input
                  ref={el => { inputsRef.current[i] = el; }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  value={value}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-11 w-11 rounded-md border border-gray-300 text-center text-lg outline-none transition focus:border-gray-900"
                  disabled={isExpired}
                />
              )}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
          disabled={isExpired}
        >
          Submit
        </button>
      </form>
    </div>
  );
}