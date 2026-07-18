import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import { FiFileText, FiHelpCircle, FiFile, FiFileMinus, FiUpload, FiMessageCircle, FiClock } from 'react-icons/fi'

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false
        const loadData = async () => {
            setLoading(true)
            setError('')
            try{
                const {data} = await api.get("/dashboard")
                if (!cancelled) setDashboard(data.data)
            } catch(err){
                if (!cancelled) setError(err.response?.data?.message || 'Failed to load dashboard data')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        loadData()
        return () => { cancelled = true }
    }, [retryCount])

    if(loading) return <Spinner message="Loading dashboard..." />

    if(error) return <ErrorState message={error} onRetry={() => setRetryCount(c => c + 1)} />

    if(!dashboard) return null

    const totalByType = dashboard.documentTypes.pdf + dashboard.documentTypes.txt + dashboard.documentTypes.md

    const stats = [
        { label: 'Total Documents', value: dashboard.totalDocuments, icon: FiFileText, color: 'bg-blue-500' },
        { label: 'Questions Asked', value: dashboard.totalQuestions, icon: FiHelpCircle, color: 'bg-green-500' },
        { label: 'PDF Files', value: dashboard.documentTypes.pdf, icon: FiFile, color: 'bg-red-500' },
        { label: 'TXT + MD Files', value: dashboard.documentTypes.txt + dashboard.documentTypes.md, icon: FiFileMinus, color: 'bg-purple-500' },
    ]

    const fileTypes = [
        { label: 'PDF', count: dashboard.documentTypes.pdf, color: 'bg-red-500' },
        { label: 'TXT', count: dashboard.documentTypes.txt, color: 'bg-blue-500' },
        { label: 'Markdown', count: dashboard.documentTypes.md, color: 'bg-purple-500' },
    ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${color} p-3 rounded-lg text-white`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">File Type Statistics</h2>
        {totalByType === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {fileTypes.map(({ label, count, color }) => {
              const pct = totalByType > 0 ? Math.round((count / totalByType) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiUpload size={18} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
          </div>

          {dashboard.recentUploads.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No documents uploaded yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {dashboard.recentUploads.map((doc) => (
                <div key={doc._id} className="py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-700">{doc.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase font-medium">{doc.fileType}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiMessageCircle size={18} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Questions</h2>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <FiClock size={12} />
              View All
            </button>
          </div>

          {dashboard.recentConversations.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No conversations yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {dashboard.recentConversations.map((chat) => (
                <div key={chat._id} className="py-3">
                  <p className="text-sm font-medium text-gray-900">{chat.question}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{chat.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
