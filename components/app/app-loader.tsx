import styles from 'styles/AppLoader.module.css'

type AppLoaderProps = {
  dark?: boolean
}

const AppLoader = ({ dark }: AppLoaderProps) => {
  return <div className={dark ? styles.loaderDark : styles.loaderLight}></div>
}

export default AppLoader
