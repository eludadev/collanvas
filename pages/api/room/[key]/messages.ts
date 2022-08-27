import { Message } from 'components/messages/messages-panel'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connection } from 'server/redis.mjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Message[]>
) => {
  const roomKey = req.query.key

  const messages = (await connection.json.get(
    `messages:${roomKey}`
  )) as Message[]

  res.status(200).json(messages)
}

export default handler
