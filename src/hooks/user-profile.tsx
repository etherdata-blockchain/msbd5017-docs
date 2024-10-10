'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  CopyIcon,
  CheckIcon,
  LogOutIcon,
  WalletIcon,
  UserIcon,
} from 'lucide-react'
import WalletAvatarImage from '@/components/shared/wallet/walletAvatar'

interface UserProfileProps {
  userName?: string
  userEmail?: string
  userWalletAddress: string
  userWalletBalance: string
  onSignOut: () => void
}

export default function UserProfile({
  userName = '',
  userEmail = '',
  userWalletAddress,
  userWalletBalance,
  onSignOut,
}: UserProfileProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userWalletAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="mx-auto w-full">
      <h2 className="mb-6 text-center text-2xl font-bold">User Profile</h2>
      <div className="grid gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <WalletAvatarImage walletAddress={userWalletAddress} size={120} />
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {userName || 'Anonymous User'}
            </h3>
            {userEmail && (
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-sm font-medium">
              Wallet Address
            </Label>
            <div className="flex items-center gap-2">
              <div
                id="wallet"
                className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm"
              >
                {userWalletAddress}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="shrink-0 transition-all duration-200 ease-in-out"
                onClick={copyToClipboard}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">Copy wallet address</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Wallet Balance</Label>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
              <WalletIcon className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">{userWalletBalance}</span>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6"
      >
        <Button variant="destructive" onClick={onSignOut} className="w-full">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  )
}
