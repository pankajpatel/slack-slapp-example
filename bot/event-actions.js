import catchAsync from '../lib/async'

const useEventActions = (slapp) => {
  slapp.command('/event', catchAsync((message, value) => {
    message.say({
      text: `There is a new event:  *${value}*\n`,
    })
  }))
}

export { useEventActions as default }
