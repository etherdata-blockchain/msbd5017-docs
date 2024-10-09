import { Interface, defaultAbiCoder as AbiCoder } from '@ethersproject/abi'
import {
  AccessListEIP2930TxData,
  FeeMarketEIP1559TxData,
  LegacyTransaction,
  TxData,
} from '@ethereumjs/tx'
import { Account, Address } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'

type TransactionsData =
  | TxData
  | AccessListEIP2930TxData
  | FeeMarketEIP1559TxData

export const encodeFunction = (
  method: string,
  params?: {
    types: any[]
    values: unknown[]
  },
): string => {
  const parameters = params?.types ?? []
  const methodWithParameters = `function ${method}(${parameters.join(',')})`
  const signatureHash = new Interface([methodWithParameters]).getSighash(method)
  const encodedArgs = AbiCoder.encode(parameters, params?.values ?? [])

  return signatureHash + encodedArgs.slice(2)
}

export const encodeDeployment = (
  bytecode: string,
  params?: {
    types: any[]
    values: unknown[]
  },
) => {
  const deploymentData = '0x' + bytecode
  if (params) {
    const argumentsEncoded = AbiCoder.encode(params.types, params.values)
    return deploymentData + argumentsEncoded.slice(2)
  }
  return deploymentData
}

export const buildTransaction = (
  data: Partial<TransactionsData>,
): TransactionsData => {
  const defaultData: Partial<TransactionsData> = {
    nonce: BigInt(0),
    gasLimit: 2_000_000, // We assume that 2M is enough,
    gasPrice: 1,
    value: 0,
    data: '0x',
  }

  return {
    ...defaultData,
    ...data,
  }
}

/**
 *  Insert an account into the VM
 *  With a balance of 20 ETH
 * @param vm
 * @param address
 */
export const insertAccount = async (vm: VM, address: Address) => {
  const acctData = {
    nonce: 0,
    balance: BigInt(20) ** BigInt(18), // 20 ETH
  }
  const account = Account.fromAccountData(acctData)

  await vm.stateManager.putAccount(address, account)
}

export const getAccountNonce = async (
  vm: VM,
  accountPrivateKey: Uint8Array,
) => {
  const address = Address.fromPrivateKey(accountPrivateKey)
  const account = await vm.stateManager.getAccount(address)
  if (account) {
    return account.nonce
  } else {
    return BigInt(0)
  }
}

/**
 *  Deploy a contract
 * @param vm EthereumJS VM
 * @param senderPrivateKey  Private key of the sender
 * @param deploymentBytecode Bytecode of the contract to deploy
 * @returns
 */
export async function deployContract(
  vm: VM,
  senderPrivateKey: Uint8Array,
  deploymentBytecode: string,
  params?: {
    types: any[]
    values: unknown[]
  },
): Promise<Address> {
  // Contracts are deployed by sending their deployment bytecode to the address 0
  // The contract params should be abi-encoded and appended to the deployment bytecode.

  const data = encodeDeployment(deploymentBytecode, params)
  const txData = {
    data,
    nonce: await getAccountNonce(vm, senderPrivateKey),
  }

  const tx = LegacyTransaction.fromTxData(
    buildTransaction(txData as any) as any,
    {
      common,
    },
  ).sign(senderPrivateKey)

  const deploymentResult = await vm.runTx({ tx, block: block })

  if (deploymentResult.execResult.exceptionError) {
    throw deploymentResult.execResult.exceptionError
  }

  return deploymentResult.createdAddress!
}

export const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Istanbul,
})
export const block = Block.fromBlockData(
  { header: { extraData: new Uint8Array(97) } },
  { common },
)
