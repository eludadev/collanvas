import { NextPage } from 'next'

import classNames from 'classnames'
import styles from 'styles/Draw.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'

import { useState } from 'react'
import { useCopyToClipboard, useDebounce } from 'react-use'

import AppIcon from 'components/app/app-icon'
import DrawingPanel from 'components/drawing/drawing-panel'
import MessagesPanel from 'components/messages/messages-panel'

const Draw: NextPage = () => {
  const router: NextRouter = useRouter()

  // Extract initial data from route

  const roomKey: string = (router.query.key as string) || 'default'
  const username: string = (router.query.username as string) || 'default'
  const totalUsers: number = Number(router.query.totalUsers as string) || 0
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

  return (
    <div
      className="grid h-screen bg-white"
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
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
          <div className="space-x-1">
            <FontAwesomeIcon icon={solid('user')} />
            <span className="inline-block font-bold">{totalUsers}/8</span>
          </div>
        </div>
      </header>
      <div className="lg:grid" style={{ gridTemplateColumns: 'auto 20rem' }}>
        <section
          className={classNames('relative h-96 lg:h-auto', styles.drawingPanel)}
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

          <DrawingPanel keyName={roomKey} myColor={userColorHex} />
        </section>
        <section className="relative h-96 border-t-2 lg:h-auto lg:border-l-2 lg:border-t-0">
          <h2 className="m-4 font-bold">Chat</h2>

          <MessagesPanel />
        </section>
      </div>
    </div>
  )
}

export default Draw
