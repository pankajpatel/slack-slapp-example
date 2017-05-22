import uuid from 'uuid'

class EventActions {

  constructor(events) {
    this.events = events
  }

  onCreate(message, value) {

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

    this.events.insert({
      id,
      title: value,
      attendees: [],
      created_by: message.meta.user_id,
      channel_id: message.meta.channel_id
    })
  }

  onJoin(message, value) {

    const joiningUserId = message.meta.user_id
    const joinedEvent = this.events.findOne({id: value})

    if (joinedEvent.attendees.indexOf(joiningUserId) !== -1) {
      message.respond({
        replace_original: false,
        text: 'You\'ve already joined this event'
      })
    } else {
      message.say({
        text: `<@${joiningUserId}> joins *${joinedEvent.title}*`
      })

      joinedEvent.attendees.push(joiningUserId)
      this.events.update(joinedEvent)
    }
  }

  onList(message) {
    const eventList = this.events.find({
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
  }
}

const useEventActions = (slapp, events) => {

  const eventActions = new EventActions(events)

  slapp.command('/event', eventActions.onCreate.bind(eventActions))
  slapp.command('/event-list', eventActions.onList.bind(eventActions))
  slapp.action('event', 'join', eventActions.onJoin.bind(eventActions))
}

export {useEventActions as default, EventActions}
