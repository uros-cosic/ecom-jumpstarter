type Props = {
    children: Readonly<React.ReactNode>
}

const Layout = ({ children }: Props) => {
    return (
        <main className="min-h-screen flex flex-col pt-16">
            {children}
        </main>
    )
}

export default Layout
