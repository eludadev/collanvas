import classNames from 'classnames'
import type { ReactNode } from 'react'

type ToolbarItemProps = {
  children: ReactNode
  selected?: boolean
  name: string
  onSelect: () => void
}

const ToolbarItem = ({
  children,
  selected,
  name,
  onSelect,
}: ToolbarItemProps) => {
  return (
    <button
      title={name}
      className={classNames('h-8 w-8 rounded-full', {
        'bg-secondary-400 text-white': selected,
      })}
      onClick={onSelect}
    >
      {children}
    </button>
  )
}

export default ToolbarItem
