import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPen, faEraser } from '@fortawesome/free-solid-svg-icons'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import ToolbarItem from './toolbar-item'
import { StrokeType } from './drawing-panel'

type Tool = {
  name: StrokeType
  icon: IconProp
}

type DrawingToolbarProps = {
  selectedTool: StrokeType
  thickness: number
  canUndo: boolean
  onChangeThickness: (thickness: number) => void
  onChangeTool: (tool: StrokeType) => void
  onUndo: () => void
}

const DrawingToolbar = ({
  canUndo,
  thickness,
  selectedTool,
  onChangeTool,
  onChangeThickness,
  onUndo,
}: DrawingToolbarProps) => {
  const tools: Tool[] = [
    {
      name: 'Pen',
      icon: faPen,
    },
    {
      name: 'Eraser',
      icon: faEraser,
    },
  ]

  return (
    <div className="flex items-center gap-12 rounded-full border-2 border-primary-200 bg-white px-8 py-1">
      <div className="flex items-center gap-4">
        {tools.map(({ name, icon }) => (
          <ToolbarItem
            name={name}
            selected={selectedTool === name}
            onSelect={() => onChangeTool(name)}
            key={name}
          >
            <FontAwesomeIcon icon={icon} />
          </ToolbarItem>
        ))}
      </div>
      <button
        title="Undo"
        className="h-8 w-8 rounded-full hover:bg-secondary-400 hover:text-white disabled:bg-white disabled:text-primary-300"
        disabled={!canUndo}
        onClick={onUndo}
      >
        <FontAwesomeIcon icon={solid('undo')} />
      </button>
      <label htmlFor="thickness" className="sr-only">
        Thickness
      </label>
      <input
        id="thickness"
        title="Thickness"
        type="range"
        min="1"
        max="10"
        value={thickness}
        onChange={(event) => onChangeThickness(event.target.valueAsNumber)}
      />
    </div>
  )
}

export default DrawingToolbar
