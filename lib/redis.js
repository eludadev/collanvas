import { createClient } from 'redis'

const {
  REDIS_USERNAME: username,
  REDIS_PASSWORD: password,
  REDIS_HOST: host,
  REDIS_PORT: port,
} = process.env

export const connection = createClient({
  url:
    process.env.NODE_ENV === 'development'
      ? `redis://${username}:${password}@${host}:${port}`
      : 'redis://localhost:6379',
})

export const subscriber = connection.duplicate()
export const publisher = connection.duplicate()

export async function connect() {
  await connection.connect()
  await subscriber.connect()
  await publisher.connect()
}
