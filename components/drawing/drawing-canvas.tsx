import { MouseEvent, TouchEvent, useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { Point, Stroke } from './drawing-panel'

type DrawingCanvasProps = {
  strokes: Stroke[]
  socket: Socket
  roomKey: string
  size: {
    width: number
    height: number
  }
  onDown: ({ x, y }: Point) => void
  onMove: ({ x, y }: Point) => void
  onUp: ({ x, y }: Point) => void
}

const DrawingCanvas = ({
  strokes,
  roomKey,
  size,
  socket,
  onDown,
  onMove,
  onUp,
}: DrawingCanvasProps) => {
  const canvasElem = useRef<HTMLCanvasElement | null>(null)

  function drawStroke({ type, color, thickness, points }: Stroke) {
    // Make sure canvas element exists and get its dimensions
    if (!canvasElem.current) return
    const {
      width,
      height,
    }: {
      width: number
      height: number
    } = canvasElem.current

    // Make sure 2d context exists for canvas
    const ctx = canvasElem.current.getContext('2d')
    if (!ctx) return

    ctx.beginPath()

    switch (type) {
      case 'Pen':
        ctx.globalCompositeOperation = 'source-over'
        break
      case 'Eraser':
        ctx.globalCompositeOperation = 'destination-out'
        break
    }

    // Draw the first point if it exists
    if (!points.length) return
    ctx.moveTo(points[0].x * width, points[0].y * height)

    // Draw every other point
    for (const otherPoint of points.slice(1)) {
      ctx.lineTo(otherPoint.x * width, otherPoint.y * height)
    }

    ctx.strokeStyle = color
    ctx.lineWidth = thickness

    ctx.stroke()
    ctx.closePath()
  }

  // Intialize socket connection
  useEffect(() => {
    socket.on(`drawing.${roomKey}`, (stroke: Stroke) => {
      drawStroke(stroke)
    })
  }, [roomKey])

  useEffect(() => {
    // Make sure canvas element exists and get its dimensions
    if (!canvasElem.current) return
    const {
      width,
      height,
    }: {
      width: number
      height: number
    } = canvasElem.current

    // Make sure 2d context exists for canvas
    const ctx = canvasElem.current.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw the strokes
    strokes.forEach((stroke: Stroke) => {
      drawStroke(stroke)
    })
  }, [strokes, size])

  function getCoordsMouse(e: MouseEvent<HTMLCanvasElement>): Point {
    const canvasLeft: number =
      canvasElem.current?.getBoundingClientRect().left || 0
    const canvasTop: number =
      canvasElem.current?.getBoundingClientRect().top || 0

    const {
      width,
      height,
    }: {
      width: number
      height: number
    } = canvasElem.current || size

    return {
      x: Math.round(e.clientX - canvasLeft) / width,
      y: Math.round(e.clientY - canvasTop) / height,
    }
  }

  function getCoordsTouch(e: TouchEvent<HTMLCanvasElement>): Point {
    const canvasLeft: number =
      canvasElem.current?.getBoundingClientRect().left || 0
    const canvasTop: number =
      canvasElem.current?.getBoundingClientRect().top || 0

    const {
      width,
      height,
    }: {
      width: number
      height: number
    } = canvasElem.current || size

    return {
      x: e.touches.length
        ? Math.round(e.touches[0].clientX - canvasLeft) / width
        : 0,
      y: e.touches.length
        ? Math.round(e.touches[0].clientY - canvasTop) / height
        : 0,
    }
  }

  return (
    <canvas
      ref={canvasElem}
      width={size.width}
      height={size.height}
      onMouseDown={(event) => onDown(getCoordsMouse(event))}
      onTouchStart={(event) => onDown(getCoordsTouch(event))}
      onMouseUp={(event) => onUp(getCoordsMouse(event))}
      onMouseOut={(event) => onUp(getCoordsMouse(event))}
      onTouchEnd={(event) => onUp(getCoordsTouch(event))}
      onTouchCancel={(event) => onUp(getCoordsTouch(event))}
      onMouseMove={(event) => onMove(getCoordsMouse(event))}
      onTouchMove={(event) => onMove(getCoordsTouch(event))}
    >
      Sorry, your browser does not support HTML5 Canvas.
    </canvas>
  )
}

export default DrawingCanvas
