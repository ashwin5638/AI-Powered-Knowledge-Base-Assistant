import { NavLink } from 'react-router-dom'
import { FiHome, FiUploadCloud, FiMessageSquare, FiFileText, FiClock, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const navItems = [
    { to: '/', label: 'Dashboard', icon: FiHome },
    { to: '/upload', label: 'Upload', icon: FiUploadCloud },
    { to: '/chat', label: 'Chat', icon: FiMessageSquare },
    { to: '/documents', label: 'Documents', icon: FiFileText },
    { to: '/history', label: 'History', icon: FiClock },
]

const Sidebar = ({ open, onClose }) => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
        onClose()
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 text-white
                    transform transition-transform duration-200 ease-in-out
                    lg:translate-x-0 flex flex-col
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
                    <h1 className="text-lg font-bold">KB Assistant</h1>
                    <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                        <FiLogOut size={20} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-1 flex-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4 pb-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
