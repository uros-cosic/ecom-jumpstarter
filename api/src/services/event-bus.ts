import { EventEmitter } from 'events'

import '../config'

class EventBus extends EventEmitter {}

const eventBus = new EventBus()

eventBus.on('error', (data: any) => {
    console.error(data)
})

export default eventBus
