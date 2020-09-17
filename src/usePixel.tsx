import React, {useState} from 'react'
import {createPortal} from 'react-dom'
import imagePromiseFactory from './imagePromiseFactory'

// @see https://docs.libpixel.com/api-documentation/image-api

export type mode = 'fit' | 'crop' | 'stretch'

export type crop = {
  x: Number
  y: Number
  w: Number
  h: Number
}

export type format = 'jpeg' | 'png' | 'webp'

// Defining main parameters which can be used
export type usePixelParams = {
  mode?: mode
  crop?: crop
  dpr?: Number
  blur?: Number
  brightness?: Number
  contrast?: Number
  hue?: Number
  saturation?: Number
  gamma?: Number
  quality?: Number
  format?: format
  upscale?: Boolean
  debug?: Boolean
}

export type usePixelProps = {
  srcList: string | string[]
  pixelParams?: usePixelParams
  imgPromise?: (...args: any[]) => Promise<void>
  useSuspense?: boolean
}

const removeBlankArrayElements = (a) => a.filter((x) => x)
const stringToArray = (x) => (Array.isArray(x) ? x : [x])
const cache = {}

// sequential map.find for promises
const promiseFind = (arr, promiseFactory) => {
  let done = false
  return new Promise((resolve, reject) => {
    const queueNext = (src) => {
      return promiseFactory(src).then(() => {
        done = true
        resolve(src)
      })
    }

    arr
      .reduce((p, src) => {
        // ensure we aren't done before enquing the next source
        return p.catch(() => {
          if (!done) return queueNext(src)
        })
      }, queueNext(arr.shift()))
      .catch(reject)
  })
}

export default function usePixel({
  srcList,
  imgPromise = imagePromiseFactory({decode: true}),
  pixelParams,
  useSuspense = true,
}: usePixelProps): {src: string | undefined; isLoading: boolean; error: any} {
  const [, setIsLoading] = useState(true)
  const sourceList = removeBlankArrayElements(stringToArray(srcList))
  const sourceKey = sourceList.join('')

  if (!cache[sourceKey]) {
    // create promise to loop through sources and try to load one
    cache[sourceKey] = {
      promise: promiseFind(sourceList, imgPromise),
      cache: 'pending',
      error: null,
    }
  }

  // when promise resolves/reject, update cache & state
  cache[sourceKey].promise
    // if a source was found, update cache
    // when not using suspense, update state to force a rerender
    .then((src) => {
      cache[sourceKey] = {...cache[sourceKey], cache: 'resolved', src}
      if (!useSuspense) setIsLoading(false)
    })

    // if no source was found, or if another error occured, update cache
    // when not using suspense, update state to force a rerender
    .catch((error) => {
      cache[sourceKey] = {...cache[sourceKey], cache: 'rejected', error}
      if (!useSuspense) setIsLoading(false)
    })

  if (cache[sourceKey].cache === 'resolved') {
    let url = cache[sourceKey].src;
    // if parameters exist, parse and add them in the url
    if (pixelParams) {
      url = url + '?';
      Object.entries(pixelParams).map(([key, pair]) => {
        switch (key) {
          case 'crop':
            if (pair == pixelParams.crop && pair != undefined) {
              let cropStr = `crop=${pair.x},${pair.y},${pair.w},${pair.h}`
              url = url + cropStr;
            }
            break;
          default:
            url = url + `${key}=${pair}`;
        }
        url = url + '&';
      });
      // removing extra ampersand at the end of URL
      url.slice(-1) === '&' ? url = url.slice(0, -1) : ''; 
    }
    // return the newly formed URL
    return {src: url, isLoading: false, error: null}
  }

  if (cache[sourceKey].cache === 'rejected') {
    if (useSuspense) throw cache[sourceKey].error
    return {isLoading: false, error: cache[sourceKey].error, src: undefined}
  }

  // cache[sourceKey].cache === 'pending')
  if (useSuspense) throw cache[sourceKey].promise
  return {isLoading: true, src: undefined, error: null}
}
