function defaultCatch(err) {
  console.log(err)
}

function catchAsync(fn, onCatch = defaultCatch) {
  return async function wrapper() {
    try {
      // eslint-disable-next-line prefer-rest-params
      await fn.apply(this, arguments)
    } catch (err) {
      // eslint-disable-next-line prefer-rest-params
      onCatch({ err, args: arguments, file: 'Async' })
    }
  }
}

export default catchAsync
