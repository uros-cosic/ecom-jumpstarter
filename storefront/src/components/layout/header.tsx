import Navbar from "./navbar"

const Header = () => {
    return (
        <header className="fixed top-0 left-0 bg-white flex items-center justify-center w-full border-b py-3 mx-auto px-2 h-16 z-50">
            <Navbar />
        </header>
    )
}

export default Header
