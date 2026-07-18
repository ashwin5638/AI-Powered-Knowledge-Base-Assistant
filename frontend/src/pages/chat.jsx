import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getDocuments } from '../api/documents'
import { askQuestion, getDocumentChatHistory } from '../api/chat'
import { FiSend, FiMessageSquare, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const Chat = () => {
    const [searchParams] = useSearchParams()
    const selectedDocId = searchParams.get('document') || ''

    const [documents, setDocuments] = useState([])
    const [selectedDoc, setSelectedDoc] = useState(selectedDocId)
    const [question, setQuestion] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(false)
    const [docsLoading, setDocsLoading] = useState(true)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const fetchDocs = async () => {
            setDocsLoading(true)
            try {
                const { data } = await getDocuments()
                setDocuments(data.data.filter(d => d.status === 'ready'))
            } catch {
                toast.error('Failed to load documents')
            } finally {
                setDocsLoading(false)
            }
        }
        fetchDocs()
    }, [])

    useEffect(() => {
        if (!selectedDoc) return

        let cancelled = false
        const fetchHistory = async () => {
            setHistoryLoading(true)
            try {
                const { data } = await getDocumentChatHistory(selectedDoc)
                const formatted = data.data.map(c => [
                    { role: 'user', text: c.question },
                    { role: 'assistant', text: c.answer }
                ]).flat()
                setMessages(formatted)
            } catch {
                toast.error('Failed to load chat history')
            } finally {
                if (!cancelled) setHistoryLoading(false)
            }
        }
        fetchHistory()
        return () => { cancelled = true }
    }, [selectedDoc])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleAsk = async (e) => {
        e.preventDefault()
        if (!question.trim() || !selectedDoc) return

        const q = question.trim()
        setQuestion('')
        setMessages(prev => [...prev, { role: 'user', text: q }])
        setLoading(true)

        try {
            const { data } = await askQuestion(selectedDoc, q)
            setMessages(prev => [...prev, { role: 'assistant', text: data.data.answer }])
            toast.success('Answer received')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to get answer')
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    const selectedDocName = documents.find(d => d._id === selectedDoc)?.name || 'Select a document'

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>

            <div className="flex-shrink-0 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                {docsLoading ? (
                    <div className="w-full sm:w-80 h-10 bg-gray-100 rounded-lg animate-pulse" />
                ) : documents.length === 0 ? (
                    <p className="text-sm text-gray-500">No ready documents. Upload a document first.</p>
                ) : (
                    <select
                        value={selectedDoc}
                        onChange={(e) => { setSelectedDoc(e.target.value); setMessages([]) }}
                        className="w-full sm:w-80 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                    >
                        <option value="">-- Select a document --</option>
                        {documents.map(doc => (
                            <option key={doc._id} value={doc._id}>{doc.name} ({doc.fileType.toUpperCase()})</option>
                        ))}
                    </select>
                )}
            </div>

            {!selectedDoc ? (
                <div className="flex-1 flex items-center justify-center">
                    <EmptyState
                        icon={FiFileText}
                        title="Select a document to start chatting"
                    />
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                        {historyLoading ? (
                            <Spinner message="Loading history..." />
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <EmptyState
                                    icon={FiMessageSquare}
                                    title={`Ask a question about ${selectedDocName}`}
                                />
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                                            msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleAsk} className="flex-shrink-0 flex gap-2 mt-4">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:bg-gray-50"
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiSend size={16} />
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}

export default Chat
