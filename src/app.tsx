import React, {Suspense, useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {usePixel} from './index'
//const {Img, useImage} = require('../cjs')

interface ErrorBoundary {
  props: {
    children: React.ReactNode
    onError?: React.ReactNode
  }
}
class ErrorBoundary extends React.Component implements ErrorBoundary {
  state: {
    hasError: boolean
  }
  onError: React.ReactNode

  constructor(props) {
    super(props)
    this.state = {hasError: false}
    this.onError = props.onError
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: error}
  }

  render() {
    if (this.state.hasError) {
      if (this.onError) return this.onError
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

const PixelsExample = (e) => {
  const {src, isLoading, error} = usePixel({
    srcList: 'http://example-repo.libpx.com/images/sample_img.jpg',
    pixelParams: {
      mode: 'stretch',
      crop: {
        x: 0,
        y: 0,
        w: 300,
        h: 300,
      },
      blur: 2,
      brightness: 50,
      format: 'png',
    },
  })

  return <img src={src} />
}

function App() {
  return (
    <>
      <div>
        <h5>LibPixel Example</h5>
        <ErrorBoundary onError={<div>Suspense... wont load</div>}>
          <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
            <PixelsExample />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

const node = document.createElement('div')
node.id = 'root'
document.body.appendChild(node)
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
