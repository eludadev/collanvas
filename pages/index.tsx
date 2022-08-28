import JoinAlert from 'components/join/join-alert'
import JoinInput from 'components/join/join-input'
import AppLoader from 'components/app/app-loader'
import Head from 'next/head'

import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'

import type { InferGetStaticPropsType } from 'next'

import { useRef, useState } from 'react'
import { generateKey, generateUsername } from 'utils/shuffle'

import classNames from 'classnames'
import styles from 'styles/Home.module.css'
import { faker } from '@faker-js/faker'

type HomeProps = {
  color: string
}

export async function getServerSideProps() {
  const color = faker.color.rgb()
  return { props: { color } }
}

const Home = ({
  color,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const [userColor, setUserColor] = useState<string>(color)
  const [username, setUsername] = useState<string>('')
  const [key, setKey] = useState<string>('')

  const [alert, setAlert] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  const formElem = useRef<HTMLFormElement | null>(null)

  const router: NextRouter = useRouter()

  async function joinOrCreate() {
    formElem.current?.setAttribute('inert', 'inert')

    setAlert(null)
    setLoading(true)

    // If username hasn't been chosen, automatically generate a new one and save its value for immediately use in the following route
    let finalUsername
    if (!username) {
      finalUsername = generateUsername()
      setUsername(finalUsername)
    } else {
      finalUsername = username
    }

    try {
      const res = await fetch(`/api/room/${key}`, {
        method: 'post',
      })
      if (res.status !== 200) {
        throw Error('Network error')
      }

      formElem.current?.removeAttribute('inert')

      router.push({
        pathname: `/draw/${key}`,
        query: {
          username: finalUsername,
          userColorHex: userColor.toLowerCase(),
        },
      })
    } catch (e) {
      setAlert((e as any).message)
      setLoading(false)
      formElem.current?.removeAttribute('inert')
    }
  }

  return (
    <div className="mx-auto w-fit">
      <Head>
        <title>Collanvas</title>
      </Head>
      <header className="ml-4">
        <h1 className="mt-16 -ml-1 text-[4rem] font-black uppercase text-white xl:-ml-2 xl:text-[7rem]">
          Collanvas
        </h1>
        <p className="-mt-6 text-lg text-white xl:-mt-8 xl:text-2xl">
          Your whole team, changing the world one stroke at a time.
        </p>
      </header>

      <main className="mx-auto mt-20 w-fit max-w-lg">
        <form
          ref={formElem}
          className={classNames(
            'grid grid-flow-row-dense grid-cols-1 gap-4',
            styles.joinForm
          )}
          onSubmit={(event) => {
            event.preventDefault()
            joinOrCreate()
          }}
        >
          <JoinInput
            value={key}
            onChange={(val) => setKey(val)}
            onShuffle={() => setKey(generateKey())}
            autoFocus
            required
          >
            Key...
          </JoinInput>
          <fieldset className="flex gap-2 pt-1">
            <JoinInput
              value={username}
              onChange={(val) => setUsername(val)}
              onShuffle={() => setUsername(generateUsername())}
            >
              Username...
            </JoinInput>
            <label
              className="relative aspect-square w-14 shrink-0 grow-0 rounded-md border-2 border-white ring-2 ring-primary-200"
              style={{ backgroundColor: userColor }}
            >
              <input
                type="color"
                className="absolute inset-0 opacity-0"
                value={userColor}
                onChange={(event) => setUserColor(event.target.value)}
              />
            </label>
          </fieldset>
          <button
            type="submit"
            className="btn rounded-md bg-white/10 py-2 text-xl font-bold uppercase text-white active:bg-white/5"
          >
            Join or create a Collanvas
          </button>
        </form>

        {isLoading && (
          <div className="mx-auto mt-4 w-fit">
            <AppLoader />
          </div>
        )}

        {alert && <JoinAlert onClose={() => setAlert(null)}>{alert}</JoinAlert>}
      </main>
    </div>
  )
}

export default Home
