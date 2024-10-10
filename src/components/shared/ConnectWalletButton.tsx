'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { NativeModal } from './modal/NativeModal'
import { ConnectWalletModal } from './wallet/wallet-modal'
import { useWallet } from 'web3-connect-react'
import { Wallet } from 'lucide-react'

export default function ConnectWalletButton() {
  const [openModal, setOpenModal] = useState(false)
  const { isLoading, isSignedIn, walletAddress, signOut } = useWallet()

  return (
    <div>
      {isSignedIn ? (
        <Button
          disabled={isLoading}
          onClick={() => {
            setOpenModal(true)
          }}
        >
          <Wallet />
        </Button>
      ) : (
        <Button
          disabled={isLoading}
          onClick={() => {
            setOpenModal(true)
          }}
          className="connect-wallet-button"
        >
          Connect Wallet
        </Button>
      )}
      <NativeModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        className="max-w-[800px] px-10"
      >
        <ConnectWalletModal
          closeModal={() => {
            setOpenModal(false)
          }}
        />
      </NativeModal>
    </div>
  )
}
