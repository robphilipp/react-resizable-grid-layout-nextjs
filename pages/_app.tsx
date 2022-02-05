import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {WindowDimensionsProvider} from 'react-resizable-grid-layout'

function MyApp({ Component, pageProps }: AppProps) {
  return <WindowDimensionsProvider><Component {...pageProps} /></WindowDimensionsProvider>
}

export default MyApp
