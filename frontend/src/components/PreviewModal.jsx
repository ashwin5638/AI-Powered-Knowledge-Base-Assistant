import { useState, useEffect } from 'react'
import { FiX, FiFileText } from 'react-icons/fi'
import { previewDocument } from '../api/documents'
import Spinner from './Spinner'

const PreviewModal = ({ isOpen, onClose, documentId, documentName }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isOpen || !documentId) return

        const fetchPreview = async () => {
            setLoading(true)
            setError('')
            setContent('')
            try {
                const { data } = await previewDocument(documentId)
                setContent(data.preview || 'No content available.')
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load preview')
            } finally {
                setLoading(false)
            }
        }

        fetchPreview()
    }, [isOpen, documentId])

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
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 min-w-0">
                        <FiFileText className="text-indigo-500 shrink-0" size={20} />
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {documentName}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <Spinner message="Loading preview..." />
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    ) : (
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {content}
                        </pre>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal
