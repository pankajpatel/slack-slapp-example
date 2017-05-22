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
      update: stub(),
      findOne: stub(),
    }
    eventActions = new EventActions(events)
  })

  beforeEach('prepare message', () => {
    message = {
      say: stub(),
      respond: stub(),
      meta: Object.assign({}, fixtures.meta)
    }
  })

  describe('onCreate', () => {

    it('should create an event', () => {
      eventActions.onCreate(message, fixtures.event.title)

      expect(message.say).to.be.calledOnce

      const sentAttachments = message.say.firstCall.args[0].attachments
      expect(sentAttachments[0].actions[0].value).to.be.defined

      expect(events.insert).to.be.calledOnce

      const createdEvent = events.insert.firstCall.args[0]
      expect(createdEvent.title).to.equal(fixtures.event.title)
      expect(createdEvent.created_by).to.equal(fixtures.meta.user_id)
      expect(createdEvent.channel_id).to.equal(fixtures.meta.channel_id)

    })

  })

  describe('onJoin', () => {

    it('should add a joining user to the attendees', () => {
      events.findOne.returns(Object.assign({}, fixtures.event, fixtures.meta))
      eventActions.onJoin(message, fixtures.event.title)

      expect(message.say).to.be.calledOnce
      expect(events.update).to.be.calledOnce

      const updatedEvent = events.update.firstCall.args[0]
      expect(updatedEvent.title).to.equal(fixtures.event.title)
      expect(updatedEvent.created_by).to.equal(fixtures.event.created_by)
      expect(updatedEvent.channel_id).to.equal(fixtures.meta.channel_id)
      expect(updatedEvent.attendees).to.eql([fixtures.meta.user_id])
    })

    it('should respond when a user already joined an event', () => {
      events.findOne.returns(Object.assign({}, fixtures.event, fixtures.meta, {
        attendees: [fixtures.meta.user_id]
      }))
      eventActions.onJoin(message, fixtures.event.title)

      expect(message.respond).to.be.calledOnce
    })

  })

})
