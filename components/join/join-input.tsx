import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import classNames from 'classnames'
import styles from 'styles/JoinInput.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

type JoinInputProps = {
  onChange: (value: string) => void
  onShuffle: () => void
  value: string
  autoFocus?: boolean
  required?: boolean
  children: ReactNode
}

const JoinInput = ({
  children,
  autoFocus,
  required,
  value,
  onChange,
  onShuffle,
}: JoinInputProps) => {
  const inputElem = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (autoFocus) {
      inputElem.current?.focus()
    }
  }, [])

  return (
    <div className={classNames('relative', styles.inputGroup)}>
      <input
        ref={inputElem}
        required={required}
        value={value}
        placeholder={children?.toString()}
        className="w-full rounded-md border-4 border-primary-200 py-2 px-3 pr-12 text-lg transition-transform focus:-translate-y-1 focus:shadow-lg focus:outline-none"
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        title="Shuffle"
        className="absolute right-0 top-0 grid aspect-square h-full place-items-center transition-transform"
        onClick={onShuffle}
      >
        <FontAwesomeIcon icon={solid('shuffle')} size="lg" />
      </button>
    </div>
  )
}

export default JoinInput
