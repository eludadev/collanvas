import AppLoader from 'components/app/app-loader'
import { useEffect, useState } from 'react'
import { withSize } from 'react-sizeme'
import { Socket } from 'socket.io-client'
import DrawingCanvas from './drawing-canvas'
import DrawingToolbar from './drawing-toolbar'

export type StrokeType = 'Pen' | 'Eraser'

export type Point = {
  x: number
  y: number
}

export type Stroke = {
  type: StrokeType
  points: Point[]
  color: string
  thickness: number
}

type DrawingPanelProps = {
  roomKey: string
  socket: Socket
  myColor: string
  size: {
    width: number
    height: number
  }
}

const DrawingPanel = ({
  myColor,
  roomKey,
  socket,
  size: mySize,
}: DrawingPanelProps) => {
  const [isLoading, setLoading] = useState<boolean>(true)

  const [selectedTool, selectTool] = useState<StrokeType>('Pen')
  const [thickness, setThickness] = useState<number>(2)

  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)

  function addStroke(stroke: Stroke) {
    setStrokes((strokes) => strokes.concat(stroke))
  }

  // Intialize socket connection
  useEffect(() => {
    socket.on(`undo.${roomKey}`, () => undo(false))
    socket.on(`drawingdone.${roomKey}`, (stroke: Stroke) => {
      addStroke(stroke)
    })
  }, [roomKey])

  function undo(emit?: boolean) {
    setStrokes((strokes) => strokes.splice(0, strokes.length - 1))
    if (emit) {
      socket.emit('undo', { roomKey })
    }
  }

  useEffect(() => {
    async function fetchCanvas() {
      // fake delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setLoading(false)

      // fake data
      setStrokes([
        {
          points: [
            {
              x: 0.80625,
              y: 0.2975557917109458,
            },
            {
              x: 0.7979166666666667,
              y: 0.29330499468650373,
            },
            {
              x: 0.7916666666666666,
              y: 0.28905419766206164,
            },
            {
              x: 0.7802083333333333,
              y: 0.28055260361317746,
            },
            {
              x: 0.7697916666666667,
              y: 0.26567481402763016,
            },
            {
              x: 0.7625,
              y: 0.24760892667375137,
            },
            {
              x: 0.7614583333333333,
              y: 0.23273113708820403,
            },
            {
              x: 0.7625,
              y: 0.21360255047821464,
            },
            {
              x: 0.76875,
              y: 0.20297555791710944,
            },
            {
              x: 0.7802083333333333,
              y: 0.19341126461211475,
            },
            {
              x: 0.8072916666666666,
              y: 0.18172157279489903,
            },
            {
              x: 0.8291666666666667,
              y: 0.18278427205100956,
            },
            {
              x: 0.84375,
              y: 0.1891604675876727,
            },
            {
              x: 0.8510416666666667,
              y: 0.1944739638682253,
            },
            {
              x: 0.8572916666666667,
              y: 0.20085015940488843,
            },
            {
              x: 0.859375,
              y: 0.20828905419766203,
            },
          ],
          color: 'black',
          thickness: 2,
          type: 'Pen',
        },
      ])
    }

    fetchCanvas()
  }, [])

  return (
    <div className="relative h-full">
      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <AppLoader dark />
        </div>
      ) : (
        <div className="absolute inset-0">
          <DrawingCanvas
            socket={socket}
            roomKey={roomKey}
            strokes={strokes.concat(currentStroke ? [currentStroke] : [])}
            size={mySize}
            onUp={({ x, y }: Point) => {
              if (currentStroke) {
                addStroke(currentStroke)
                socket.emit('drawingdone', {
                  roomKey,
                  stroke: currentStroke,
                })
              }

              setCurrentStroke(null)
            }}
            onDown={({ x, y }: Point) => {
              setCurrentStroke({
                type: selectedTool,
                color: myColor,
                thickness,
                points: [
                  {
                    x,
                    y,
                  },
                ],
              })
            }}
            onMove={throttle(({ x, y }: Point) => {
              if (currentStroke) {
                setCurrentStroke({
                  ...currentStroke,
                  points: currentStroke.points.concat([{ x, y }]),
                })

                socket.emit('drawing', {
                  roomKey,
                  stroke: currentStroke,
                })
              }
            }, 10)}
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 mb-4 grid place-items-center">
        <DrawingToolbar
          canUndo={!isLoading && strokes.length > 0}
          thickness={thickness}
          onChangeThickness={(thickness: number) => setThickness(thickness)}
          selectedTool={selectedTool}
          onChangeTool={(tool: StrokeType) => selectTool(tool)}
          onUndo={() => undo(true)}
        />
      </div>
    </div>
  )
}

export default withSize({ monitorHeight: true })(DrawingPanel)

function throttle(callback: (...args: any) => any, delay: number) {
  let previousCall = new Date().getTime()
  return function () {
    const time = new Date().getTime()

    if (time - previousCall >= delay) {
      previousCall = time
      callback.apply(null, arguments as unknown as any[])
    }
  }
}
