import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'

import '../config'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000'

interface IUploadOptions {
    size: number
    quality: number
}

const DEFAULT_OPTIONS = {
    size: 800,
    quality: 80,
}

export class UploadService {
    public static uploadImage = async (
        buffer: Buffer,
        destination: string,
        fileName: string,
        options: Partial<IUploadOptions> = DEFAULT_OPTIONS
    ) => {
        const fileObj = path.parse(fileName)
        fileObj.ext = 'webp'

        const renamedFile = path.format({
            name: fileObj.name,
            ext: fileObj.ext,
        })

        const filePath = path.join(
            process.cwd(),
            destination.replace(process.cwd(), ''),
            renamedFile
        )

        await fs.mkdir(destination, { recursive: true })

        const sharpOptions = { ...DEFAULT_OPTIONS, ...options }

        await sharp(buffer)
            .resize(sharpOptions.size)
            .toFormat('webp')
            .webp({ quality: sharpOptions.quality })
            .toFile(filePath)

        return `${BACKEND_URL}/${destination}/${renamedFile}`
    }
}
