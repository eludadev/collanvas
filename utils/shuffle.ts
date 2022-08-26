import { faker } from '@faker-js/faker'

export function generateKey(): string {
  const randomWord = faker.word.noun()
  const randomNum = faker.random.numeric(4)

  return randomWord + randomNum
}

export function generateUsername(): string {
  const randomName = faker.name.firstName()
  const randomNum = faker.random.numeric(4)

  return randomName + randomNum
}
