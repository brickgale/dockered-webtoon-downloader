const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiService {
  async fetchDownloads(status = null) {
    const url = status 
      ? `${API_BASE_URL}/downloads?status=${status}` 
      : `${API_BASE_URL}/downloads`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch downloads')
    }
    return response.json()
  }

  async getDownload(id) {
    const response = await fetch(`${API_BASE_URL}/downloads/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch download')
    }
    return response.json()
  }

  async createDownload(downloadData) {
    const response = await fetch(`${API_BASE_URL}/downloads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(downloadData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create download')
    }
    return response.json()
  }

  async updateDownload(id, updates) {
    const response = await fetch(`${API_BASE_URL}/downloads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update download')
    }
    return response.json()
  }

  async deleteDownload(id) {
    const response = await fetch(`${API_BASE_URL}/downloads/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete download')
    }
    return true
  }

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`)
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    return response.json()
  }
}

export default new ApiService()
