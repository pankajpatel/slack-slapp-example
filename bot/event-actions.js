import uuid from 'uuid'

const useEventActions = (slapp, events) => {

  slapp.command('/event', (message, value) => {
    const id = uuid.v4()
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
          value: id,
        }]
      }]
    })
    events.insert({
      id,
      title: value,
      attendees: [],
      created_by: message.meta.user_id,
      channel_id: message.meta.channel_id
    })
  })

  slapp.action('event', 'join', (message, value) => {
    const joinedUserId = message.meta.user_id
    const event = events.findOne({id: value})
    if (event.attendees.indexOf(joinedUserId !== -1)) {
      message.respond({
        replace_original: false,
        text: 'You\'ve already joined this event'
      })
    } else {
      message.say({
        text: `<@${joinedUserId}> joins *${event.title}*`
      })
      event.attendees.push(joinedUserId)
      events.update(event)
    }
  })

  slapp.command('/event-list', (message) => {
    const eventList = events.find({
      channel_id: message.meta.channel_id
    })

    message.respond({
      text: 'Here is a list of all events planned in this channel:',
      attachments: eventList.map(event => ({
        attachment_type: 'default',
        callback_id: 'event',
        title: event.title,
        fields: [{
          title: 'Organizer',
          value: `<@${event.created_by}>`,
          short: true,
        }, {
          title: 'Attendees',
          value: event.attendees.map(userId => `<@${userId}>`).join(','),
          short: true,
        }],
        actions: [{
          type: 'button',
          name: 'join',
          text: 'Join',
          value: event.id,
        }]
      }))
    })

  })
}

export { useEventActions as default }
