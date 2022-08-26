import AppLoader from 'components/app/app-loader'

const MessagesPanel = () => {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <AppLoader dark />
    </div>
  )
}

export default MessagesPanel
