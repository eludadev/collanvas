import classNames from 'classnames'
import { ReactNode } from 'react'

type MessageItemProps = {
  children: ReactNode
  username: string
  color: string
  alignRight?: boolean
}

const MessageItem = ({
  children,
  username,
  color,
  alignRight,
}: MessageItemProps) => {
  return (
    <article
      className={classNames({
        'border-l-4 pl-1': !alignRight,
        'border-r-4 pr-1 text-right': alignRight,
      })}
      style={{ borderColor: color }}
    >
      <h3 className="font-bold" style={{ color }}>
        {username}
      </h3>
      {children}
    </article>
  )
}

export default MessageItem
