import WebsocketProvider from "@/components/websocket-provider"

type Props = {
    children: Readonly<React.ReactNode>
}

const Layout = ({ children }: Props) => {
    return (
        <main className="min-h-screen flex flex-col pt-16">
            <WebsocketProvider>
                {children}
            </WebsocketProvider>
        </main>
    )
}

export default Layout
