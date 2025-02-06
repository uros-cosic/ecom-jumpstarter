import Navbar from "./navbar"

const Header = () => {
    return (
        <header className="fixed top-0 left-0 bg-white max-w-[100vw] min-w-[100vw] flex items-center justify-center w-full border-b py-3 mx-auto px-2 h-16">
            <Navbar />
        </header>
    )
}

export default Header
