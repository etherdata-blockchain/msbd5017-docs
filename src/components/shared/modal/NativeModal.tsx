import * as React from 'react'
import { useEffect, useRef } from 'react'

type Props = {
  openModal: boolean
  closeModal: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Native modal component using latest html standards
 * @param openModal
 * @param closeModal
 * @param children
 * @param className
 * @constructor
 */
export function NativeModal({
  openModal,
  closeModal,
  children,
  className,
}: Props) {
  const ref = useRef<HTMLDialogElement>()

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [openModal])

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('click', (event) => {
      const rect = ref.current!.getBoundingClientRect()
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      if (!isInDialog) {
        closeModal()
      }
    })
  }, [closeModal])

  return (
    <dialog
      ref={ref as any}
      onCancel={closeModal}
      className={`open:animate-modalf rounded-[32px] dark:bg-[#1C1F26] ${className}`}
    >
      {children}
    </dialog>
  )
}
