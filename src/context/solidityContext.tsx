'use client'

import { CompilerOutput } from '@/lib/interfaces'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { VM } from '@ethereumjs/vm'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Account, Address, hexToBytes } from '@ethereumjs/util'
import { ethers } from 'ethers'
import { common, insertAccount } from './solidityContext.utils'

interface SolidityContextInterface {
  compilerOutput: CompilerOutput | null
  setCompilerOutput: (output: CompilerOutput) => void
  vm: VM | null
  account: ethers.HDNodeWallet | null
  isCompiling: boolean
  setIsCompiling: (isCompiling: boolean) => void
}

const SolidityContext = createContext<SolidityContextInterface>(
  {} as SolidityContextInterface,
)

export function SolidityContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [compilerOutput, setCompilerOutput] = useState<CompilerOutput | null>(
    null,
  )
  const [account, setAccount] = useState<ethers.HDNodeWallet | null>(null)
  const [vm, setVm] = useState<VM | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)

  useEffect(() => {
    const test = async () => {
      const vm = await VM.create({
        common: common,
      })
      const wallet = ethers.Wallet.createRandom()
      const address = Address.fromPrivateKey(hexToBytes(wallet.privateKey))
      await insertAccount(vm, address)

      setVm(vm)
      setAccount(wallet)
    }
    test()
  }, [])

  const value: SolidityContextInterface = {
    compilerOutput,
    setCompilerOutput,
    vm,
    account,
    isCompiling,
    setIsCompiling,
  }

  return (
    <SolidityContext.Provider value={value}>
      {children}
    </SolidityContext.Provider>
  )
}

export function useSolidity() {
  return useContext(SolidityContext)
}
