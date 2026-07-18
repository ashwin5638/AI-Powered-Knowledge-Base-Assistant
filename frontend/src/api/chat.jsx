import api from './axios'

export const askQuestion = (documentId, question) => {
    return api.post('/chat/ask', { documentId, question })
}

export const getChatHistory = (params) => {
    return api.get('/chat/history', { params })
}

export const getDocumentChatHistory = (documentId) => {
    return api.get(`/chat/history/${documentId}`)
}

export const deleteChatMessage = (id) => {
    return api.delete(`/chat/history/${id}`)
}
