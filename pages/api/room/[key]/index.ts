import { Message } from 'components/messages/messages-panel'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connection } from 'lib/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse<null>) => {
  const roomKey = req.query.key

  if (req.method === 'POST') {
    const messages = await connection.json.get(`messages:${roomKey}`)
    if (!messages) {
      await connection.json.set(`messages:${roomKey}`, '$', [])
      await connection.json.set(`canvas:${roomKey}`, '$', [])
    }
  }

  res.send(null)
}

export default handler
