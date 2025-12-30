<script setup>
import { ref, onMounted } from 'vue'
import DownloadInput from './components/DownloadInput.vue'
import DownloadMonitor from './components/DownloadMonitor.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import api from './services/api'

const downloads = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch downloads from backend on mount
onMounted(async () => {
  await fetchDownloads()
})

const fetchDownloads = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await api.fetchDownloads()
    downloads.value = data
  } catch (err) {
    console.error('Error fetching downloads:', err)
    error.value = 'Failed to load downloads. Make sure the backend is running.'
  } finally {
    loading.value = false
  }
}

const addDownload = async (downloadData) => {
  try {
    // Create download in backend
    const download = await api.createDownload({
      url: downloadData.url,
      chapters: downloadData.chapters,
      startChapter: downloadData.startChapter,
      endChapter: downloadData.endChapter
    })
    
    // Add to local state
    downloads.value.unshift(download)
    
    // Simulate download progress
    setTimeout(() => {
      startDownload(download.id)
    }, 500)
  } catch (err) {
    console.error('Error creating download:', err)
    alert('Failed to create download. Make sure the backend is running.')
  }
}

const startDownload = async (id) => {
  const download = downloads.value.find(d => d.id === id)
  if (!download) return
  
  // Update status to downloading
  download.status = 'downloading'
  await api.updateDownload(id, { status: 'downloading' })
  
  // Simulate progress
  const interval = setInterval(async () => {
    if (download.progress < 100) {
      download.progress += Math.random() * 10
      if (download.progress > 100) download.progress = 100
      
      // Update progress in backend periodically
      if (Math.random() > 0.7) {
        await api.updateDownload(id, { progress: download.progress })
      }
    } else {
      download.status = 'completed'
      await api.updateDownload(id, { status: 'completed', progress: 100 })
      clearInterval(interval)
    }
  }, 500)
}

const removeDownload = async (id) => {
  try {
    await api.deleteDownload(id)
    const index = downloads.value.findIndex(d => d.id === id)
    if (index !== -1) {
      downloads.value.splice(index, 1)
    }
  } catch (err) {
    console.error('Error deleting download:', err)
    alert('Failed to delete download')
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <header class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-foreground mb-2">
              📚 Webtoon Downloader
            </h1>
            <p class="text-muted-foreground text-lg">
              Monitor and manage your webtoon chapter downloads
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main class="flex flex-row gap-8 flex-wrap">
        <DownloadInput @add-download="addDownload" />
        
        <DownloadMonitor 
          :downloads="downloads" 
          :loading="loading"
          :error="error"
          @remove-download="removeDownload" 
        />
      </main>
    </div>
  </div>
</template>
