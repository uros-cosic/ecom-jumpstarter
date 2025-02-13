import { exec } from 'child_process'
import path from 'path'
import fsp from 'fs/promises'
import fs from 'fs'

import '../config'

export class JobService {
    static async backupDatabase() {
        const backupDir = path.join(process.cwd(), 'backups', 'db')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupFile = path.join(backupDir, `backup-${timestamp}.gz`)

        await fsp.mkdir(backupDir, { recursive: true })

        const mongoURI = process.env.MONGO_URI!

        const command = `mongodump --uri="${mongoURI}" --archive="${backupFile}" --gzip`

        exec(command, (error, _stdout, stderr) => {
            if (error) {
                console.error(`Error during backup: ${error.message}`)
                return
            }
            if (stderr) {
                console.error(`Backup process stderr: ${stderr}`)
                return
            }
            console.log(`Backup successful! File saved at ${backupFile}`)
        })
    }

    static cleanupBackups(days: number) {
        const backupDir = path.join(process.cwd(), 'backups', 'db')
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

        fs.readdir(backupDir, (err, files) => {
            if (err) {
                console.error(`Error reading backup directory: ${err.message}`)
                return
            }

            files.forEach((file) => {
                const filePath = path.join(backupDir, file)
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(
                            `Error getting file stats: ${err.message}`
                        )
                        return
                    }

                    if (stats.mtime.getTime() < cutoff) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(
                                    `Error deleting file: ${err.message}`
                                )
                                return
                            }
                            console.log(`Deleted old backup: ${filePath}`)
                        })
                    }
                })
            })
        })
    }
}
