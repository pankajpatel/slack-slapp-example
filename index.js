import 'babel-register'
import express from 'express'
import Slapp from 'slapp'
import BeepBoopContext from 'slapp-context-beepboop'
import loki from 'lokijs'

import useHelpActions from './bot/help-actions'
import useEventActions from './bot/event-actions'

const db = new loki('event.db', {
  autosave: true,
  autosaveInterval: 100, // 10 seconds
})

const events = db.addCollection('events')

const app = express()

const slapp = Slapp({
  context: BeepBoopContext(),
  log: true,
})

useHelpActions(slapp)
useEventActions(slapp, events)

// attach handlers to an Express app
slapp.attachToExpress(app)

app.listen(process.env.PORT)

console.log('Slack App is running on port ', process.env.PORT)
