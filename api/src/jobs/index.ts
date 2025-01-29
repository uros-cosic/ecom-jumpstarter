import cron from 'node-cron'

import { JobService } from '../services/job'
;(() => {
    cron.schedule('0 0 * * *', () => {
        console.log(
            `${new Date().toISOString()} - Running daily database backup...`
        )
        JobService.backupDatabase()
    })

    cron.schedule('0 0 * * 0', () => {
        console.log(`${new Date().toISOString()} - Cleaning up old backups...`)
        JobService.cleanupBackups(7)
    })
})()
