import api from './axios'

export const getDocuments = (params) => {
    return api.get('/documents', { params })
}

export const getDocument = (id) => {
    return api.get(`/documents/${id}`)
}

export const previewDocument = (id) => {
    return api.get(`/documents/${id}/preview`)
}

export const uploadDocument = (formData) => {
    return api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const deleteDocument = (id) => {
    return api.delete(`/documents/${id}`)
}
