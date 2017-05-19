import catchAsync from '../lib/async'

const useHelpActions = (slapp) => {
  slapp.message(/^(hi|hello|hey|help).*/, 'direct_message, direct_mention', catchAsync((message) => {
    message.say({
      text: "Create a new event using /events",
    })
  }))
}

export { useHelpActions as default }
