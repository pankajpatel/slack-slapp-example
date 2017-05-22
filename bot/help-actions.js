const useHelpActions = (slapp) => {
  slapp.message(/^(hi|hello|hey|help).*/, ['direct_mention', 'direct_message'], (message) => {
    message.say({
      text: "Hi! Use */event* _event name_ to create a new event",
    })
  })
}

export { useHelpActions as default }
