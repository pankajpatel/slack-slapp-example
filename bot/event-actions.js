import uuid from 'uuid'

class EventActions {

  constructor(events) {
    this.events = events
  }

  onCreate(message, value) {

    const id = uuid.v4()

    message.say({
      text: `<@${message.meta.user_id}> created a new event:\n *${value}*`,
    })

    this.events.insert({
      id,
      title: value,
      attendees: [],
      created_by: message.meta.user_id,
      channel_id: message.meta.channel_id
    })
  }
}

const useEventActions = (slapp, events) => {

  const eventActions = new EventActions(events)

  slapp.command('/event', eventActions.onCreate.bind(eventActions))
}

export {useEventActions as default, EventActions}
