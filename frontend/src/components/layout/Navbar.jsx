import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi'

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-gray-600 hover:text-gray-900"
            >
                <FiMenu size={22} />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUser size={16} />
                    <span>{user?.name || 'User'}</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    <FiLogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    )
}

export default Navbar
