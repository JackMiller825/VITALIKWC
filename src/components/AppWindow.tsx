import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

interface AppWindowProps {
  open: boolean
  title: string
  onDismiss: () => void
  wide?: boolean
  children: ReactNode
}

export function AppWindow({ open, title, onDismiss, wide = false, children }: AppWindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const onDismissRef = useRef(onDismiss)

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      queueMicrotask(() => {
        dialog.querySelector<HTMLElement>('[data-close]')?.focus()
      })
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={wide ? 'os-dialog wide' : 'os-dialog'}
      aria-labelledby={titleId}
      onClose={() => {
        onDismissRef.current()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        if (!inside) event.currentTarget.close()
      }}
    >
      <div className="os-titlebar">
        <span className="traffic" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span id={titleId} className="os-title">
          {title}
        </span>
        <button type="button" className="close-btn" data-close onClick={() => dialogRef.current?.close()}>
          Close
        </button>
      </div>
      <div className="os-body">{children}</div>
    </dialog>
  )
}
