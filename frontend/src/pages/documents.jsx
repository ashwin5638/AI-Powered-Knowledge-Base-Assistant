import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocuments, deleteDocument } from '../api/documents'
import { FiFileText, FiTrash2, FiEye, FiSearch, FiFilter, FiMessageSquare } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import PreviewModal from '../components/PreviewModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

const Documents = () => {
    const navigate = useNavigate()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [deleting, setDeleting] = useState(false)

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewDoc, setPreviewDoc] = useState(null)

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteDoc, setDeleteDoc] = useState(null)

    const fetchDocuments = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (search) params.search = search
            if (typeFilter) params.type = typeFilter

            const { data } = await getDocuments(params)
            setDocuments(data.data)
        } catch {
            toast.error('Failed to load documents')
        } finally {
            setLoading(false)
        }
    }, [search, typeFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments()
        }, 300)
        return () => clearTimeout(timer)
    }, [fetchDocuments])

    const handlePreview = (doc) => {
        setPreviewDoc(doc)
        setPreviewOpen(true)
    }

    const handleDeleteClick = (doc) => {
        setDeleteDoc(doc)
        setDeleteOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDoc) return
        setDeleting(true)
        try {
            await deleteDocument(deleteDoc._id)
            setDocuments(documents.filter(d => d._id !== deleteDoc._id))
            toast.success('Document deleted successfully')
            setDeleteOpen(false)
            setDeleteDoc(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed')
        } finally {
            setDeleting(false)
        }
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const statusColor = {
        ready: 'bg-green-100 text-green-700',
        processing: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700',
    }

    const typeColor = {
        pdf: 'bg-red-100 text-red-700',
        txt: 'bg-blue-100 text-blue-700',
        md: 'bg-purple-100 text-purple-700',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <button
                    onClick={() => navigate('/upload')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    + Upload
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white appearance-none"
                    >
                        <option value="">All Types</option>
                        <option value="pdf">PDF</option>
                        <option value="txt">TXT</option>
                        <option value="md">Markdown</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <Spinner message="Loading documents..." />
            ) : documents.length === 0 ? (
                <EmptyState
                    icon={FiFileText}
                    title="No documents found"
                    message={search || typeFilter ? 'Try adjusting your search or filter.' : undefined}
                    actionLabel={!search && !typeFilter ? 'Upload your first document' : undefined}
                    onAction={!search && !typeFilter ? () => navigate('/upload') : undefined}
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {documents.map((doc) => (
                        <div key={doc._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <FiFileText className="text-gray-400 shrink-0" size={20} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[doc.fileType] || 'bg-gray-100 text-gray-600'}`}>
                                            {doc.fileType.toUpperCase()}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {doc.status}
                                        </span>
                                        <span className="text-xs text-gray-400">{formatSize(doc.fileSize)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => handlePreview(doc)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                    title="Preview"
                                >
                                    <FiEye size={16} />
                                </button>
                                <button
                                    onClick={() => navigate(`/chat?document=${doc._id}`)}
                                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                    title="Ask questions"
                                >
                                    <FiMessageSquare size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(doc)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PreviewModal
                isOpen={previewOpen}
                onClose={() => { setPreviewOpen(false); setPreviewDoc(null) }}
                documentId={previewDoc?._id}
                documentName={previewDoc?.name}
            />

            <DeleteConfirmModal
                isOpen={deleteOpen}
                onClose={() => { setDeleteOpen(false); setDeleteDoc(null) }}
                onConfirm={handleDeleteConfirm}
                documentName={deleteDoc?.name}
                loading={deleting}
            />
        </div>
    )
}

export default Documents
