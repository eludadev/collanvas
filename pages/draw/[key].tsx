import type { NextPage } from 'next'
import Head from 'next/head'

import classNames from 'classnames'
import styles from 'styles/Draw.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'

import { useEffect, useState } from 'react'
import { useCopyToClipboard, useDebounce } from 'react-use'

import AppIcon from 'components/app/app-icon'
import DrawingPanel from 'components/drawing/drawing-panel'
import MessagesPanel from 'components/messages/messages-panel'

import io from 'socket.io-client'

const socket = io()
socket.on('connect', () => {
  console.log(`New connection: ${socket.id}`)
})

const Draw: NextPage = () => {
  const router: NextRouter = useRouter()

  // Extract initial data from route
  const roomKey: string = router.query.key as string
  const username: string = (router.query.username as string) || 'default'
  const userColorHex: string =
    (router.query.userColorHex as string) || '#000000'

  // Copy room key to clipboard
  const [{ value: copiedValue }, copyToClipboard] = useCopyToClipboard()
  const [isCopied, setCopied] = useState<boolean>(false)

  useDebounce(
    () => {
      setCopied(false)
    },
    2500,
    [isCopied]
  )

  // Intialize socket connection
  useEffect(() => {
    socket.emit('join', { roomKey })
  }, [roomKey])

  return (
    <div
      className="grid h-screen bg-white"
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <Head>
        <title>Collanvas - {roomKey}</title>
      </Head>
      <header className="flex h-fit items-center justify-between py-4 px-4">
        <Link href="/">
          <a href="">
            <AppIcon size={120} />
          </a>
        </Link>
        <div className="flex items-center gap-8">
          <div className="space-x-1">
            <span
              className="my-auto inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: userColorHex }}
            />
            <span className="inline-block font-bold">{username}</span>
          </div>
        </div>
      </header>
      <div className="lg:grid" style={{ gridTemplateColumns: 'auto 20rem' }}>
        <section
          className={classNames(
            'relative h-[40vh] lg:h-auto',
            styles.drawingPanel
          )}
        >
          <h2 className="absolute top-0 left-0 z-10 m-4 flex items-center gap-3">
            <Link href="/">
              <a title="Back">
                <FontAwesomeIcon icon={solid('angle-left')} size="sm" />
              </a>
            </Link>
            <button
              title="Copy to clipboard"
              onClick={() => {
                copyToClipboard(roomKey)
                setCopied(true)
              }}
            >
              <span className="font-bold underline">{roomKey}</span> (
              {isCopied ? 'Copied!' : 'Copy to clipboard'})
            </button>
          </h2>

          <DrawingPanel
            socket={socket}
            roomKey={roomKey}
            myColor={userColorHex}
          />
        </section>
        <section className="relative h-[50vh] border-t-2 lg:h-auto lg:border-l-2 lg:border-t-0">
          <MessagesPanel
            socket={socket}
            myUsername={username}
            myColor={userColorHex}
            roomKey={roomKey}
          />
        </section>
      </div>
    </div>
  )
}

export default Draw
