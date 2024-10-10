'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const MAX_VALUE = 100
const INCREMENT = 10
const ANIMATION_DURATION = 1500 // ms

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function DepositUi() {
  const [value, setValue] = useState(0)
  const [displayValue, setDisplayValue] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [displayRewards, setDisplayRewards] = useState(0)
  const [fillHeight, setFillHeight] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)
  const startRewardsRef = useRef(0)
  const targetValueRef = useRef(0)
  const targetRewardsRef = useRef(0)

  const deposit = () => {
    if (value < MAX_VALUE) {
      const newValue = Math.min(value + INCREMENT, MAX_VALUE)
      setValue(newValue)
      targetValueRef.current = newValue
      const newRewards = rewards + Math.floor(INCREMENT / 2)
      setRewards(newRewards)
      targetRewardsRef.current = newRewards
      startAnimation()
    }
  }

  const reset = () => {
    setValue(0)
    setDisplayValue(0)
    setRewards(0)
    setDisplayRewards(0)
    setFillHeight(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    startTimeRef.current = null
    startValueRef.current = displayValue
    startRewardsRef.current = displayRewards
    animationRef.current = requestAnimationFrame(animateStep)
  }

  const animateStep = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    const easedProgress = easeOutQuart(progress)

    const newDisplayValue = Math.round(
      startValueRef.current + (targetValueRef.current - startValueRef.current) * easedProgress
    )
    setDisplayValue(newDisplayValue)

    const newDisplayRewards = Math.round(
      startRewardsRef.current + (targetRewardsRef.current - startRewardsRef.current) * easedProgress
    )
    setDisplayRewards(newDisplayRewards)

    const newFillHeight = (targetValueRef.current / MAX_VALUE) * 100
    setFillHeight(startValueRef.current / MAX_VALUE * 100 + (newFillHeight - startValueRef.current / MAX_VALUE * 100) * easedProgress)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateStep)
    } else {
      animationRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
        <motion.div
          className="text-2xl font-bold text-center mb-2 text-green-600"
          key={`rewards-${displayRewards}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          Rewards: ${displayRewards}
        </motion.div>
        <motion.div
          className="text-4xl font-bold text-center mb-6"
          key={`value-${displayValue}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          ${displayValue}
        </motion.div>
        
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            aria-label={`Money bag filled to ${Math.round(fillHeight)}%`}
          >
            <defs>
              <clipPath id="bagClip">
                <path d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10 Z" />
              </clipPath>
            </defs>
            {/* Bag Outline - always visible */}
            <path
              d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10 Z"
              fill="none"
              stroke="#8B4513"
              strokeWidth="2"
              opacity="0.3"
            />
            {/* Bag Tie - always visible */}
            <path
              d="M40 10 Q50 0 60 10"
              fill="none"
              stroke="#8B4513"
              strokeWidth="2"
              opacity="0.3"
            />
            {/* Filled portion of the bag */}
            <rect
              x="0"
              y={100 - fillHeight}
              width="100"
              height={fillHeight}
              fill="#8B4513"
              clipPath="url(#bagClip)"
            />
            {/* Dollar Sign */}
            <text
              x="50"
              y="60"
              fontSize="40"
              fontWeight="bold"
              fill="#FFD700"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              $
            </text>
          </svg>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={deposit} 
            disabled={value >= MAX_VALUE}
            className="w-full text-lg py-6"
          >
            Deposit
          </Button>
          <Button
            onClick={reset}
            disabled={value < MAX_VALUE}
            variant="outline"
            className="w-full text-lg py-6"
          >
            Reset
          </Button>
        </div>
        
        {value >= MAX_VALUE && (
          <p className="text-center mt-4 text-green-600 font-semibold">
            Maximum deposit reached!
          </p>
        )}
      </div>
    </div>
  )
}