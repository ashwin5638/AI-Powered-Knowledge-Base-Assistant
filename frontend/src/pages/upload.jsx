import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadDocument } from '../api/documents'
import { FiUploadCloud, FiFileText, FiX, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Upload = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown']
    const allowedExtensions = ['.pdf', '.txt', '.md']

    const validateFile = (f) => {
        if (!f) return false
        const ext = '.' + f.name.split('.').pop().toLowerCase()
        if (!allowedTypes.includes(f.type) && !allowedExtensions.includes(ext)) {
            toast.error('Only PDF, TXT, and MD files are allowed')
            return false
        }
        if (f.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB')
            return false
        }
        return true
    }

    const handleFile = (f) => {
        if (validateFile(f)) {
            setFile(f)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragActive(false)
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('document', file)

        try {
            await uploadDocument(formData)
            toast.success('Document uploaded successfully!')
            navigate('/documents')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
                    ${dragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : file
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }
                `}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />

                {file ? (
                    <div className="space-y-3">
                        <FiCheckCircle className="mx-auto text-green-500" size={48} />
                        <p className="text-lg font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null) }}
                            className="text-sm text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                        >
                            <FiX size={14} /> Remove
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <FiUploadCloud className="mx-auto text-gray-400" size={48} />
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                Drag & drop your file here
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                or click to browse
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <FiFileText size={14} />
                            <span>PDF, TXT, or MD — Max 5MB</span>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <FiUploadCloud size={18} />
                {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
        </div>
    )
}

export default Upload
