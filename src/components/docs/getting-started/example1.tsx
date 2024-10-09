'use client'

import { HELLOWORLD_SOLC, checker } from '@/source-code/helloworld.solc'
import { Editor } from '@/components/solc/Editor'
import { SolidityContextProvider } from '@/context/solidityContext'
import Example1Executor from './example1.executor'

export default function Example1() {
  return (
    <SolidityContextProvider>
      <Editor sourceCode={HELLOWORLD_SOLC} checker={checker} />
      <Example1Executor />
    </SolidityContextProvider>
  )
}
