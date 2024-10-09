'use client'

import { source, checker } from '@/components/docs/source-code/helloworld.solc'
import Editor from '@/components/solc/Editor'
import Example1Executor from './example1.executor'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

export default function Example1() {
  return (
    <SolidityContextProvider>
      <Editor sourceCode={source} checker={checker} height="500px" />
      <Example1Executor />
    </SolidityContextProvider>
  )
}
