import { createClient } from 'redis'

const url =
  process.env.NODE_ENV === 'development'
    ? 'redis://localhost:6379'
    : process.env.REDIS_URL
export const connection = createClient({ url })
await connection.connect()

export const subscriber = connection.duplicate()
await subscriber.connect()

export const publisher = connection.duplicate()
await publisher.connect()
