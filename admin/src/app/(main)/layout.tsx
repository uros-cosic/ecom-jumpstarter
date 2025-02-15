import Breadcrumbs from "@/components/layout/breadcrumbs"
import SideNav from "@/components/layout/side-nav"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import WebsocketProvider from "@/components/websocket-provider"

type Props = {
    children: Readonly<React.ReactNode>
}

const Layout = ({ children }: Props) => {
    return (
        <WebsocketProvider>
            <SidebarProvider>
                <SideNav />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumbs />
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </WebsocketProvider>
    )
}

export default Layout
