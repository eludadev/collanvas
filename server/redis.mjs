import { createClient } from 'redis'

const {
  REDIS_USERNAME: username,
  REDIS_PASSWORD: password,
  REDIS_HOST: host,
  REDIS_PORT: port,
} = process.env

export const connection = createClient({
  url:
    process.env.NODE_ENV === 'production'
      ? `redis://${username}:${password}@${host}:${port}`
      : 'redis://localhost:6379',
})
await connection.connect()

export const subscriber = connection.duplicate()
await subscriber.connect()

export const publisher = connection.duplicate()
await publisher.connect()
