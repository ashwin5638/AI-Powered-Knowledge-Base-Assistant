import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
            <FiAlertTriangle className="text-red-400 mb-3" size={40} />
            <p className="text-gray-900 font-medium">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <FiRefreshCw size={14} />
                    Try Again
                </button>
            )}
        </div>
    )
}

export default ErrorState
