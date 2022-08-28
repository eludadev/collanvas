import { Stroke } from 'components/drawing/drawing-panel'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connection } from 'redis.mjs'

const handler = async (req: NextApiRequest, res: NextApiResponse<Stroke[]>) => {
  const roomKey = req.query.key

  const strokes = (await connection.json.get(`canvas:${roomKey}`)) as Stroke[]
  res.status(200).json(strokes)
}

export default handler
