import 'babel-register'
import express from 'express'
import Slapp from 'slapp'
import BeepBoopContext from 'slapp-context-beepboop'
import loki from 'lokijs'

import useHelpActions from './bot/help-actions'
import useEventActions from './bot/event-actions'

const app = express()

const slapp = Slapp({
  context: BeepBoopContext(),
  log: true,
})

// attach handlers to an Express app
slapp.attachToExpress(app)

app.listen(process.env.PORT)

console.log('Slack App is running on port ', process.env.PORT)

const db = new loki('event.db', {
  persistenceAdapter: 'fs',
  autoload: true,
  autoloadCallback: onDatabaseLoaded,
  autosave: true,
  autosaveInterval: 100, // 10 seconds
})

function onDatabaseLoaded() {
  let events = db.getCollection('events')
  if (!events) {
    events = db.addCollection('events')
  }
  useHelpActions(slapp)
  useEventActions(slapp, events)
}
