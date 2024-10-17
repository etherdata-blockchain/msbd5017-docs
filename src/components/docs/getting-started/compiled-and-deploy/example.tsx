'use client'

import { checker, source } from '../../source-code/compile-and-deploy.solc'
import dynamic from 'next/dynamic'

const ContractInteract = dynamic(() => import('./interact-area'), {
  ssr: false,
})

const Editor = dynamic(() => import('@/components/solc/Editor'), { ssr: false })

export default function CompiledAndDeploy() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="col-span-2">
          <Editor sourceCode={source} height="500px" checker={checker} />
        </div>
        <div className="col-span-1">
          <ContractInteract />
        </div>
      </div>
    </div>
  )
}
