'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSolidity } from '@/context/solidityContext'
import { Loader2, RefreshCw, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWallet } from 'web3-connect-react'

const DEPLOYED_CONTRACT_KEY = 'compile-and-deploy-contract'
const ABI_KEY = 'compile-and-deploy-abi'

export default function ContractInteract() {
  const { sdk, walletAddress } = useWallet()
  const [abi, setAbi] = useState<any>()
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const { compilerOutput, isCompiling } = useSolidity()

  const deployContract = async () => {
    if (!sdk || !sdk.provider) {
      return
    }
    try {
      setIsDeploying(true)
      const contract = compilerOutput?.contracts['contract.sol']?.['MyToken']

      if (!contract) {
        throw new Error('Contract not found')
      }
      const address = await sdk
        .deployContract(contract.abi, contract.evm.bytecode.object)
        .finally(() => setIsDeploying(false))
      sessionStorage.setItem(DEPLOYED_CONTRACT_KEY, address)
      sessionStorage.setItem(ABI_KEY, JSON.stringify(contract.abi))
      setContractAddress(address)
      setAbi(contract.abi)
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    }
  }

  const deleteContract = () => {
    sessionStorage.removeItem(DEPLOYED_CONTRACT_KEY)
    sessionStorage.removeItem(ABI_KEY)
    setContractAddress(null)
    setAbi(null)
  }

  useEffect(() => {
    const contractAddress = sessionStorage.getItem(DEPLOYED_CONTRACT_KEY)
    const abi = sessionStorage.getItem(ABI_KEY)
    setContractAddress(contractAddress)
    setAbi(abi ? JSON.parse(abi) : null)
  }, [sdk, walletAddress, sdk.provider, contractAddress])

  return (
    <Card className="h-full w-full px-2">
      <CardHeader>
        <CardTitle className="flex w-full flex-row flex-wrap justify-between text-2xl font-bold">
          <span>Interact with Contract</span>
          <Button
            variant={'outline'}
            onClick={deleteContract}
            disabled={!contractAddress}
          >
            <Trash />
          </Button>
        </CardTitle>
      </CardHeader>
      {!contractAddress && (
        <CardContent>
          <Button
            onClick={deployContract}
            disabled={
              isDeploying ||
              !sdk ||
              !sdk.provider ||
              !compilerOutput ||
              isCompiling
            }
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              'Deploy Contract'
            )}
          </Button>
        </CardContent>
      )}
      {contractAddress && (
        <InteractArea contractAddress={contractAddress} abi={abi} />
      )}
    </Card>
  )
}

export function InteractArea({
  contractAddress,
  abi,
}: {
  contractAddress: string
  abi: any
}) {
  const [value, setValue] = useState<string>('')
  const [currentBalance, setCurrentBalance] = useState<string>('')
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const { sdk, walletAddress } = useWallet()

  useEffect(() => {
    getBalance()
  }, [sdk, walletAddress, sdk.provider, contractAddress])

  const getBalance = async () => {
    if (!walletAddress || !sdk || !sdk.provider || !contractAddress) {
      return
    }
    if (!abi) {
      return
    }
    try {
      setIsRefreshing(true)
      const result = await sdk.callContractMethod(
        contractAddress,
        abi,
        'balanceOf',
        [walletAddress],
      )
      setCurrentBalance(result)
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const mint = async () => {
    if (!walletAddress || !sdk || !sdk.provider || !contractAddress) {
      return
    }
    if (!abi) {
      return
    }
    try {
      setIsMinting(true)
      await sdk.callContractMethod(contractAddress, abi, 'mint', [
        walletAddress,
        value,
      ])
      await getBalance()
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Enter an amount
        </label>
        <Input
          id="amount"
          placeholder="Enter an amount"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Current balance: {currentBalance}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={getBalance}
          disabled={
            isRefreshing || !walletAddress || !sdk || !sdk.provider || !abi
          }
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="sr-only">Refresh balance</span>
        </Button>
      </div>
      <Button
        className="w-full"
        onClick={() => mint()}
        disabled={
          isMinting ||
          value.length === 0 ||
          !walletAddress ||
          !sdk ||
          !sdk.provider ||
          !abi
        }
      >
        {isMinting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          'Mint'
        )}
      </Button>
      <hr />
      <span className="mt-2 text-xs">
        Contract Address: <span className="text-xs">{contractAddress}</span>
      </span>
    </CardContent>
  )
}
