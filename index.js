import 'babel-register'
import express from 'express'
import Slapp from 'slapp'
import BeepBoopContext from 'slapp-context-beepboop'
import BeepBoopConvoStore from 'slapp-convo-beepboop'

import useHelpActions from './bot/help-actions'
import useEventActions from './bot/event-actions'


const app = express()

const slapp = Slapp({
    context: BeepBoopContext(),
    convo_store: BeepBoopConvoStore(),
    log: true,
})

useHelpActions(slapp)
useEventActions(slapp)

// attach handlers to an Express app
slapp.attachToExpress(app)

app.listen(process.env.PORT)

console.log('Slack App is running on port ', process.env.PORT)
