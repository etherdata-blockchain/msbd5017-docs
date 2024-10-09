'use client'
import { compile } from '@/app/actions'
import { CircleAlertIcon, CircleCheck, Loader2 } from 'lucide-react'
import monaco, { editor } from 'monaco-editor'
import dynamic from 'next/dynamic'
import { useCallback, useRef, useState, useEffect } from 'react'
import { Button } from '../Button'
import { Transition } from '@headlessui/react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

interface EditorProps {
  sourceCode?: string
}

const compilationDelay = 1000
const debounce = 1000

const offsetToLineColumn = (offset: number, code: string) => {
  const lines = code.split('\n')
  let lineNumber = 1
  let columnNumber = 1
  let currentOffset = 0

  for (const line of lines) {
    if (currentOffset + line.length + 1 > offset) {
      columnNumber = offset - currentOffset + 1
      break
    }
    currentOffset += line.length + 1
    lineNumber++
  }

  return { lineNumber, columnNumber }
}

export function Editor({ sourceCode }: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)
  const [code, setCode] = useState(sourceCode)
  const [isCompiling, setIsCompiling] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [success, setSuccess] = useState(false)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const compileSourceCode = useCallback(async (sourceCode: string) => {
    if (isCompiling) {
      return
    }
    setIsCompiling(true)
    setHasErrors(false)
    setSuccess(false)
    const result = await compile(sourceCode)
      .then((result) => {
        return result
      })
      .catch((error) => {
        setIsCompiling(false)
        alert(error.message)
        throw error
      })
      .finally(() => {
        setTimeout(() => {
          setIsCompiling(false)
        }, compilationDelay)
      })

    // set errors
    if (result.errors && result.errors.length > 0) {
      console.log(result.errors)
      setHasErrors(true)
      result.errors.forEach((error) => {
        if (editorRef.current && monacoRef.current) {
          const model = editorRef.current.getModel()
          if (model && error.sourceLocation) {
            const sourceCode = editorRef.current.getValue()
            const start = offsetToLineColumn(
              error.sourceLocation.start,
              sourceCode,
            )
            const end = offsetToLineColumn(error.sourceLocation.end, sourceCode)

            monacoRef.current.editor.setModelMarkers(model, 'compiler', [
              {
                startLineNumber: start.lineNumber,
                startColumn: start.columnNumber,
                endLineNumber: end.lineNumber,
                endColumn: end.columnNumber,
                message: error.formattedMessage,
                severity: monacoRef.current.MarkerSeverity.Error,
              },
            ])
          }
        }
      })
    } else {
      // Clear markers if no errors
      setSuccess(true)
      setHasErrors(false)
      if (editorRef.current && monacoRef.current) {
        const model = editorRef.current.getModel()
        if (model) {
          monacoRef.current.editor.setModelMarkers(model, 'compiler', [])
        }
      }
    }
  }, [])

  const debouncedCompile = useCallback(
    (sourceCode: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        compileSourceCode(sourceCode)
      }, debounce) // 1 second delay
    },
    [compileSourceCode],
  )

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      // Add custom keybinding
      editorRef.current.addCommand(
        monacoRef.current.KeyMod.CtrlCmd |
          monacoRef.current.KeyMod.Shift |
          monacoRef.current.KeyCode.KeyS,
        () => {
          const sourceCode = editorRef.current?.getValue()
          if (sourceCode) {
            compileSourceCode(sourceCode)
          }
        },
      )
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [compileSourceCode])

  return (
    <div className="relative rounded-xl border p-5">
      <MonacoEditor
        height={'600px'}
        language="sol"
        defaultValue={sourceCode}
        onChange={(value) => {
          setCode(value)
          if (value) {
            debouncedCompile(value)
          }
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
        }}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
      <Button
        disabled={isCompiling}
        onClick={async () => {
          if (editorRef.current) {
            const sourceCode = editorRef.current.getValue()
            await compileSourceCode(sourceCode)
          }
        }}
        className={`${hasErrors ? 'bg-red-500 hover:bg-red-400' : ''} ${success ? '!bg-green-500' : ''}`}
      >
        <div
          className={`relative h-8 ${isCompiling ? 'w-8' : hasErrors ? 'w-52' : 'w-52'} ${success ? '!w-42' : ''} overflow-hidden transition-all`}
        >
          <Transition
            show={isCompiling}
            enter="transition-all duration-300 ease-in-out"
            enterFrom="opacity-0 translate-x-full scale-50"
            enterTo="opacity-100 translate-x-0 scale-100"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="opacity-100 translate-x-0 scale-100"
            leaveTo="opacity-0 translate-x-full scale-50"
          >
            <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 transform">
              <Loader2 className="animate-spin" />
            </div>
          </Transition>
          <Transition
            show={!isCompiling}
            enter="transition-all duration-300 ease-in-out"
            enterFrom="opacity-0 -translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-full"
          >
            <span className="absolute left-0 top-1/2 flex -translate-y-1/2 transform flex-row items-start justify-start whitespace-nowrap">
              {hasErrors && (
                <>
                  <CircleAlertIcon />
                  <span className="ml-2">Source contains errors</span>
                </>
              )}{' '}
              {success && (
                <>
                  <CircleCheck className="mr-1 shrink-0" />
                  <span>Compiled successfully</span>
                </>
              )}
              {!hasErrors && !success && 'Compile (Cmd/Ctrl + Shift + S)'}
            </span>
          </Transition>
        </div>
      </Button>
    </div>
  )
}
