# React Libpixel

React hook to generate LibPixel URLs

[![npm](https://img.shields.io/npm/v/react-libpixel.svg?style=flat-square)](https://www.npmjs.com/package/react-libpixel)
[![npm](https://img.shields.io/npm/l/react-libpixel.svg?style=flat-square)](https://www.npmjs.com/package/react-libpixel)
[![npm](https://img.shields.io/npm/dt/react-libpixel.svg?style=flat-square)](https://www.npmjs.com/package/react-libpixel)
[![npm](https://img.shields.io/npm/dm/react-libpixel.svg?style=flat-square)](https://www.npmjs.com/package/react-libpixel)
[![Known Vulnerabilities](https://snyk.io/test/github/danishyasin33/react-libpixel/badge.svg)](https://snyk.io/test/github/danishyasin33/react-libpixel)


**React LibPixel** is an `<img>` tag replacement and hook for [React.js](https://facebook.github.io/react/), supporting fallback to alternate sources when loading an image fails.

**React Libpixel** allows one or more images to be used as fallback images in the event that the browser couldn't load the previous image. When using the component, you can specify any React element to be used before an image is loaded (i.e. a spinner) or in the event that the specified image(s) could not be loaded. When using the hook this can be achieved by wrapping the component with [`<Suspense>`](https://reactjs.org/docs/react-api.html#reactsuspense) and specifying the `fallback` prop.

**React Libpixel** uses the `usePixel` hook internally which encapsulates all the image loading logic. This hook works with React Suspense by default and will suspend painting until the image is downloaded and decoded by the browser.

**React Libpixel** is an extension of **React Image**, where the functionality has been extended to include the support for LibPixel URLs.

## Getting started

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-libpixel` using npm:

```
npm install react-libpixel --save
```

## Dependencies

`react-libpixel` has no external dependencies, aside for a version of `react` and `react-dom` which support hooks and `@babel/runtime`.

## Documentation

You should use the `usePixel` hook.

### usePixel():

The `usePixel` hook allows for incorperating `react-libpixel`'s logic in any component. When using the hook, the component can be wrapped in `<Suspense>` to keep it from rendering until the image is ready. Specify the `fallback` prop to show a spinner or any other component to the user while the browser is loading. The hook will throw an error if it failes to find any images. You can wrap your componenet with an [Error Boundry](https://reactjs.org/docs/code-splitting.html#error-boundaries) to catch this scenario and do/show something.

Example usage:

```js
import React, {Suspense} from 'react'
import {usePixel} from 'react-libpixel'

function MyImageComponent() {
  const {src} = usePixel({
    srcList: 'https://www.example.com/foo.jpg',
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

export default function MyComponent() {
  return (
    <Suspense>
      <MyImageComponent />
    </Suspense>
  )
}
```

### `usePixel` API:

- `srcList`: a string or array of strings. `usePixel` will try loading these one at a time and returns after the first one is successfully loaded

- `pixelParams`: an object that contains parameters supported by LibPixel, check [pixelParams](#pixelParams) for details. 

- `imgPromise`: a promise that accepts a url and returns a promise which resolves if the image is successfully loaded or rejects if the image doesn't load. You can inject an alternative implementation for advanced custom behaviour such as logging errors or dealing with servers that return an image with a 404 header

- `useSuspense`: boolean. By default, `useImage` will tell React to suspend rendering until an image is downloaded. Suspense can be disabled by setting this to false.

**returns:**

- `src`: the resolved image address
- `isLoading`: the currently loading status. Note: this is never true when using Suspense
- `error`: any errors ecountered, if any

### pixelParams

`pixelParams` contains all the paremeters that are supported by libPixel. You can edit your images on the go by using these parameters. Some of the supported parameters include: 

- `mode`: Can be any of the following: `'fit' | 'crop' | 'stretch'`
- `crop`: is an object that contains `x`, `y`, `w`, `h`. Type of each is `Number`. Read [more](https://docs.libpixel.com/api-documentation/image-api#crop)!
- `format`: Can be any of the following: `'jpeg' | 'png' | 'webp'`
- `dpr`: Number. Between `0.1` and `10.0`
- `blur`: Number. Between `0` and `100`
- `brightness`: Number. Between `-100` and `100`. Default `0`
- `contrast`: Number. Between `-100` and `100`. Default `0`
- `hue`: Number. Between `-100` and `100`. Default `0`
- `saturation`: Number. Between `-100` and `100`. Default `0`
- `gamma`: Number. Between `-100` and `100`. Default `0`
- `quality`: Number. Between `0` and `100`. Default `85`
- `upscale`: Boolean. Default `true`
- `debug`: Boolean. Default `false`

You can learn more about the parameters in the LibPixel [documenation](https://docs.libpixel.com/api-documentation/image-api). 

## License

`react-libpixel` is available under the MIT License
