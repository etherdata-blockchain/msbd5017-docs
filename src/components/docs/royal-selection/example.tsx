'use client'

import { checker, solution, source } from '../source-code/royal-selection.solc'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

const EnhancedCandidateDisplay = dynamic(
  () =>
    import('./enhanced-candidate-display').then(
      (mod) => mod.EnhancedCandidateDisplay,
    ),
  { ssr: false },
)

const Editor = dynamic(() => import('@/components/solc/Editor'), { ssr: false })

export default function RoyalSelectionExample() {
  return (
    <SolidityContextProvider>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="col-span-2">
          <Editor sourceCode={source} height="900px" checker={checker} />
        </div>
        <div className="col-span-1">
          <EnhancedCandidateDisplay />
        </div>
      </div>
    </SolidityContextProvider>
  )
}
