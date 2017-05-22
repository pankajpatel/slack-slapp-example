import catchAsync from '../lib/async'

const useEventActions = (slapp) => {
  slapp.command('/event', catchAsync((message, value) => {
    message.say({
      text: `<@${message.meta.user_id}> created a new event:\n *${value}*`,
      attachments: [{
        attachment_type: 'default',
        callback_id: 'event',
        text: `Do you want to join this event?`,
        actions: [{
          type: 'button',
          name: 'join',
          text: 'Join',
          value
        }]
      }]
    })
  }))

  slapp.action('event', 'join', catchAsync((message, value) => {
    message.say(`<@${message.meta.user_id}> joins ${value}`)
  }))
}

export { useEventActions as default }
