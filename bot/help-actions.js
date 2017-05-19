import catchAsync from '../lib/async'

const useHelpActions = (slapp) => {
  slapp.message(/^(hi|hello|hey|help).*/, ['direct_mention', 'direct_message'], catchAsync((message) => {
    message.say({
      text: "Hi! Use */events* _event name_ to create a new event",
    })
  }))
}

export { useHelpActions as default }
