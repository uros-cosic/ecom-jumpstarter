import eventBus from './event-bus'

import '../config'

export class LiveDataService {
    static readonly Events = {
        UPDATED: 'live-data.updated',
    }

    private users: number

    constructor() {
        this.users = 0
    }

    getLiveUsers = () => this.users

    increaseLiveUsers = (increment: number) => {
        this.users += increment
        eventBus.emit(LiveDataService.Events.UPDATED, this.getLiveData())
    }

    getLiveData = () => ({
        users: this.users,
    })
}

const liveDataService = new LiveDataService()

export default liveDataService
