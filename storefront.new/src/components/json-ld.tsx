import Script from "next/script"

import { generateJsonLdSchema, IJsonLdSchema } from "@/lib/utils"

const JsonLD = ({ type, data, id }: IJsonLdSchema) => {
    const schema = generateJsonLdSchema({ type, data, id })

    if (!schema) return null

    return (
        <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            id={id}
        />
    )
}

export default JsonLD
