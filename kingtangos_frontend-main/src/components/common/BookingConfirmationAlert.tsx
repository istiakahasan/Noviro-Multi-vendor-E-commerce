'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BookingConfirmationAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  isDangerous?: boolean
}

export function BookingConfirmationAlert({
  open,
  onOpenChange,
  title = 'Are you sure you want to remove this member?',
  description,
  confirmText = 'Remove',
  cancelText = 'Cancel',
  onConfirm,
  isLoading = false,
  isDangerous = true,
}: BookingConfirmationAlertProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Error during confirmation:', error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl border-0 shadow-2xl">
        {/* Icon Container */}
        <div className="flex justify-center mb-4 pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-base text-center md:text-lg font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-sm text-center md:text-base text-gray-600 mt-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* Footer with Buttons */}
        <div className="flex w-full gap-3 pt-4">
          <AlertDialogCancel 
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-4 md:py-5 text-gray-900 font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleConfirm}
            className={`flex-1 rounded-lg px-4 py-4 md:py-5 font-medium text-white transition-colors text-sm md:text-base ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                : 'bg-primary hover:bg-primary/85 disabled:bg-primary/40'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
