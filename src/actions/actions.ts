'use server'
import { CompilerOutput } from '@/lib/interfaces'
import { ethers } from 'ethers'
import { cookies } from 'next/headers'
//@ts-expect-error
import solc from 'solc'

const SessionKey = 'session'

export async function compile(sourceCode: string): Promise<CompilerOutput> {
  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  }

  const output = solc.compile(JSON.stringify(input))

  return JSON.parse(output)
}

export async function session() {
  const session = cookies().get(SessionKey)

  return session?.value ? JSON.parse(session.value) : { isAuth: false }
}

export async function signOut() {
  cookies().delete(SessionKey)
}

export async function signIn(
  walletAddress: string,
  message: string,
  signature: string,
): Promise<{ error?: string }> {
  const signerAddress = ethers.verifyMessage(message, signature)
  if (signerAddress !== walletAddress) {
    return {
      error: 'Signature verification failed',
    }
  }

  cookies().set(walletAddress, JSON.stringify({ isAuth: true }), {
    maxAge: 60, // 1 minute
  })
  return {}
}

export async function storeSession(walletAddress: string, session: any) {
  // check if session is valid
  if (!cookies().has(walletAddress)) {
    return {
      error: 'Invalid session',
    }
  }

  cookies().delete(walletAddress)
  cookies().set(SessionKey, JSON.stringify(session), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  return {}
}
