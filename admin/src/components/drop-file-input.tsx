"use client"

import { ChangeEvent, useState } from "react"
import { File, Upload } from "lucide-react"

type Props = {
    type?: 'single' | 'multiple'
    accept?: string
    onFileChange: (args?: unknown) => unknown
}

const DropFileInput = ({ type = 'single', accept = '', onFileChange }: Props) => {
    const [fileList, setFileList] = useState<File[]>([])


    const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files

        if (newFiles) {
            const updatedList = type === 'single' ? [...newFiles] : [...fileList, ...newFiles]

            setFileList(updatedList);
            onFileChange(updatedList);
        }
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div
                className="relative text-foreground/70 w-full cursor-pointer rounded-md border-2 border-dashed p-10 flex flex-col gap-2 items-center justify-center text-center hover:opacity-70 transition-opacity"
            >
                <Upload size={26} />
                <span>Drag {"&"} Drop</span>
                <span>or</span>
                <span>Choose file/s</span>
                <input
                    type="file"
                    multiple={type === 'multiple'}
                    accept={accept}
                    onChange={onFileDrop}
                    className="opacity-0 absolute top-0 left-0 h-full w-full cursor-pointer"
                />
            </div>
            {
                !!fileList.length && (
                    <div className="w-full flex flex-wrap gap-3">
                        {fileList.map((file, idx) => (
                            <div key={idx} className="max-w-28 w-full bg-gray-100 rounded-md p-2 flex flex-col items-center justify-center text-center border gap-3">
                                <File size={26} className="text-gray-800" />
                                <div className="w-full text-xs text-foreground/80 flex flex-col gap-1">
                                    <p className="break-words line-clamp-3">{file.name}</p>
                                    <span>{file.size}B</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}


export default DropFileInput
