
const useHelpActions = (slapp) => {

  slapp.message(/^(hi|hello|hey|help).*/, ['direct_mention', 'direct_message'], (message) => {
    message.say({
      text: "Hi, how is it going?\n\n" +
      "Use */event* _title_ to create a new event\n" +
      "Use */event-list* to list all upcoming events" ,
    })
  })

}

export { useHelpActions as default }
