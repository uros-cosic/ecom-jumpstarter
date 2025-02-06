type Props = {
    children: Readonly<React.ReactNode>
}

const Layout = ({ children }: Props) => {
    return (
        <main>
            {children}
        </main>
    )
}

export default Layout
