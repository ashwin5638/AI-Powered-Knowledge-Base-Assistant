import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <p className="text-gray-500 mt-4 text-lg">Page not found</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
                >
                    <FiHome size={16} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default NotFound
