import type { NextPage } from 'next'
import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold underline">
        Hello Next!{' '}
        <FontAwesomeIcon
          icon={solid('face-smile')}
          className="animate-ping text-sm"
        />
      </h1>
    </div>
  )
}

export default Home
