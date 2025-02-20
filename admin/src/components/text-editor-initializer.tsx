'use client'

import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    linkDialogPlugin,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    CreateLink,
    imagePlugin,
    InsertImage,
    InsertThematicBreak,
    InsertTable,
    tablePlugin,
    ListsToggle,
    Separator,
    linkPlugin
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'
import { uploadImage } from '@/lib/data/upload'
import { toast } from 'sonner'

const EditorInitializer = ({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {
    return (
        <MDXEditor
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                diffSourcePlugin(),
                imagePlugin({
                    imageUploadHandler
                }),
                linkDialogPlugin(),
                tablePlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => <>
                        <DiffSourceToggleWrapper>
                            <BlockTypeSelect />
                            <Separator orientation='vertical' />
                            <UndoRedo />
                            <Separator orientation='vertical' />
                            <BoldItalicUnderlineToggles />
                            <Separator orientation='vertical' />
                            <CreateLink />
                            <InsertImage />
                            <InsertTable />
                            <InsertThematicBreak />
                            <Separator orientation='vertical' />
                            <ListsToggle />
                        </DiffSourceToggleWrapper>
                    </>
                })
            ]}
            {...props}
            ref={editorRef}
            className='prose prose-2xl'
        />
    )
}

async function imageUploadHandler(image: File) {
    const formData = new FormData()
    formData.append('image', image)

    const [data, err] = await uploadImage(formData)

    if (err) {
        toast.error(err)
        return ''
    }

    return data!
}

export default EditorInitializer
