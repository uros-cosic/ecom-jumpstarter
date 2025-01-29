export default function Layout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <main className="flex flex-col max-w-screen mx-auto">{children}</main>
    )
}
