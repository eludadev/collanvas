import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useRef, useState } from 'react'

type MessageInputProps = {
  disabled?: boolean
  onSend: (message: string) => void
}

const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState<string>('')
  const inputElem = useRef<HTMLInputElement | null>(null)

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        onSend(message)

        // Clear input and re-focus it
        setMessage('')
        inputElem.current?.focus()
      }}
    >
      <input
        disabled={disabled}
        className="w-full rounded-full border-2 border-primary-200 bg-white px-8 py-1 shadow-lg filter placeholder:text-primary-400 disabled:brightness-90"
        placeholder="Type a message..."
        value={message}
        required
        ref={inputElem}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        disabled={disabled}
        type="submit"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/80 p-1 text-white filter hover:bg-black/60 active:bg-black/80 disabled:brightness-90"
      >
        <FontAwesomeIcon icon={solid('paper-plane')} size="xs" />
      </button>
    </form>
  )
}

export default MessageInput
