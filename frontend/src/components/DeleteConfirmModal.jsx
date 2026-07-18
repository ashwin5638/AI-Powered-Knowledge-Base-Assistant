import { useEffect } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, documentName, loading }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiAlertTriangle className="text-red-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Delete Document</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                    Are you sure you want to delete <span className="font-medium text-gray-900">{documentName}</span>?
                    This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
