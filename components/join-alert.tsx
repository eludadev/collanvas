import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import type { ReactNode } from 'react'

type JoinAlertProps = {
  children: ReactNode
  onClose: () => void
}

const JoinAlert = ({ children, onClose }: JoinAlertProps) => {
  return (
    <div
      role="alert"
      className="mt-12 flex items-center justify-between rounded-lg border-2 border-white py-2 px-4 text-lg font-bold text-white"
    >
      <div className="space-x-2">
        <FontAwesomeIcon icon={solid('circle-exclamation')} size="lg" />
        <span className="inline-block">{children?.toString()}</span>
      </div>
      <button className="h-8 w-8" title="Close" onClick={onClose}>
        <FontAwesomeIcon icon={solid('x')} size="xs" />
      </button>
    </div>
  )
}

export default JoinAlert
