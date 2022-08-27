import { createClient } from 'redis'

const url = `redis://localhost:6379`
export const connection = createClient({ url })
await connection.connect()

export const subscriber = connection.duplicate()
await subscriber.connect()

export const publisher = connection.duplicate()
await publisher.connect()