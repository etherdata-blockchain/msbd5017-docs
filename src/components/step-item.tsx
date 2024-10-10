'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface StepItemProps {
  step: number
  isFirst?: boolean
  isLast?: boolean
  children: React.ReactNode
  isDone?: boolean
}

export function StepItemComponent({
  step,
  isFirst = false,
  isLast = false,
  children,
  isDone,
}: StepItemProps) {
  return (
    <div className="relative mt-5 flex items-start space-x-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ${isDone ? 'bg-green-600' : 'bg-border'}`}
        >
          {isDone ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium text-white dark:text-gray-400">
              {step + 1}
            </span>
          )}
        </div>
        {!isLast && (
          <div className="w-px grow bg-border" aria-hidden="true">
            {!isFirst && <div className="absolute h-full w-px bg-slate-300" />}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center rounded-2xl border p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
