'use client'

import { checker, solution, source } from '../source-code/mad-scientist.solc'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

const DepositUi = dynamic(() => import('./deposit-ui'), { ssr: false })

const Editor = dynamic(() => import('@/components/solc/Editor'), { ssr: false })

export default function FillBottleExample() {
  return (
    <SolidityContextProvider>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="col-span-2">
          <Editor sourceCode={source} height="900px" checker={checker} />
        </div>
        <div className="col-span-1">
          <DepositUi />
        </div>
      </div>
    </SolidityContextProvider>
  )
}
