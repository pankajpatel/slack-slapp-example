import 'babel-register'
import express from 'express'
import Slapp from 'slapp'
import BeepBoopContext from 'slapp-context-beepboop'

import useHelpActions from './bot/help-actions'

const app = express()

const slapp = Slapp({
  context: BeepBoopContext(),
  log: true,
})

// attach handlers to an Express app
slapp.attachToExpress(app)

app.listen(process.env.PORT)

console.log('Slack App is running on port ', process.env.PORT)

useHelpActions(slapp)
