import { faker } from '@faker-js/faker'
import AppLoader from 'components/app/app-loader'
import { useEffect, useRef, useState } from 'react'
import { generateUsername } from 'utils/shuffle'
import MessageInput from './message-input'
import MessageItem from './message-item'

type Message = {
  username: string
  color: string
  content: string
}

type MessagesPanelProps = {
  myUsername: string
  myColor: string
}

const MessagesPanel = ({ myUsername, myColor }: MessagesPanelProps) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [messages, setMessages] = useState<Message[]>([])

  const messagesContainerElem = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      // fake delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setLoading(false)

      // fake data
      const fakeMessages: Message[] = []
      for (let i = 0; i < 8; i++) {
        const message: Message = {
          username: generateUsername(),
          color: faker.color.rgb(),
          content: faker.lorem.sentence(),
        }

        fakeMessages.push(message)
      }

      setMessages(fakeMessages)
    }

    fetchMessages()
  }, [])

  // Scroll to bottom whenever new messages come
  useEffect(() => {
    messagesContainerElem.current?.scrollTo({
      top: messagesContainerElem.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div className="mx-4 h-full">
      <h2 className="relative z-10 bg-white py-3 font-bold">Chat</h2>

      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <AppLoader dark />
        </div>
      ) : (
        <div
          ref={messagesContainerElem}
          className="absolute bottom-0 flex h-full flex-col gap-4 overflow-y-scroll pt-16 pb-24"
        >
          {messages.map(({ content, color, username }: Message, index) => (
            <div className="mr-2" key={index}>
              <MessageItem
                username={username}
                color={color}
                alignRight={username === myUsername}
              >
                {content}
              </MessageItem>
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 mx-4 mb-2">
        <MessageInput
          disabled={isLoading}
          onSend={(message: string) =>
            setMessages(
              messages.concat([
                {
                  username: myUsername,
                  color: myColor,
                  content: message,
                },
              ])
            )
          }
        />
      </div>
    </div>
  )
}

export default MessagesPanel
