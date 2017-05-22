import { expect } from 'chai'
import { stub } from 'sinon'

import { EventActions } from '../bot/event-actions'

describe('EventActions', () => {

  const fixtures = {
    meta: {
      user_id: 'U123',
      channel_id: 'C456'
    },
    event: {
      id: '1',
      created_by: 'U789',
      channel_id: 'C789',
      title: 'The event title',
      attendees: []
    }
  }

  let eventActions
  let message
  let events

  beforeEach('prepare eventActions', () => {
    events = {
      insert: stub(),
    }
    eventActions = new EventActions(events)
  })

  beforeEach('prepare message', () => {
    message = {
      say: stub(),
      meta: Object.assign({}, fixtures.meta)
    }
  })

  describe('onCreate', () => {

    it('should create an event', () => {
      eventActions.onCreate(message, fixtures.event.title)

      expect(message.say).to.be.calledOnce

      expect(events.insert).to.be.calledOnce

      const createdEvent = events.insert.firstCall.args[0]
      expect(createdEvent.title).to.equal(fixtures.event.title)
      expect(createdEvent.created_by).to.equal(fixtures.meta.user_id)
      expect(createdEvent.channel_id).to.equal(fixtures.meta.channel_id)

    })

  })

})
