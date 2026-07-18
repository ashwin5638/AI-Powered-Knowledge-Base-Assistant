import { useState, useEffect } from 'react'
import { FiSearch, FiMessageSquare, FiFileText, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'
import { getChatHistory, deleteChatMessage } from '../api/chat'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import toast from 'react-hot-toast'

const History = () => {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [expanded, setExpanded] = useState({})
    const [deletingId, setDeletingId] = useState(null)

    const fetchHistory = async (searchQuery = '') => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (searchQuery) params.search = searchQuery
            const { data } = await getChatHistory(params)
            setConversations(data.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load conversation history')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHistory(search)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const handleDelete = async (id, question) => {
        if (!window.confirm(`Delete this conversation?\n\n"${question}"`)) return
        setDeletingId(id)
        try {
            await deleteChatMessage(id)
            setConversations((prev) => prev.filter((c) => c._id !== id))
            toast.success('Conversation deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete conversation')
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Conversation History</h1>
                <span className="text-sm text-gray-500">{conversations.length} conversations</span>
            </div>

            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                />
            </div>

            {loading ? (
                <Spinner message="Loading history..." />
            ) : error ? (
                <ErrorState message={error} onRetry={() => fetchHistory(search)} />
            ) : conversations.length === 0 ? (
                <EmptyState
                    icon={FiMessageSquare}
                    title="No conversations yet"
                    message="Upload a document and start asking questions."
                />
            ) : (
                <div className="space-y-3">
                    {conversations.map((conv) => (
                        <div
                            key={conv._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <div className="p-2 bg-indigo-50 rounded-lg shrink-0 mt-0.5">
                                            <FiMessageSquare className="text-indigo-500" size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FiFileText className="text-gray-400 shrink-0" size={14} />
                                                <span className="text-xs font-medium text-gray-500 truncate">
                                                    {conv.document?.name || 'Unknown Document'}
                                                </span>
                                                <span className="text-xs text-gray-400 shrink-0">
                                                    {formatDate(conv.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{conv.question}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleExpand(conv._id)}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                                    >
                                        {expanded[conv._id] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(conv._id, conv.question)}
                                        disabled={deletingId === conv._id}
                                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>

                                {expanded[conv._id] && (
                                    <div className="mt-3 ml-11 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {conv.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History
