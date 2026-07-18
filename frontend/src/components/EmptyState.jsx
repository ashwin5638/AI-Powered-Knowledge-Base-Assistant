const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            {Icon && <Icon className="mx-auto text-gray-300 mb-3" size={40} />}
            <p className="text-gray-900 font-medium">{title}</p>
            {message && <p className="text-gray-500 text-sm mt-1">{message}</p>}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState
